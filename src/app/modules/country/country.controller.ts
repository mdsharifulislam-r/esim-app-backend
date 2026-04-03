import { Request, Response, NextFunction } from 'express';
import { CountryServices } from './country.service';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';

const getRegionsList = catchAsync(async (req: Request, res: Response) => {
    const result = await CountryServices.getRegionsListFromApi();
    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: 'Regions list fetched successfully',
        data: result
    })
});

const getCountryBasedOnRegion = catchAsync(async (req: Request, res: Response) => {
    const { region } = req.query;
    const result = await CountryServices.getCountryBasedOnRegion(region as string);
    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: 'Country list fetched successfully',
        data: result
    })
});

export const CountryController = {
    getRegionsList,
    getCountryBasedOnRegion
};
