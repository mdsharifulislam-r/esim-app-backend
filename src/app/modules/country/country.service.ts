import { countryHelper } from "../../../helpers/countryHelper";
import { EmptyCountry } from "./country.model";

const getRegionsListFromApi = async () => {
    const regions = await countryHelper.getCountrysRegions();
    return regions
};

const getCountryBasedOnRegion = async (region: string, countryName?: string) => {
    if (countryName) {
        return searchCountries(countryName)
    }
    const emptyCountries = await EmptyCountry.find().distinct('code');
    const regions = (await countryHelper.getCountryBasedOnRegion(region))?.filter((country: any) => !emptyCountries.includes(country.cca2));
    return regions
};

const searchCountries = async (countryName: string) => {
    const allCountries = await countryHelper.getAllCountries();
    // search by Regex match for country name
    const regex = new RegExp(countryName, 'i');
    const filterCountries = allCountries.filter((country) => {
        return regex.test(country.name)
    })
    return filterCountries
};

export const CountryServices = {
    getRegionsListFromApi,
    getCountryBasedOnRegion,
    searchCountries,
};
