import { StatusCodes } from 'http-status-codes';
import { JwtPayload } from 'jsonwebtoken';
import { USER_ROLES } from '../../../enums/user';
import ApiError from '../../../errors/ApiError';
import { emailHelper } from '../../../helpers/emailHelper';
import { emailTemplate } from '../../../shared/emailTemplate';
import unlinkFile from '../../../shared/unlinkFile';
import generateOTP from '../../../util/generateOTP';
import { IUser } from './user.interface';
import { Refferal, User, Wallet } from './user.model';
import { AuthHelper } from '../auth/auth.helper';
import { Response } from 'express';
import stripe from '../../../config/stripe';
import { Types } from 'mongoose';
import QueryBuilder from '../../builder/QueryBuilder';

const createUserToDB = async (payload: Partial<IUser>,res:Response) => {
  const isExist = await User.findOne({ email: payload.email });
  if (isExist) {
    if(isExist.status === 'delete') throw new ApiError(StatusCodes.BAD_REQUEST, 'You don’t have permission to access this content.It looks like your account has been deactivated.');
    if(!isExist.verified){
      return await AuthHelper.unverifiedAccountHandle(payload.email!,res);
    }
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Email already exist!');

  }

  if(payload.refferal_code){
    payload.ref_referral_code = payload.refferal_code
    delete payload.refferal_code
  }
  payload.role = USER_ROLES.USER;
  const createUser = await User.create(payload);
  if (!createUser) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to create user');
  }

  //send email
  const otp = generateOTP();
  const values = {
    name: createUser.name,
    otp: otp,
    email: createUser.email!,
  };
  const createAccountTemplate = emailTemplate.createAccount(values);
  emailHelper.sendEmail(createAccountTemplate);

  //save to DB
  const authentication = {
    oneTimeCode: otp,
    expireAt: new Date(Date.now() + 3 * 60000),
  };
  await User.findOneAndUpdate(
    { _id: createUser._id },
    { $set: { authentication } }
  );

  
  return createUser;
};

const getUserProfileFromDB = async (
  user: JwtPayload
): Promise<Partial<IUser>> => {
  const { id } = user;
  const isExistUser = await User.isExistUserById(id);
  if (!isExistUser) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "User doesn't exist!");
  }

  return isExistUser;
};

const updateProfileToDB = async (
  user: JwtPayload,
  payload: Partial<IUser>
): Promise<Partial<IUser | null>> => {
  const { id } = user;
  const isExistUser = await User.isExistUserById(id);
  if (!isExistUser) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "User doesn't exist!");
  }

  //unlink file here
  if (payload.image) {
    unlinkFile(isExistUser.image);
  }

  const updateDoc = await User.findOneAndUpdate({ _id: id }, payload, {
    new: true,
  });

  return updateDoc;
};


const deleteUserFromDB = async (user: JwtPayload,password:string) => {
  const { id } = user;
  const isExistUser = await User.findOne({ _id: id }).select('+password');
  if (!isExistUser) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "User doesn't exist!");
  }

  //check match password
  if (password && !(await User.isMatchPassword(password, isExistUser.password))) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Password is incorrect');
  }
  const deletedUser = await User.findOneAndUpdate(
    { _id: id },
    { $set: { status: 'delete' } },
    { new: true }
  );
  return deletedUser;
};




const createConnectedAccount = async (user: JwtPayload) => {
  const userDetails = await User.findOne({ _id: user.id }).select('+stripeAccountInfo');
  if (!userDetails) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "User doesn't exist!");
  }

  if (userDetails?.stripeAccountInfo?.loginUrl) {
    return {
      data: userDetails.stripeAccountInfo.loginUrl,
    };
  }

  const account = await stripe.accounts.create({
    type: 'express',
    country: 'US',
    email: user.email,
    capabilities: {
      card_payments: { requested: true },
      transfers: { requested: true },
    },
    business_type: 'individual',
    individual: {
      first_name: userDetails.name,
      email: userDetails.email,
    },
    business_profile: {
      mcc: '7299',
      product_description: 'Freelance services on demand',
      url: 'https://yourplatform.com',
    },
  });

  const accountLink = await stripe.accountLinks.create({
    account: account.id,
    refresh_url: 'https://yourplatform.com/refresh',
    return_url: 'https://yourplatform.com/return',
    type: 'account_onboarding',
  });

  await User.findOneAndUpdate(
    { _id: user.id },
    { $set: { 'stripeAccountInfo.accountId': account.id } }
  );

  
  return {
    data: accountLink.url,
  };
};

const getRefferalStatistics = async (user: JwtPayload) => {
  const totalRefferal = await Refferal.countDocuments({refferal_by: user.id });
  const total_earnings = +Number((await Refferal.aggregate([
    {
      $match: {
        refferal_by: new Types.ObjectId(user.id),
      },
    },
    {
      $group: {
        _id: null,
        totalEarnings: {
          $sum: '$amount',
        },
      },
    },
  ]))[0]?.totalEarnings || 0).toFixed(2)
    
  const monthly_earnings =await Refferal.aggregate([
    {
      $match: {
        refferal_by: new Types.ObjectId(user.id),
      },
    },
    {
      $group: {
        _id: {
          $month: '$createdAt',
        },
        total_earnings: {
          $sum: '$amount',
        },
      },
    },
  ]);
  const avgEarnings = monthly_earnings.length > 0 ? monthly_earnings.reduce((acc, curr) => acc + curr.total_earnings, 0) / monthly_earnings.length : 0;
  return {
    total_share: totalRefferal,
    total_earnings,
    collected_money : total_earnings,
    monthly_earnings:Number(avgEarnings.toFixed(2)),
  }
}

const getALlUsersFromDB = async (query:Record<string,any>) => {
  const userQuery = new QueryBuilder(User.find({verified:true,role:USER_ROLES.USER}),query).paginate().sort().search(['name','email'])
  const [users,pagination] = await Promise.all([userQuery.modelQuery.exec(),userQuery.getPaginationInfo()]);
  return {data:users,pagination}
};

const lockUnlockUserById = async (id:string) => {
  const user = await User.findById(id);
  if(!user){
    throw new ApiError(StatusCodes.NOT_FOUND, "User not found!");
  }
  const updateDoc = await User.findOneAndUpdate({ _id: id }, { $set: { status: user.status === 'active' ? 'delete' : 'active' } }, { new: true });
  return updateDoc;

}


export const UserService = {
  createUserToDB,
  getUserProfileFromDB,
  updateProfileToDB,
  deleteUserFromDB,
  createConnectedAccount,
  getRefferalStatistics,
  getALlUsersFromDB,
  lockUnlockUserById
};
