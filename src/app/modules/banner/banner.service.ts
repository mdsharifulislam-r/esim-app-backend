import { JwtPayload } from 'jsonwebtoken';
import { RedisHelper } from '../../../tools/redis/redis.helper';
import { IBanner } from './banner.interface';
import { Banner } from './banner.model';
import { USER_ROLES } from '../../../enums/user';

const createBanner = async (text:string) => {
    const banner = await Banner.create({ text });
    await RedisHelper.redisSet(`banner:${banner._id}`, banner, {}, 60 * 60 * 24);
    await RedisHelper.keyDelete(`banners:*`);
    return banner
};

const getAllBanners = async (user:JwtPayload) =>{
    const cache = await RedisHelper.redisGet(`banners`, {role:user?.role});
    if (cache) {
        return cache;
    }
    if([USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN].includes(user?.role)){
        const banners = await Banner.find({});
        await RedisHelper.redisSet(`banners`, banners, {role:user?.role}, 60 * 60 * 24);
        return banners
    }else{
        const banners = await Banner.find({status:"active"}).distinct('text');
        await RedisHelper.redisSet(`banners`, banners, {role:user?.role}, 60 * 60 * 24);
        return banners
    }
};

const updateBanner = async (id:string, payload:Partial<IBanner>) => {
    const banner = await Banner.findByIdAndUpdate(id, payload, { new: true });
    await RedisHelper.redisSet(`banner:${id}`, banner, {}, 60 * 60 * 24);
    await RedisHelper.keyDelete(`banners:*`);
    return banner;
};

const deleteBanner = async (id:string) => {
    const banner = await Banner.findByIdAndDelete(id);
    await RedisHelper.keyDelete(`banner:${id}`);
    await RedisHelper.keyDelete(`banners:*`);
    return banner;
};

export const BannerServices = { createBanner, getAllBanners, updateBanner, deleteBanner };
