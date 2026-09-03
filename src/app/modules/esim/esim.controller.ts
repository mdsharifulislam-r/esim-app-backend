import { Request, Response, NextFunction } from 'express';
import { EsimServices } from './esim.service';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';

const getPackagesOfEsim = catchAsync(async (req: Request, res: Response) => {
    const result = await EsimServices.getPackagesOfEsim(req.body);
    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: 'Packages fetched successfully',
        data: result.data,
        pagination: result.pagination
    })
});


const makeOrderOfPackage = catchAsync(async (req: Request, res: Response) => {
    const result = await EsimServices.makeOrderForPackage(req.body, req.user!);
    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: 'Order created successfully',
        data: result
    })
});


const getEsimInstallationGuidelines = catchAsync(async (req: Request, res: Response) => {
    const result = await EsimServices.getEsimInstallationGuidelines(req.params.id);
    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: 'Guidelines fetched successfully',
        data: result
    })
});

const getUserAllEsimOrder = catchAsync(async (req: Request, res: Response) => {
    const result = await EsimServices.getUserAllEsimOrder(req.user!, req.query);
    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: 'Guidelines fetched successfully',
        data: result.data,
        pagination: result.pagination
    })
})

const getSingleOrderDetails = catchAsync(async (req: Request, res: Response) => {
    const result = await EsimServices.getSingleOrderDetails(req.params.id);
    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: 'Guidelines fetched successfully',
        data: result
    })
})

const getRegionalEsimPackages = catchAsync(async (req: Request, res: Response) => {
    const result = await EsimServices.getRegionalEsim(req.params.id, req.query?.page as any, req.query?.limit as any, req.query?.sort_order as any);
    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: 'Guidelines fetched successfully',
        data: result
    })
})

export const EsimController = {
    getPackagesOfEsim,
    makeOrderOfPackage,
    getEsimInstallationGuidelines,
    getUserAllEsimOrder,
    getSingleOrderDetails,
    getRegionalEsimPackages
};
