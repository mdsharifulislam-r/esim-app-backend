import { Request, Response, NextFunction } from 'express';
import { NewsletterServices } from './newsletter.service';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';

const createNewsletter = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const data = req.body;
    const result = await NewsletterServices.createNewsletter(data);
    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: 'Newsletter created successfully',
        data: result
    });
});

const getAllNewsletters = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const query = req.query;
    const result = await NewsletterServices.getAllNewsletters(query);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Newsletters retrieved successfully',
        data: result.data,
        pagination: result.pagination
    });
});

const deleteNewsletter = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const result = await NewsletterServices.deleteNewsletter(id);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Newsletter deleted successfully',
        data: result
    });
});


export const NewsletterController = { createNewsletter, getAllNewsletters, deleteNewsletter };
