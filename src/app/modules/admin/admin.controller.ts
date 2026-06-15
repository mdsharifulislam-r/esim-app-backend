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
    const image = getSingleFilePath(req.files, 'image');
    req.body.image = image
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


const deleteInfluencer = catchAsync(async (req: Request, res: Response) => {
    const result = await AdminServices.deleteInfluencer(req.params.id);
    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: 'Influencer deleted successfully',
        data: result
    })
});

const getSystemStatistic = catchAsync(async (req: Request, res: Response) => {
    const result = await AdminServices.getSystemStatistic();
    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: 'System statistic fetched successfully',
        data: result
    })
});



const createAdmin = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const image = getSingleFilePath(req.files, 'image')
        req.body.image = image
        const result = await AdminServices.createAdminIntoDB(req.body);
        return sendResponse(res, {
            statusCode: 200,
            success: true,
            message: 'Admin created successfully',
            data: result
        })
    }
)

const getAllAdmins = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const result = await AdminServices.getAllAdminsFromDB(req.query);
        return sendResponse(res, {
            statusCode: 200,
            success: true,
            message: 'Admins fetched successfully',
            data: result.admins,
            pagination: result.pagination
        })
    }
)

const updateAdmin = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;
        const image = getSingleFilePath(req.files, 'image')
        if (image) {
            req.body.image = image
        }
        const result = await AdminServices.updateAdminIntoDb(id, req.body);
        return sendResponse(res, {
            statusCode: 200,
            success: true,
            message: 'Admin updated successfully',
            data: result
        })
    }
)

const deleteAdmin = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;
        const result = await AdminServices.deleteAdminFromDB(id);
        return sendResponse(res, {
            statusCode: 200,
            success: true,
            message: 'Admin deleted successfully',
            data: result
        })
    }
)

export const AdminController = {
    createInfluencer,
    getAllInfluencer,
    updateInfluencer,
    setDiscountForUser,
    getDiscountForUser,
    deleteInfluencer,
    getSystemStatistic,
    createAdmin,
    getAllAdmins,
    updateAdmin,
    deleteAdmin
};
