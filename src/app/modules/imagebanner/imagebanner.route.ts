import express from 'express';
import { ImagebannerController } from './imagebanner.controller';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';
import fileUploadHandler from '../../middlewares/fileUploadHandler';
import validateRequest from '../../middlewares/validateRequest';
import { ImagebannerValidations } from './imagebanner.validation';
import tempAuth from '../../middlewares/tempAuth';

const router = express.Router();

router.route('/')
    .post(auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),fileUploadHandler(),validateRequest(ImagebannerValidations.createImagebannerSchema), ImagebannerController.createImagebanner)
    .get(tempAuth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN), ImagebannerController.getAllImagebanners)

router.route('/:id')
    .patch(auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),fileUploadHandler(),validateRequest(ImagebannerValidations.updateImagebannerSchema), ImagebannerController.updateImagebanner)
    .delete(auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN), ImagebannerController.deleteImagebanner)

export const ImagebannerRoutes = router;
