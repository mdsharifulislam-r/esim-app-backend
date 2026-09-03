import { Request, Response, NextFunction } from 'express';
import { CartServices } from './cart.service';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { StatusCodes } from 'http-status-codes';


const createCart = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const data = await CartServices.createCart((req.user as any)!.id, req.body)

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        message: "Item added to cart successfully",
        success: true,
        data: data,
    });
})

const getCart = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const data = await CartServices.getAllCart((req.user as any)!.id)

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        message: "Cart fetched successfully",
        success: true,
        data: data,
    });
})


const updateCart = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const data = await CartServices.updateCart(req.params?.id, req.body?.quantity)

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        message: "Cart updated successfully",
        success: true,
        data: data,
    });
})

const deleteCart = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const data = await CartServices.deleteCart(req.params?.id,)

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        message: "Item removed from cart successfully",
        success: true,
        data: data,
    });
})


export const CartController = { createCart, getCart, updateCart, deleteCart };
