import { Types } from 'mongoose';
import { Cart } from './cart.model';
import ApiError from '../../../errors/ApiError';
import { StatusCodes } from 'http-status-codes';

const getAllCart = async (userId: string) => {
    const data = await Cart.find({ user: userId })
    const priceData = await Cart.aggregate([
        {
            $match: {
                user: new Types.ObjectId(userId),
            },
        },
        {
            $group: {
                _id: null,
                total: {
                    $sum: {
                        $multiply: [
                            { $toDouble: "$esim.priceUSD" },
                            "$quantity",
                        ],
                    },
                },
            },
        },
    ]);
    const priceBreakDown = {
        subTotal: Number(priceData[0]?.total?.toFixed(2)) || 0,
        total: Number(priceData[0]?.total?.toFixed(2)) || 0,
        discount: 0

    }
    return { data, priceBreakDown };
}
const createCart = async (userId: string, esim: any) => {
    const existCart = await Cart.findOne({ user: userId, 'esim.packageId': esim.packageId })
    if (existCart) {
        await Cart.findByIdAndUpdate(existCart._id, { $inc: { quantity: 1 } }, { new: true })
    } else {
        await Cart.create({ user: userId, esim })
    }
    const data = await getAllCart(userId)
    return data;
}
const updateCart = async (id: string, amount: number) => {
    const existCart = await Cart.findById(id)
    if (existCart?.quantity == 0 && amount < 0) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "Quantity cannot be zero")
    }
    const data = await Cart.findByIdAndUpdate(id, { $inc: { quantity: amount } }, { new: true })
    return data;
}
const deleteCart = async (id: string) => {
    const data = await Cart.findByIdAndDelete(id)
    return data;
}


export const CartServices = { getAllCart, createCart, updateCart, deleteCart };
