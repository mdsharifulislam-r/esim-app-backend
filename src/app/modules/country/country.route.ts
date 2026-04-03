import express from 'express';
import { CountryController } from './country.controller';

const router = express.Router();

router.get('/', CountryController.getCountryBasedOnRegion);

router.get('/regions', CountryController.getRegionsList);



export const CountryRoutes = router;
