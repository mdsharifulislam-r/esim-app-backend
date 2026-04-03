import { StatusCodes } from 'http-status-codes';
import Stripe from 'stripe';

import stripe from '../config/stripe';
import ApiError from '../errors/ApiError';
import mongoose, { Types } from 'mongoose';
import { User, Wallet } from '../app/modules/user/user.model';
import { sendNotifications } from '../helpers/notificationHelper';
import { IWallet } from '../app/modules/user/user.interface';

export const handleAccountUpdatedEvent = async (data: Stripe.Account) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    // Find the user by Stripe account ID
    const existingUser = await User.findOne({
      'stripeAccountInfo.accountId': data.id,
    });

    if (!existingUser) {
      return console.log('User not found');
    }

    // Check if the onboarding is complete
    if (data.charges_enabled) {
      const loginLink = await stripe.accounts.createLoginLink(data.id);

      // Save Stripe account information to the user record
      await User.findByIdAndUpdate(
        existingUser?._id,
        {
          $set: {
            'stripeAccountInfo.accountId': data.id,
            'stripeAccountInfo.loginUrl': loginLink.url,
          },
        },
        { session },
      );
    }

    // const wallet = await Wallet.findOne({ user: existingUser?._id }).session(
    //   session,
    // );

    // if (wallet && wallet.draft_balence > 0) {
    // //   sendDraftBalanceNotification(existingUser._id, data, session, wallet);
    // }

    await session.commitTransaction();
    session.endSession();
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

async function sendDraftBalanceNotification(
  userId: Types.ObjectId,
  data: Stripe.Account,
  session: any,
  wallet: IWallet,
) {
  try {
    if (wallet && wallet.draft_balence > 0) {
      setTimeout(async () => {
        try {
          await stripe.transfers.create({
            amount: Math.round(wallet.draft_balence * 100),
            currency: 'usd',
            destination: data.id,
          });
          await Wallet.addMoneyToWallet(
            userId.toString(),
            wallet.draft_balence,
            -wallet.draft_balence,
            session,
          );
          sendNotifications({
            title: 'Commission Transferred',
            message: `Your pending commission of $${wallet.draft_balence} has been transferred to your Stripe account.`,
            receiver: [userId],
            isRead: false,
            filePath: 'payment',
          });
        } catch (error) {
          console.error('Error occurred while creating transfer:', error);
        }
      }, 100000); // Delay the transfer by 100 seconds to ensure the account is fully set up
    }
  } catch (error) {
    console.log(error);
  }
}
