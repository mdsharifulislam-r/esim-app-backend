import mongoose from "mongoose";
import Stripe from "stripe";
import { airaloHelper } from "../helpers/airAloHelper";
import { Coupon, CouponUser } from "../app/modules/coupon/coupon.model";
import { Refferal, User, Wallet } from "../app/modules/user/user.model";
import stripe from "../config/stripe";
import { sendNotifications, sendNotificationsAdmin } from "../helpers/notificationHelper";
import { HoldDiscount } from "../app/modules/admin/admin.model";
import { Cart } from "../app/modules/cart/cart.model";
import { IMakeOrderRequest } from "../app/modules/esim/esim.interface";


export const handleCartPurchase = async (data: Stripe.Checkout.Session) => {
    const mongoSession = await mongoose.startSession()
    try {
        mongoSession.startTransaction();

        const metadata = data?.metadata?.data
        const payload = JSON.parse(metadata!);
        const cartItems = await Cart.find({ user: payload.description }).session(mongoSession);
        for (const item of cartItems) {
            const req = {
                package_id: item.esim.packageId,
                quantity: item.quantity,
                description: payload.description,
            }
            await airaloHelper.makeOrderAsync(req as IMakeOrderRequest);
            await new Promise(resolve => setTimeout(resolve, 500)); // Delay to prevent 429 errors
        }
        if (payload.coupon) {
            const getCopoun = await Coupon.findOne({ custom_code: payload.coupon })
            await CouponUser.create([{ user: payload.description, coupon: getCopoun?._id, coupon_str: payload.coupon }], { session: mongoSession });
            const discount = await HoldDiscount.findOne({ refferal_code: payload.coupon, status: "active" })
            if (discount) {
                await HoldDiscount.findOneAndUpdate({ refferal_code: payload.coupon, status: "active", owner: payload.description }, { status: "used" }, { upsert: true, new: true, session: mongoSession });
            }
            else {
                if (payload.commission) {
                    const user = await User.findOne({ refferal_code: payload.coupon }).select("+stripeAccountInfo")
                    if (user?.stripeAccountInfo?.loginUrl && user?.stripeAccountInfo?.accountId) {
                        await stripe.transfers.create({
                            amount: Math.round(payload.commission * 100),
                            currency: 'usd',
                            destination: user.stripeAccountInfo.accountId,
                            transfer_group: `ORDER_${data.id}`,
                        });
                        await Wallet.addMoneyToWallet(user._id.toString(), payload.commission, 0, mongoSession)
                    } else {
                        await Wallet.addMoneyToWallet(user!._id.toString(), 0, payload.commission, mongoSession)
                    }

                    const refferal = await Refferal.create([{
                        refferal_by: user?._id,
                        refferal_user: payload.description,
                        amount: payload.commission,
                        refferal_code: payload.coupon
                    }], { session: mongoSession })

                    sendNotifications({
                        title: "Commission Earned",
                        message: `You have earned a commission of $${payload.commission} from a referral purchase.`,
                        receiver: [user?._id!],
                        isRead: false,
                        referenceId: refferal[0]._id.toString() as any,
                        filePath: "referral"
                    })
                    sendNotificationsAdmin({
                        title: "New Referral Commission",
                        message: `A commission of $${payload.commission} has been earned from a referral purchase.`,
                        receiver: [],
                        isRead: false,
                        referenceId: refferal[0]._id.toString() as any,
                        filePath: "referral"
                    })
                }
            }

        }
        await mongoSession.commitTransaction();
        mongoSession.endSession();

    } catch (error) {
        mongoSession.abortTransaction();
        mongoSession.endSession();
        console.log(error);


    }
};