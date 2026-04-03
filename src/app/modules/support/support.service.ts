import config from '../../../config';
import ApiError from '../../../errors/ApiError';
import { emailHelper } from '../../../helpers/emailHelper';
import { RedisHelper } from '../../../tools/redis/redis.helper';
import QueryBuilder from '../../builder/QueryBuilder';
import { ISupport, SupportModel } from './support.interface';
import { Support } from './support.model';

const createSupportMessage = async (data: ISupport) => {
  const support = await Support.create(data);
  emailHelper.sendEmail({
    to: config.super_admin.email!,
    subject: data.subject,
    html: data.message,
  });
  await RedisHelper.keyDelete(`support:*`);
  return support;
};


const getSupportMessages = async (query:Record<string,any>) => {
  const cache = await RedisHelper.redisGet(`support`, query);
  if (cache) return cache;
  const supportQuery = new QueryBuilder(Support.find({}),query).paginate().sort().filter()
  const [support,pagination] = await Promise.all([supportQuery.modelQuery.exec(),supportQuery.getPaginationInfo()]);
  await RedisHelper.redisSet(`support`, {data:support,pagination}, query, 60);
  return {data:support,pagination}
}


const replySupportMessage = async (id:string,message:string) => {
    const support = await Support.findById(id);
    if(!support){
        throw new ApiError(404,"Support not found")
    }
    support.reply = message
    support.status = "resolved"
    const result = await support.save()
    emailHelper.sendEmail({
        to: support.email,
        subject: `Re: ${support.subject}`,
        html: message
    })
    await RedisHelper.keyDelete(`support:*`);
    return result
}

const deleteSupportMessage = async (id:string) => {
    const support = await Support.findByIdAndDelete(id);
    await RedisHelper.keyDelete(`support:*`);
    return support
}
export const SupportServices = {
  createSupportMessage,
  getSupportMessages,
  replySupportMessage,
  deleteSupportMessage
};
