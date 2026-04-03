import express from "express";
import { CouponController } from "./coupon.controller";
import validateRequest from "../../middlewares/validateRequest";
import { CouponValidation } from "./coupon.validation";
import auth from "../../middlewares/auth";
import { USER_ROLES } from "../../../enums/user";
const router = express.Router();

router.route("/")
    .post(
        auth(USER_ROLES.ADMIN,USER_ROLES.SUPER_ADMIN),
        validateRequest(CouponValidation.createCouponZodSchema),
        CouponController.createCoupon
    )
    .get(auth(USER_ROLES.ADMIN,USER_ROLES.SUPER_ADMIN),CouponController.getAllCoupon)

router.route("/:id")
    .delete(
        auth(USER_ROLES.ADMIN,USER_ROLES.SUPER_ADMIN),
        CouponController.couponDelete
    )
    .patch(
        auth(USER_ROLES.ADMIN,USER_ROLES.SUPER_ADMIN),
        CouponController.updateCoupon
    ).get(auth(USER_ROLES.ADMIN,USER_ROLES.SUPER_ADMIN),CouponController.getCoupon)
router.route("/check")
    .post(auth(),validateRequest(CouponValidation.chackCouponZodSchema),CouponController.checkCoupon)

export const CouponRoutes = router;
