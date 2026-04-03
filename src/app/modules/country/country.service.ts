import { countryHelper } from "../../../helpers/countryHelper";

const getRegionsListFromApi =async () => {
    const regions = await countryHelper.getCountrysRegions();
    return regions
};

const getCountryBasedOnRegion =async (region: string) => {
    const regions = await countryHelper.getCountryBasedOnRegion(region);
    return regions
};

export const CountryServices = {
    getRegionsListFromApi,
    getCountryBasedOnRegion
};
