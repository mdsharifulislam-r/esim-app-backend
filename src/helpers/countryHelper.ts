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
    tags: ['middle-east', 'me', 'gcc', 'arab', 'gulf'],
    image:
      'https://res.cloudinary.com/dkbcx9amc/image/upload/v1775025950/Rectangle_5289_6_uh9ror.png',
  },
  {
    name: 'North America',
    slugname: 'north-america',
    tags: ['north-america', 'na', 'usa', 'canada', 'mexico'],
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
        `${baseUrl}/subregion/${region}?fields=name,flags,cca2,latlng,capital`,
        {
          headers: {
            Authorization: `Bearer ${config.rest_country.api_key}`,
          },
        },
      )
    : await fetch(`${baseUrl}/region/${region}?fields=name,flags,cca2,latlng`, {
        headers: {
          Authorization: `Bearer ${config.rest_country.api_key}`,
        },
      });

  const data = await response.json();
  console.log(data);
  const formatData = data
    ?.map((country: any) => ({
      name: country.name.common,
      flag: country.flags.png,
      cca2: country.cca2,
      latlng: country.latlng,
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
  const response = await fetch(`${baseUrl}/all?fields=name,flags,cca2,latlng`, {
    headers: {
      Authorization: `Bearer ${config.rest_country.api_key}`,
    },
  });
  const data = await response.json();
  console.log(data);
  const formatData = data
    ?.map((country: any) => ({
      name: country.name.common,
      flag: country.flags.png,
      cca2: country.cca2,
      latlng: country.latlng,
    }))
    ?.sort((a: any, b: any) => a?.name?.localeCompare(b?.name));
  await RedisHelper.redisSet('all-countries', formatData, {}, 60 * 60 * 24);
  return formatData;
};

export const countryHelper = {
  getCountrysRegions,
  getCountryBasedOnRegion,
  getAllCountries,
};
