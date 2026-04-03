import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import { getSingleFilePath } from '../../../shared/getFilePath';
import sendResponse from '../../../shared/sendResponse';
import { UserService } from './user.service';
import ApiError from '../../../errors/ApiError';

const createUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { ...userData } = req.body;
    const result = await UserService.createUserToDB(userData,res);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'User created successfully',
      data: result,
    });
  }
);

const getUserProfile = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  const result = await UserService.getUserProfileFromDB(user);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Profile data retrieved successfully',
    data: result,
  });
});

//update profile
const updateProfile = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    let image = getSingleFilePath(req.files, 'image');
    let cover = getSingleFilePath(req.files, 'cover');
    
    const data = {
      image,
      ...req.body,
      cover
    };
    const result = await UserService.updateProfileToDB(user, data);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Profile updated successfully',
      data: result,
    });
  }
);

const uploadFile = catchAsync(async (req: Request, res: Response) => {
  const file = getSingleFilePath(req.files, 'image');
  return sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'File uploaded successfully',
    data: file,
  })
});



const deleteUserFromDB = catchAsync(async (req: Request, res: Response) => {
  if(!req.body.password){
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Password is required!');
  }
  const user = req.user;
  const result = await UserService.deleteUserFromDB(user,req.body.password);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'User deleted successfully',
    data: result,
  });
})


const createConnectedAccount = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  const result = await UserService.createConnectedAccount(user);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Connected account created successfully',
    data: result,
  });
})

const getRefferalStatistics = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  const result = await UserService.getRefferalStatistics(user);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Refferal statistics fetched successfully',
    data: result,
  });
})
export const UserController = { createUser, getUserProfile, updateProfile, uploadFile, deleteUserFromDB, createConnectedAccount, getRefferalStatistics };

