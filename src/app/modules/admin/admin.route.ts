import express from 'express';
import { AdminController } from './admin.controller';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';
import validateRequest from '../../middlewares/validateRequest';
import { AdminValidations } from './admin.validation';
import fileUploadHandler from '../../middlewares/fileUploadHandler';

const router = express.Router();

router.route("/influencer")
    .post(auth(USER_ROLES.ADMIN,USER_ROLES.SUPER_ADMIN),fileUploadHandler(),validateRequest(AdminValidations.createInfluencerZodSchema),AdminController.createInfluencer)
    .get(auth(USER_ROLES.ADMIN,USER_ROLES.SUPER_ADMIN),AdminController.getAllInfluencer)
router.route("/influencer/:id")
    .patch(auth(USER_ROLES.ADMIN,USER_ROLES.SUPER_ADMIN),validateRequest(AdminValidations.updateInfluencerZodSchema),AdminController.updateInfluencer)
router.route("/discount")
    .post(auth(USER_ROLES.ADMIN,USER_ROLES.SUPER_ADMIN),validateRequest(AdminValidations.setDiscountForUserZodSchema),AdminController.setDiscountForUser)
    .get(auth(USER_ROLES.ADMIN,USER_ROLES.SUPER_ADMIN),AdminController.getDiscountForUser)

export const AdminRoutes = router;
