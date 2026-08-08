import express from 'express';
import { NewsletterController } from './newsletter.controller';
import validateRequest from '../../middlewares/validateRequest';
import { NewsletterValidations } from './newsletter.validation';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';

const router = express.Router();

router.route('/')
    .post(validateRequest(NewsletterValidations.createNewsletterSchema), NewsletterController.createNewsletter)
    .get(auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN), NewsletterController.getAllNewsletters);

router.route('/:id')
    .delete(auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN), NewsletterController.deleteNewsletter);

export const NewsletterRoutes = router;
