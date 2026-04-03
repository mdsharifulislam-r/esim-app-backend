import mongoose, { startSession } from 'mongoose';
import { USER_ROLES } from '../../../enums/user';
import ApiError from '../../../errors/ApiError';
import { sendNotifications } from '../../../helpers/notificationHelper';
import { Discount, HoldDiscount } from '../admin/admin.model';
import { Refferal, User } from './user.model';

const useRfferalCodeOfUser = async (userId: string, refferalCode: string) => {
  const mongoSession = await mongoose.startSession();
  try {
    mongoSession.startTransaction();
    const refferal = await Refferal.findOne({
      code: refferalCode,
      refferal_user: userId,
    }).session(mongoSession);
    if (refferal) {
      throw new ApiError(400, 'You already used this refferal code');
    }

    const [refferalUser, currentUser] = await Promise.all([
      User.findOne({ refferal_code: refferalCode }).select(
        '+stripeAccountInfo',
      ).session(mongoSession),
      User.findOne({ _id: userId }).session(mongoSession),
    ]);
    if (!refferalUser) {
      throw new ApiError(404, 'Refferal user not found');
    }

    const discountAmount = (await Discount.findOne().session(mongoSession))?.user_discount || 0;

    await Promise.all([
      Refferal.create(
        [
          {
            refferal_user: userId,
            refferal_by: refferalUser._id,
            amount: discountAmount,
            refferal_code: refferalCode,
          },
        ],
        { session: mongoSession },
      ),
      sendNotifications(
        {
          title: 'Refferal Bonus',
          message: `You have received a refferal bonus of ${discountAmount}% discount of your next purchase from ${currentUser?.name}`,
          receiver: [refferalUser._id],
          isRead: false,
          filePath: 'referral',
        },
        mongoSession,
      ),
      HoldDiscount.create(
        [
          {
            hold_discount: discountAmount,
            refferal_code: refferalCode,
            owner: userId,
            influencer: refferalUser._id,
          },
        ],
        { session: mongoSession },
      ),
      sendNotifications(
        {
          title: 'Refferal Bonus',
          message: `You have received a refferal bonus of ${discountAmount}% discount from ${refferalUser.name}`,
          receiver: [userId as any],
          isRead: false,
          filePath: 'referral',
        },
        mongoSession,
      ),
    ]);

    await mongoSession.commitTransaction();
    mongoSession.endSession();
  } catch (error) {
    await mongoSession.abortTransaction();
    mongoSession.endSession();
    throw new ApiError(
      500,
      error instanceof Error ? error.message : 'Refferal code process failed',
    );
  }
};

export const UserHelper = {
  useRfferalCodeOfUser,
};
