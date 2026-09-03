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
    const result = await UserService.createUserToDB(userData, res);

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
  const result = await UserService.getUserProfileFromDB(user!);

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
    const user = req.user!;
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
  if (!req.body.password) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Password is required!');
  }
  const user = req.user!;
  const result = await UserService.deleteUserFromDB(user, req.body.password);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'User deleted successfully',
    data: result,
  });
})


const createConnectedAccount = catchAsync(async (req: Request, res: Response) => {
  const user = req.user!;
  const result = await UserService.createConnectedAccount(user);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Connected account created successfully',
    data: result,
  });
})

const getRefferalStatistics = catchAsync(async (req: Request, res: Response) => {
  const user = req.user!;
  const result = await UserService.getRefferalStatistics(user);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Refferal statistics fetched successfully',
    data: result,
  });
})

const getALlUsersFromDB = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.getALlUsersFromDB(req.query);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Users fetched successfully',
    data: result.data,
    pagination: result.pagination
  });
})

const lockUnlockUserById = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.lockUnlockUserById(req.params.id);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'User locked/unlocked successfully',
    data: result,
  });
})

const refferalToPhone = catchAsync(async (req: Request, res: Response) => {
  try {
    const { screen, ...restQuery } = req.query;

    const appName = process.env.APP_NAME;
    const playStoreUrl = process.env.GOOGLE_PLAY_STORE_URL;
    const appStoreUrl = process.env.APPLE_APP_STORE_URL;

    if (!screen || typeof screen !== "string") {
      return res.status(400).json({
        success: false,
        message: "screen query is required",
      });
    }

    if (!appName) {
      return res.status(500).json({
        success: false,
        message: "APP_NAME missing",
      });
    }

    // Build query string
    const query = new URLSearchParams();

    Object.entries(restQuery).forEach(([key, value]) => {
      if (typeof value === "string") {
        query.append(key, value);
      }
    });

    const queryString = query.toString();

    // Deep Link
    const deepLink = `${appName}://${screen}${queryString ? `?${queryString}` : ""
      }`;

    // Detect Device
    const userAgent = req.headers["user-agent"] || "";

    const isAndroid = /Android/i.test(userAgent);
    const isIOS = /iPhone|iPad|iPod/i.test(userAgent);

    const fallbackUrl = isIOS
      ? appStoreUrl
      : playStoreUrl;

    return res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Redirecting...</title>

        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        <script>
          const deepLink = "${deepLink}";
          const fallbackUrl = "${fallbackUrl}";

          // Redirect to store if app not installed
          const timeout = setTimeout(() => {
            window.location.replace(fallbackUrl);
          }, 1500);

          // Try opening app
          window.location.href = deepLink;

          // Extra fallback for some browsers
          const iframe = document.createElement("iframe");
          iframe.style.display = "none";
          iframe.src = deepLink;
          document.body.appendChild(iframe);

          // Cleanup
          window.addEventListener("pagehide", () => {
            clearTimeout(timeout);
          });
        </script>
      </head>

      <body
        style="
          margin:0;
          display:flex;
          align-items:center;
          justify-content:center;
          height:100vh;
          font-family:sans-serif;
        "
      >
        Opening App...
      </body>
      </html>
    `);
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
})

export const UserController = { createUser, getUserProfile, updateProfile, uploadFile, deleteUserFromDB, createConnectedAccount, getRefferalStatistics, getALlUsersFromDB, lockUnlockUserById, refferalToPhone };

