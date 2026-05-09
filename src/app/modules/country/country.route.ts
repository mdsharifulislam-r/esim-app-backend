import express from 'express';
import { CountryController } from './country.controller';

const router = express.Router();

router.get('/', CountryController.getCountryBasedOnRegion);

router.get('/regions', CountryController.getRegionsList);

router.get('/search', CountryController.searchCountries);



export const CountryRoutes = router;
