import express from 'express';
import { BannerController } from './banner.controller';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';
import validateRequest from '../../middlewares/validateRequest';
import { BannerValidations } from './banner.validation';
import tempAuth from '../../middlewares/tempAuth';

const router = express.Router();

router.route('/')
    .post(auth(USER_ROLES.ADMIN,USER_ROLES.SUPER_ADMIN),validateRequest(BannerValidations.createBannerZodSchema) ,BannerController.createBanner)
    .get(tempAuth(), BannerController.getAllBanners);

router.route('/:id')
    .delete(auth(USER_ROLES.ADMIN,USER_ROLES.SUPER_ADMIN),BannerController.deleteBanner)
    .patch(auth(USER_ROLES.ADMIN,USER_ROLES.SUPER_ADMIN),validateRequest(BannerValidations.updateBannerZodSchema),BannerController.updateBanner)

export const BannerRoutes = router;
