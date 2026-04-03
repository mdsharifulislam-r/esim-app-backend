import { Country } from '../../../types/packagesType';

interface PackageCard {
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

function formatCountryPackagesToCard(countrys: Country[]): PackageCard[] {
  const cards: PackageCard[] = [];

  const mapCards = countrys
    ?.map((country: Country) => {
      country.operators.forEach(operator => {
        operator.packages.forEach(pkg => {
          const discount =
            pkg.prices.recommended_retail_price.USD > pkg.prices.net_price.USD
              ? Math.round(
                  ((pkg.prices.recommended_retail_price.USD -
                    pkg.prices.net_price.USD) /
                    pkg.prices.recommended_retail_price.USD) *
                    100,
                )
              : 0;

          cards.push({
            packageId: pkg.id,
            operatorName: operator.title,
            type: pkg.type,
            slug: country.slug,
            countryName: country.title,
            operatorImage: operator.image.url,
            dataAmount: pkg.data,
            duration: `${pkg.day} Day${pkg.day > 1 ? 's' : ''}`,
            priceUSD: pkg.prices.net_price.USD,
            originalPriceUSD: pkg.prices.recommended_retail_price.USD,
            discountPercentage: discount > 0 ? discount : undefined,
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

      return cards;
    })
    .flat();

  return mapCards;
}









export const EsimHelper = { formatCountryPackagesToCard };
