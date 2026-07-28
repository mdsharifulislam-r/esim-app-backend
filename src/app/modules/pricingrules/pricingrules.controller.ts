import { Request, Response, NextFunction } from 'express';
import { PricingrulesServices } from './pricingrules.service';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';

const createPricingrules = catchAsync(async (req, res, next) => {
    const data = req.body
    const result = await PricingrulesServices.createPricingrules(data)
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Pricingrules created successfully',
        data: result
    })
})

const getPricingRules = catchAsync(async (req, res, next) => {
    const result = await PricingrulesServices.getPricingRules()
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Pricingrules fetched successfully',
        data: result
    })
})


export const PricingrulesController = { createPricingrules, getPricingRules };
