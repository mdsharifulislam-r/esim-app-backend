import { Request, Response } from 'express';
import { AiraloOrderResponse } from '../types/esim/e-sim.type';
import { Esim } from '../app/modules/esim/esim.model';
import mongoose from 'mongoose';
import { RedisHelper } from '../tools/redis/redis.helper';
import { sendNotifications, sendNotificationsAdmin } from '../helpers/notificationHelper';
import { EsimPackage } from '../types/packagesType';
import { Cart } from '../app/modules/cart/cart.model';

export const handleAiraloWebhook = async (req: Request, res: Response) => {
  const mongoSession = await mongoose.startSession();
  try {
    mongoSession.startTransaction();
    const { data }: { data: AiraloOrderResponse } = req.body;
    const cartItem = await Cart.findOne({ user: data.description, "esim.packageId": data.package_id });
    if (!cartItem) {
      throw new Error("Cart item not found");
    }
    const orderInfo = {
      description: cartItem.user,
      country: cartItem.esim.countryName,
      supported_countries: cartItem.esim.supported_countries
    }
    const rawData = cartItem.esim;


    await Esim.findOneAndUpdate({ user: data.description, status: "active" }, { status: "archived" }, { session: mongoSession });

    const esim = await Esim.create([{
      package_name: data.package,
      code: data.code,
      quantity: data.quantity,
      validity: data.validity,
      data: data.data,
      text: data['1']?.data?.text,
      voice: data['1']?.data?.voice,
      price: data.price,
      manual_installation: data.manual_installation,
      qr_installation: data.qrcode_installation,
      sims: data.sims,
      installation_guides: data.installation_guides.en,
      net_price: data.net_price,
      startDate: data.created_at,
      user: data.description,
      packageId: data.package_id,
      type: data.type,
      id: data.id,
      country: orderInfo.country,
      supported_countries: orderInfo.supported_countries,
      oparator_info: {
        country_code: rawData.countryName,
        name: rawData.operatorName,
        image: rawData.operatorImage
      }
    }], { session: mongoSession });
    sendNotifications({
      receiver: [orderInfo.description],
      title: 'You successfully purchased an eSIM',
      message: `Your eSIM for ${data.package} has been successfully purchased.`,
      isRead: false,
      filePath: "booking",
      referenceId: esim[0]._id
    })
    sendNotificationsAdmin({
      receiver: [],
      title: 'New eSIM Order',
      message: `A new eSIM order for ${data.package} has been placed`,
      isRead: false,
      filePath: "booking",
      referenceId: esim[0]._id
    })
    await Cart.deleteOne({ _id: cartItem._id }, { session: mongoSession })
    await RedisHelper.keyDelete(`esim-order:${cartItem.user}:*`)
    await mongoSession.commitTransaction();
    mongoSession.endSession();
    return res.status(200).json({ esim });
  } catch (error) {
    await mongoSession.abortTransaction();
    mongoSession.endSession();
    console.log(error);
    return res.status(500).json({ error });
  }
};
