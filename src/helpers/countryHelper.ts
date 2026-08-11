import { CountryResponse } from '../app/modules/country/country.interface';
import config from '../config';
import { RedisHelper } from '../tools/redis/redis.helper';

const getCountrysRegions = async () => {
  // const cache = await RedisHelper.redisGet('countrys-regions');
  // if (cache) return cache;
  const countrysRegions: string[] = [
    'Africa',
    'Europe',
    'Asia',
    'Middle East',
    'Oceania',
    'North America',
    'South America',
  ];

  // await RedisHelper.redisSet('countrys-regions', { countrysRegions, subregions }, {}, 60 * 60 * 24);
  return { countrysRegions, subregions };
};

const baseUrl = 'https://api.restcountries.com/countries/v5';

export const subregions = [
  {
    name: 'Asia',
    slugname: 'asia',
    tags: ['asia', 'asian', 'apac', 'south-asia', 'east-asia'],
    image:
      'https://res.cloudinary.com/dkbcx9amc/image/upload/v1775025951/Rectangle_5289_kk7pkg.png',
  },
  {
    name: 'Europe',
    slugname: 'europe',
    tags: ['europe', 'eu', 'european', 'western-europe', 'eastern-europe'],
    image:
      'https://res.cloudinary.com/dkbcx9amc/image/upload/v1775025951/Rectangle_5289_3_z257pv.png',
  },
  {
    name: 'Middle East',
    slugname: 'middle-east',
    tags: ['middle-east','middle-east-and-north-africa'],
    image:
      'https://res.cloudinary.com/dkbcx9amc/image/upload/v1775025950/Rectangle_5289_6_uh9ror.png',
  },
  {
    name: 'North America',
    slugname: 'north-america',
    tags: ['north-america', 'canada', 'mexico'],
    image:
      'https://res.cloudinary.com/dkbcx9amc/image/upload/v1775025951/Rectangle_5289_1_u6kiqb.png',
  },
  {
    name: 'Latin America',
    slugname: 'latin-america',
    tags: ['latin-america', 'latam', 'south-america', 'central-america'],
    image:
      'https://res.cloudinary.com/dkbcx9amc/image/upload/v1775025951/Rectangle_5289_4_apumt4.png',
  },
  {
    name: 'Caribbean',
    slugname: 'caribbean',
    tags: ['caribbean', 'west-indies', 'caribbean-islands'],
    image:
      'https://res.cloudinary.com/dkbcx9amc/image/upload/v1775025951/Rectangle_5289_7_iajcoj.png',
  },
  {
    name: 'Oceania',
    slugname: 'oceania',
    tags: ['oceania', 'australia', 'new-zealand', 'pacific'],
    image:
      'https://res.cloudinary.com/dkbcx9amc/image/upload/v1775025951/Rectangle_5289_2_ctmxjg.png',
  },
  {
    name: 'Africa',
    slugname: 'africa',
    tags: ['africa', 'african', 'sub-saharan', 'north-africa'],
    image:
      'https://res.cloudinary.com/dkbcx9amc/image/upload/v1775025950/Rectangle_5289_5_ip67p7.png',
  },
];

const getCountryBasedOnRegion = async (region: string) => {
  const cache = await RedisHelper.redisGet(`country-based-on:${region}`);
  if (cache) return cache;

  if (region == 'Middle East') region = 'Western Asia';

  const response = ['North America', 'South America', 'Western Asia'].includes(
    region,
  )
    ? await fetch(
      `${baseUrl}/subregion/${region}?limit=100`,
      {
        headers: {
          Authorization: `Bearer ${config.rest_country.api_key}`,
        },
      },
    )
    : await fetch(`${baseUrl}/region/${region}?limit=100`, {
      headers: {
        Authorization: `Bearer ${config.rest_country.api_key}`,
      },
    });

  const data: CountryResponse = await response.json();


  const formatData = data?.data?.objects
    ?.map((country) => ({
      name: country?.names?.common,
      flag: country?.flag?.url_png,
      cca2: country?.codes?.alpha_2,
      latlng: [country?.coordinates?.lng, country?.coordinates?.lat],
    }))
    ?.sort((a: any, b: any) => a?.name?.localeCompare(b.name));

  await RedisHelper.redisSet(
    `country-based-on:${region}`,
    formatData,
    {},
    60 * 60 * 24,
  );

  return formatData;
};

const getAllCountries = async (): Promise<
  {
    name: string;
    flag: string;
    cca2: string;
    latlng: number[];
  }[]
> => {
  const cache = await RedisHelper.redisGet('all-countries');
  if (cache) return cache;
  const response = await fetch(`https://api.restcountries.com/countries/v5?limit=100`, {
    headers: {
      authorization: `Bearer ${config.rest_country.api_key}`,
    },
  });
  const data: CountryResponse = await response.json();

  const formatData = data?.data?.objects
    ?.map((country) => ({
      name: country?.names?.common,
      flag: country?.flag?.url_png,
      cca2: country?.codes?.alpha_2,
      latlng: [country?.coordinates?.lng, country?.coordinates?.lat],
    }))
    ?.sort((a: any, b: any) => a?.name?.localeCompare(b?.name));
  await RedisHelper.redisSet('all-countries', formatData, {}, 60 * 60 * 24);
  return formatData;
};


const searchCountries = async (searchTerm: string): Promise<
  {
    name: string;
    flag: string;
    cca2: string;
    latlng: number[];
  }[]
> => {
  const cache = await RedisHelper.redisGet('search-countries', { searchTerm });
  if (cache) return cache;
  const response = await fetch(`https://api.restcountries.com/countries/v5?q=${searchTerm}&pretty=1`, {
    headers: {
      authorization: `Bearer ${config.rest_country.api_key}`,
    },
  });
  const data: CountryResponse = await response.json();

  const formatData = data?.data?.objects
    ?.map((country) => ({
      name: country?.names?.common,
      flag: country?.flag?.url_png,
      cca2: country?.codes?.alpha_2,
      latlng: [country?.coordinates?.lng, country?.coordinates?.lat],
    }))
  await RedisHelper.redisSet('search-countries', formatData, { searchTerm }, 60);
  return formatData;
};


const getSingleCountryDetails = async (country: string) => {
  const response = await fetch(`https://api.restcountries.com/countries/v5/names.common?q=${country}&pretty=1`, {
    headers: {
      authorization: `Bearer ${config.rest_country.api_key}`,
    },
  });
  const data: CountryResponse = await response.json();

  const formatData = data?.data?.objects
    ?.map((country) => ({
      name: country?.names?.common,
      flag: country?.flag?.url_png,
      cca2: country?.codes?.alpha_2,
      latlng: [country?.coordinates?.lng, country?.coordinates?.lat],
    }))
  return formatData[0];
};

export const countryHelper = {
  getCountrysRegions,
  getCountryBasedOnRegion,
  getAllCountries,
  searchCountries,
  getSingleCountryDetails
};
