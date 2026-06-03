import { Request, Response, NextFunction } from 'express';
import { BannerServices } from './banner.service';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';


const createBanner =catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { text } = req.body;
    const result = await BannerServices.createBanner(text);
    sendResponse(res, {
        success: true,
        statusCode: 201,
        message: 'Banner created successfully',
        data: result,
    })
});

const getAllBanners = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    const result = await BannerServices.getAllBanners(user!);
    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: 'Banners retrieved successfully',
        data: result,
    })
});

const updateBanner = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const payload = req.body;
    const result = await BannerServices.updateBanner(id, payload);
    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: 'Banner updated successfully',
        data: result,
    })
});

const deleteBanner = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const result = await BannerServices.deleteBanner(id);
    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: 'Banner deleted successfully',
        data: result,
    })
});

export const BannerController = { createBanner, getAllBanners, updateBanner, deleteBanner };
