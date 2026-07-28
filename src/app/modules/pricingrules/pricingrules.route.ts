import express from 'express';
import { PricingrulesController } from './pricingrules.controller';

import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { PricingrulesValidations } from './pricingrules.validation';
import { USER_ROLES } from '../../../enums/user';

const router = express.Router();

router.route("/")
    .post(auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN), validateRequest(PricingrulesValidations.createPricingrulesValidation), PricingrulesController.createPricingrules)
    .get(auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN), PricingrulesController.getPricingRules)

export const PricingrulesRoutes = router;
