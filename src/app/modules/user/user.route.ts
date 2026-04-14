import express, { NextFunction, Request, Response } from 'express';
import { USER_ROLES } from '../../../enums/user';
import auth from '../../middlewares/auth';
import fileUploadHandler from '../../middlewares/fileUploadHandler';
import validateRequest from '../../middlewares/validateRequest';
import { UserController } from './user.controller';
import { UserValidation } from './user.validation';
const router = express.Router();

router
  .route('/profile')
  .get(auth(), UserController.getUserProfile)
  .patch(
    auth(),
    fileUploadHandler([{name:'cover',type:['image/jpeg'],maxCount:1}]),
    (req: Request, res: Response, next: NextFunction) => {
      if (req.body.data) {
        req.body = UserValidation.updateUserZodSchema.parse(
          JSON.parse(req.body.data)
        );
      }
      return UserController.updateProfile(req, res, next);
    }
  );

router
  .route('/')
  .post(
    validateRequest(UserValidation.createUserZodSchema),
    UserController.createUser
  )
  .delete(auth(), UserController.deleteUserFromDB)
  .get(auth(USER_ROLES.ADMIN,USER_ROLES.SUPER_ADMIN), UserController.getALlUsersFromDB);

router.patch("/lock/:id", auth(USER_ROLES.ADMIN,USER_ROLES.SUPER_ADMIN), UserController.lockUnlockUserById);

router.get("/connected-account", auth(USER_ROLES.INFLUENCER), UserController.createConnectedAccount);

router.get("/refferal-info", auth(), UserController.getRefferalStatistics);

router.route('/upload-file').post(fileUploadHandler(), UserController.uploadFile);
export const UserRoutes = router;
