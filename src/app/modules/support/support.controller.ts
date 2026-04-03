import { Request, Response, NextFunction } from 'express';
import { SupportServices } from './support.service';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';

const createSupportMessage = catchAsync(async (req: Request, res: Response) => {
    const result = await SupportServices.createSupportMessage(req.body);
    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: 'Support message created successfully',
        data: result
    });
});

const getSupportMessages = catchAsync(async (req: Request, res: Response) => {
    const result = await SupportServices.getSupportMessages(req.query);
    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: 'Support messages fetched successfully',
        data: result.data,
        pagination: result.pagination
    });
});

const replySupportMessage = catchAsync(async (req: Request, res: Response) => {
    const result = await SupportServices.replySupportMessage(req.params.id, req.body?.message);
    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: 'Support message reply created successfully',
        data: result
    });
});

const deleteSupportMessage = catchAsync(async (req: Request, res: Response) => {
    const result = await SupportServices.deleteSupportMessage(req.params.id);
    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: 'Support message deleted successfully',
        data: result
    });
});

export const SupportController = {
    createSupportMessage,
    getSupportMessages,
    replySupportMessage,
    deleteSupportMessage
};
