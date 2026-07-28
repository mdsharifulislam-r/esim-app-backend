import { Country } from '../../../types/packagesType';
import { Pricingrules } from '../pricingrules/pricingrules.model';

export interface PackageCard {
  packageId: string;
  operatorName: string;
  type: string;
  slug: string;
  countryName: string;
  operatorImage: string;
  dataAmount: string;
  duration: string;
  priceUSD: number;
  originalPriceUSD?: number;
  discountPercentage?: number;
  planType: string;
  info: string[];
  qr_installation: string;
  manual_installation: string;
  short_info: string | null;
  supported_countries: {
    country_code: string;
    title: string;
    image: { width: number; height: number; url: string };
  }[];
  fair_usage_policy: string | null;
}

async function formatCountryPackagesToCard(countrys: Country[], discountPercentage: number = 0): Promise<PackageCard[]> {
  const cards: PackageCard[] = [];
  const pricingRules = await Pricingrules.findOne()
  const mapCards = countrys
    ?.map((country: Country) => {
      country.operators.forEach(operator => {
        operator.packages.forEach(pkg => {
          const priceWithMargin = pricingRules?.margin_price ? pkg.prices.recommended_retail_price.USD + (pkg.prices.recommended_retail_price.USD * pricingRules.margin_price / 100) : pkg.prices.recommended_retail_price.USD
          const discount = discountPercentage
          const discountPrice = !discount ? priceWithMargin : priceWithMargin - (priceWithMargin * discount / 100)
          cards.push({
            packageId: pkg.id,
            operatorName: operator.title,
            type: pkg.type,
            slug: country.slug,
            countryName: country.title,
            operatorImage: operator.image.url,
            dataAmount: pkg.data,
            duration: `${pkg.day} Day${pkg.day > 1 ? 's' : ''}`,
            priceUSD: discountPrice,
            originalPriceUSD: !discount ? priceWithMargin : priceWithMargin,
            discountPercentage: discount > 0 ? discount : 0,
            qr_installation: pkg.qr_installation,
            planType: operator.plan_type,
            info: operator.info,
            manual_installation: pkg.manual_installation,
            short_info: pkg.short_info,
            supported_countries: operator.countries,
            fair_usage_policy: pkg.fair_usage_policy,
          });
        });
      });

      return cards
    })
    .flat();

  return [...new Set(mapCards)];
}


const sortPackages = (packages: PackageCard[], sort_order?: "price_low_to_high" | "price_high_to_low" | "validity_less_to_more" | "validity_more_to_less") => {
  if (sort_order == "price_low_to_high") {
    return packages.sort((a, b) => a.priceUSD - b.priceUSD)
  }
  if (sort_order == "price_high_to_low") {
    return packages.sort((a, b) => b.priceUSD - a.priceUSD)
  }

  if (sort_order == "validity_less_to_more") {
    return packages.sort((a, b) => {
      const aDay = Number(a.duration.split(" ")[0])
      const bDay = Number(b.duration.split(" ")[0])
      return aDay - bDay
    })
  }

  if (sort_order == "validity_more_to_less") {
    return packages.sort((a, b) => {
      const aDay = Number(a.duration.split(" ")[0])
      const bDay = Number(b.duration.split(" ")[0])
      return bDay - aDay
    })
  }
  return packages
}









export const EsimHelper = { formatCountryPackagesToCard, sortPackages };
