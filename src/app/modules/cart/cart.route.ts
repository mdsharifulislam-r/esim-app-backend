import express from 'express';
import { CartController } from './cart.controller';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { CartValidations } from './cart.validation';

const router = express.Router();

router.route('/')
    .post(auth(), validateRequest(CartValidations.createCartValidationZodSchema), CartController.createCart)
    .get(auth(), CartController.getCart)

router.route('/:id')
    .patch(auth(), validateRequest(CartValidations.updateCartValidationZodSchema), CartController.updateCart)
    .delete(auth(), CartController.deleteCart)

export const CartRoutes = router;
