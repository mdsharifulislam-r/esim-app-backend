import ApiError from '../../../errors/ApiError';
import { countryHelper } from '../../../helpers/countryHelper';
import { RedisHelper } from '../../../tools/redis/redis.helper';
import QueryBuilder from '../../builder/QueryBuilder';
import { IPricingrules, PricingrulesModel } from './pricingrules.interface';
import { Pricingrules } from './pricingrules.model';

const createPricingrules = async (payload: IPricingrules) => {
    const existPricingRules = await Pricingrules.findOne({ name: payload.name });
    if (existPricingRules) {
        throw new ApiError(400, "Pricing rules already exist for this country")
    }

    const isGlobal = await Pricingrules.findOne({ type: "global" });
    if (isGlobal && payload.type === "global") {
        throw new ApiError(400, "Global pricing rules already exist")
    }

    if (payload.type == "region") {

    }

    if (payload.type == "country") {
        const countryInformation = await countryHelper.getSingleCountryDetails(payload.name)
        if (!countryInformation?.cca2) {
            throw new ApiError(400, "Invalid country name")
        }
        payload.cca2 = countryInformation?.cca2
    }

    await Pricingrules.create(payload)


    await RedisHelper.keyDelete('airalo-packages:*')

}

const updatePricingrules = async (id: string, payload: IPricingrules) => {
    const existPricingRules = await Pricingrules.findOne({ _id: id });
    if (!existPricingRules) {
        throw new ApiError(400, "Pricing rules not found")
    }
    await Pricingrules.findOneAndUpdate({ _id: existPricingRules._id }, payload)
    await RedisHelper.keyDelete('airalo-packages:*')

}

const deletePricingRules = async (id: string) => {
    const result = await Pricingrules.deleteOne({ _id: id })
    if (!result.deletedCount) {
        throw new ApiError(400, "Pricing rules not found")
    }
    await RedisHelper.keyDelete('airalo-packages:*')
}

const getPricingRules = async (query: Record<string, any>) => {
    const pricingrulesQuery = new QueryBuilder(Pricingrules.find(), query).paginate().search(['name']).filter()
    const [data, pagination] = await Promise.all([pricingrulesQuery.modelQuery.lean(), pricingrulesQuery.getPaginationInfo()]);
    return { pagination, data }
}




export const PricingrulesServices = { createPricingrules, getPricingRules, updatePricingrules, deletePricingRules };
