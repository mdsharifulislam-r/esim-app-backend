import express from 'express';
import { AdminController } from './admin.controller';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';
import validateRequest from '../../middlewares/validateRequest';
import { AdminValidations } from './admin.validation';
import fileUploadHandler from '../../middlewares/fileUploadHandler';

const router = express.Router();


router.route('/')
    .post(auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN), fileUploadHandler(), validateRequest(AdminValidations.createAdminZodSchema), AdminController.createAdmin)
    .get(auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN), AdminController.getAllAdmins)



router.route("/influencer")
    .post(auth(USER_ROLES.ADMIN,USER_ROLES.SUPER_ADMIN),fileUploadHandler(),validateRequest(AdminValidations.createInfluencerZodSchema),AdminController.createInfluencer)
    .get(auth(USER_ROLES.ADMIN,USER_ROLES.SUPER_ADMIN),AdminController.getAllInfluencer)
router.route("/influencer/:id")
    .patch(auth(USER_ROLES.ADMIN,USER_ROLES.SUPER_ADMIN),fileUploadHandler(),validateRequest(AdminValidations.updateInfluencerZodSchema),AdminController.updateInfluencer)
    .delete(auth(USER_ROLES.ADMIN,USER_ROLES.SUPER_ADMIN),AdminController.deleteInfluencer)
router.route("/discount")
    .post(auth(USER_ROLES.ADMIN,USER_ROLES.SUPER_ADMIN),validateRequest(AdminValidations.setDiscountForUserZodSchema),AdminController.setDiscountForUser)
    .get(auth(USER_ROLES.ADMIN,USER_ROLES.SUPER_ADMIN),AdminController.getDiscountForUser)
router.get("/statistics",auth(USER_ROLES.ADMIN,USER_ROLES.SUPER_ADMIN),AdminController.getSystemStatistic)


router.route('/:id')
    .patch(auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN), fileUploadHandler(), AdminController.updateAdmin)
    .delete(auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN), AdminController.deleteAdmin)
export const AdminRoutes = router;
