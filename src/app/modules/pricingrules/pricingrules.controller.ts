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
    const result = await PricingrulesServices.getPricingRules(req.query)
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Pricingrules fetched successfully',
        data: result.data,
        pagination: result.pagination
    })
})

const updatePricingrules = catchAsync(async (req, res, next) => {
    const data = req.body
    const result = await PricingrulesServices.updatePricingrules(req.params.id, data)
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Pricingrules updated successfully',
        data: result
    })
})

const deletePricingRules = catchAsync(async (req, res, next) => {
    const result = await PricingrulesServices.deletePricingRules(req.params.id)
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Pricingrules deleted successfully',
        data: result
    })
})


export const PricingrulesController = { createPricingrules, getPricingRules, updatePricingrules, deletePricingRules };
