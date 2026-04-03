import bcrypt from 'bcrypt';
import { StatusCodes } from 'http-status-codes';
import { model, Schema } from 'mongoose';
import config from '../../../config';
import { USER_ROLES } from '../../../enums/user';
import ApiError from '../../../errors/ApiError';
import { IRefferal, IUser, IWallet, RefferalModel, UserModal, WalletModel } from './user.interface';
import generateOTP from '../../../util/generateOTP';

const userSchema = new Schema<IUser, UserModal>(
  {
    name: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: Object.values(USER_ROLES),
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      select: 0,
      minlength: 8,
    },
    image: {
      type: String,
      default: 'https://i.ibb.co/z5YHLV9/profile.png',
    },
    status: {
      type: String,
      enum: ['active', 'delete'],
      default: 'active',
    },
    verified: {
      type: Boolean,
      default: false,
    },
    authentication: {
      type: {
        isResetPassword: {
          type: Boolean,
          default: false,
        },
        oneTimeCode: {
          type: Number,
          default: null,
        },
        expireAt: {
          type: Date,
          default: null,
        },
      },
      select: 0,
    },
    age: {
      type: Number,
      default: null,
    },
    date_of_birth: {
      type: Date,
      default: null,
    },
    gender: {
      type: String,
      default: null,
    },
    country: {
      type: String,
      default: '',
    },
    cover: {
      type: String,
      default: '',
    },
    contact: {
      type: String,
      default: '',
    },
    refferal_code: {
      type: String,
      unique: true,
    },
    discount: {
      type: Number,
      default: 0,
    },
    commission: {
      type: Number,
      default: 0,
    },
    stripeAccountInfo: {
      type: {
        accountId: String,
        loginUrl: String,
      },
      select: 0,
    },
    ref_referral_code: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

//exist user check
userSchema.statics.isExistUserById = async (id: string) => {
  const isExist = await User.findById(id);
  return isExist;
};

userSchema.statics.isExistUserByEmail = async (email: string) => {
  const isExist = await User.findOne({ email });
  return isExist;
};

//is match password
userSchema.statics.isMatchPassword = async (
  password: string,
  hashPassword: string
): Promise<boolean> => {
  return await bcrypt.compare(password, hashPassword);
};

//check user
userSchema.pre('save', async function (next) {
  //check user
  const isExist = await User.findOne({ email: this.email });
  if (isExist) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Email already exist!');
  }

  //password hash
  this.password = await bcrypt.hash(
    this.password,
    Number(config.bcrypt_salt_rounds)
  );
  this.refferal_code = Math.floor(100000 + Math.random() * 900000).toString();
  next();
});
userSchema.index({refferal_code:1},{unique:true})
export const User = model<IUser, UserModal>('User', userSchema);




export const walletSchema = new Schema<IWallet,WalletModel>({
  total_earnings: {
    type: Number,
    default: 0,
  },
  draft_balence: {
    type: Number,
    default: 0,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
},{
  timestamps: true
})


walletSchema.statics.addMoneyToWallet = async (userId: string, earnings: number, draft_balence: number, session: any): Promise<IWallet> => {
  const isExistWallet = await Wallet.findOne({ user: userId }).session(session);
  if (!isExistWallet) {
    const newWallet = await Wallet.create([{ user: userId, total_earnings: earnings, draft_balence }], { session });
    return newWallet[0];
  } else {
    isExistWallet.total_earnings += earnings;
    isExistWallet.draft_balence += draft_balence;
    (await isExistWallet.save()).$session(session);
    return isExistWallet;
  }
}

export const Wallet = model<IWallet,WalletModel>('Wallet', walletSchema);


const refferalSchema = new Schema<IRefferal,RefferalModel>({
  refferal_by: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  refferal_code: {
    type: String,
    required: true, 
  },
  refferal_user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  amount: {
    type: Number,
    default: 0,
  },
})
// refferalSchema.index({ refferal_by: 1, refferal_user: 1 }, { unique: true });
export const Refferal = model<IRefferal,RefferalModel>('Refferal', refferalSchema);
