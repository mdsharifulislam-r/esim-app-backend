import express from 'express';
import { SupportController } from './support.controller';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';
import validateRequest from '../../middlewares/validateRequest';
import { SupportValidations } from './support.validation';

const router = express.Router();

router.route('/')
    .get(auth(USER_ROLES.ADMIN,USER_ROLES.SUPER_ADMIN),SupportController.getSupportMessages)
    .post(validateRequest(SupportValidations.createSupportZodSchema),SupportController.createSupportMessage)

router.route('/:id')
    .patch(auth(USER_ROLES.ADMIN,USER_ROLES.SUPER_ADMIN),validateRequest(SupportValidations.replySupportMessageZodSchema),SupportController.replySupportMessage)
    .delete(auth(USER_ROLES.ADMIN,USER_ROLES.SUPER_ADMIN),SupportController.deleteSupportMessage)

export const SupportRoutes = router;
