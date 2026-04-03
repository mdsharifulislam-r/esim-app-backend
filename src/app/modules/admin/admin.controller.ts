import { Request, Response, NextFunction } from 'express';
import { AdminServices } from './admin.service';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { getSingleFilePath } from '../../../shared/getFilePath';

const createInfluencer = catchAsync(async (req: Request, res: Response) => {
    const image = getSingleFilePath(req.files, 'image');
    req.body.image = image
    const result = await AdminServices.createInfluencer(req.body);
    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: 'Influencer created successfully',
        data: result
    })
});


const getAllInfluencer = catchAsync(async (req: Request, res: Response) => {
    const result = await AdminServices.getAllInfluencer(req.query);
    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: 'Influencers fetched successfully',
        data: result.data,
        pagination: result.pagination
    })
});

const updateInfluencer = catchAsync(async (req: Request, res: Response) => {
    const result = await AdminServices.updateInfluencer(req.params.id,req.body);
    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: 'Influencer updated successfully',
        data: result
    })
});

const setDiscountForUser = catchAsync(async (req: Request, res: Response) => {
    const { amount } = req.body
    
    const result = await AdminServices.setDiscountForUser(amount);
    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: 'Discount set successfully',
        data: result
    })
});

const getDiscountForUser = catchAsync(async (req: Request, res: Response) => {
    const result = await AdminServices.getDiscountForUser();
    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: 'Discount fetched successfully',
        data: result
    })
});


export const AdminController = {
    createInfluencer,
    getAllInfluencer,
    updateInfluencer,
    setDiscountForUser,
    getDiscountForUser
};
