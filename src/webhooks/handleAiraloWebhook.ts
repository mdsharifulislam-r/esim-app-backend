import { Request, Response } from 'express';
import { AiraloOrderResponse } from '../types/esim/e-sim.type';
import { Esim } from '../app/modules/esim/esim.model';
import mongoose from 'mongoose';
import { RedisHelper } from '../tools/redis/redis.helper';
import { sendNotifications, sendNotificationsAdmin } from '../helpers/notificationHelper';
import { EsimPackage } from '../types/packagesType';

export const handleAiraloWebhook = async (req: Request, res: Response) => {
    const mongoSession = await mongoose.startSession();
  try {
    mongoSession.startTransaction();
    const { data }: { data: AiraloOrderResponse } = req.body;
    
    const orderInfo = await RedisHelper.redisGet(`esim-order:${data.description}:${data.package_id}`);
    const rawData:EsimPackage = await RedisHelper.redisGet(`esim-data:${data.description}:${data.package_id}`);
    if (!orderInfo) {
        throw new Error('Order not found');
    }

    await Esim.findOneAndUpdate({ user:data.description,status:"active" }, { status: "archived" }, { session: mongoSession });
    
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
      oparator_info:{
        country_code:rawData.countryName,
        name:rawData.operatorName,
        image:rawData.operatorImage
      }
    }], { session: mongoSession });
    sendNotifications({
      receiver: [orderInfo.description],
      title: 'Esim Order',
      message: `Esim Order for ${data.package} has been placed`,
      isRead: false,
      filePath:"booking",
      referenceId: esim[0]._id
    })
    sendNotificationsAdmin({
      receiver: [],
      title: 'Esim Order',
      message: `A new esim order for ${data.package} has been placed`,
      isRead: false,
      filePath:"booking",
      referenceId: esim[0]._id
    })
    await RedisHelper.keyDelete(`esim-order:${data.description}:${data.package_id}:*`);
    await RedisHelper.keyDelete(`esim-order:${data.description}:*`);
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
