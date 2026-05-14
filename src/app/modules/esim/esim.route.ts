import express from 'express';
import { EsimController } from './esim.controller';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { EsimValidations } from './esim.validation';

const router = express.Router();

router.post("/packages", validateRequest(EsimValidations.getPackagesOfEsimZodSchema), EsimController.getPackagesOfEsim);
router.get("/packages/:id", validateRequest(EsimValidations.getRegionalEsimPackagesZodSchema), EsimController.getRegionalEsimPackages);
router.route("/order")
    .post(auth(), validateRequest(EsimValidations.makeOrderForPackageZodSchema), EsimController.makeOrderOfPackage)
    .get(auth(), EsimController.getUserAllEsimOrder);
router.route("/order/:id")
    .get(auth(), EsimController.getSingleOrderDetails);
router.get("/guidelines/:id", auth(), EsimController.getEsimInstallationGuidelines);
export const EsimRoutes = router;
