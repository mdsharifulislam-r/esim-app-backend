import { RedisHelper } from '../../../tools/redis/redis.helper';
import { IPricingrules, PricingrulesModel } from './pricingrules.interface';
import { Pricingrules } from './pricingrules.model';

const createPricingrules = async (payload: IPricingrules) => {
    const existPricingRules = await Pricingrules.findOne();
    if (existPricingRules) {
        await Pricingrules.findOneAndUpdate({ _id: existPricingRules._id }, { margin_price: payload.margin_price, tax_percent: payload.tax_percent })
    } else {
        await Pricingrules.create(payload)
    }

    await RedisHelper.keyDelete('airalo-packages:*')

}

const getPricingRules = async () => {
    const result = await Pricingrules.findOne().select({ margin_price: 1, tax_percent: 1 })
    return result

}




export const PricingrulesServices = { createPricingrules, getPricingRules };
