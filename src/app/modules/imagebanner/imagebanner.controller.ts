import { Request, Response, NextFunction } from 'express';
import { ImagebannerServices } from './imagebanner.service';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { getSingleFilePath } from '../../../shared/getFilePath';

const createImagebanner = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const data = req.body;
    const image = getSingleFilePath(req.files, 'image');
    data.thumbnail = image
    const result = await ImagebannerServices.createImagebanner(data);
    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: 'Imagebanner created successfully',
        data: result
    });
});

const getAllImagebanners = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    const result = await ImagebannerServices.getAllImagebanners(user);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Imagebanners retrieved successfully',
        data: result
    });
});

const updateImagebanner = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const data = req.body;
    if (req.files) {
        const image = getSingleFilePath(req.files, 'image');
        data.thumbnail = image
    }
    const result = await ImagebannerServices.updateImagebanner(id, data);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Imagebanner updated successfully',
        data: result
    });
});

const deleteImagebanner = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const result = await ImagebannerServices.deleteImagebanner(id);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Imagebanner deleted successfully',
        data: result
    });
});


export const ImagebannerController = { createImagebanner, getAllImagebanners, updateImagebanner, deleteImagebanner };
