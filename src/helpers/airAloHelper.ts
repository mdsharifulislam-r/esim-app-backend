import { StatusCodes } from 'http-status-codes';
import config from '../config';
import ApiError from '../errors/ApiError';
import { RedisHelper } from '../tools/redis/redis.helper';
import axios from 'axios';
import { IGetPackagesRequest, IMakeOrderRequest } from '../app/modules/esim/esim.interface';
import { AiraloPackagesResponse } from '../types/packagesType';
import { InstructionsResponse } from '../types/esim/e-sim-installation';
import { EsimUsageResponse } from '../types/esim/esim-monitor.type';

class AirAloHelper {
  private async generateToken() {
    try {
      const cache = await RedisHelper.redisGet('airalo-token');
      if (cache) return cache;
      const formatData = new FormData();
      formatData.append('grant_type', 'client_credentials');
      formatData.append('client_id', config.airalo.clientId as string);
      formatData.append('client_secret', config.airalo.clientSecret as string);
      const response = await fetch(`${config.airalo.url}/v2/token`, {
        method: 'POST',
        body: formatData,
      });
      const data = await response.json();
      await RedisHelper.redisSet(
        'airalo-token',
        data.data.access_token,
        {},
        60 * 60 * 24,
      );
      return data.access_token;
    } catch (error) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to generate token');
    }
  }

  private async requestHandler(
    url: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    body?: any,
    params?: any,
  ) {
    const token = await this.generateToken();
    if(params){
        for(const key in params){
            if(!params[key]) delete params[key];
        }
    }
    
    return axios({
      method,
      url:`${config.airalo.url}${url}`,
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
      data: body,
      params,
    });
  }

  async getPackages(payload:IGetPackagesRequest):Promise<AiraloPackagesResponse> {
    const cache = await RedisHelper.redisGet(`airalo-packages`, payload);
    if (cache) return cache;
    const url = `/v2/packages`;
    const response = await this.requestHandler(url, 'GET', null, {
        'filter[type]': payload.type,
        'filter[country]': payload.country,
        // 'filter[country]': payload.country,
        page: payload.page,
        limit: payload.limit
    });
    await RedisHelper.redisSet(`airalo-packages`, response.data, payload, 60 * 60);
    return response.data;
  }
  async makeOrderAsync(payload: IMakeOrderRequest) {
    const url = `/v2/orders-async`;
    const formdata = new FormData();
    for(const key in payload){
        if (payload.hasOwnProperty(key)) {
            formdata.append(key, payload[key as keyof IMakeOrderRequest] as string);
        }
    }
   
    
    formdata.append('webhook_url',config.urls.airalo_webhook as string);
    const response = await this.requestHandler(url, 'POST', formdata);
    if(response.data.meta.message!="success") throw new ApiError(StatusCodes.BAD_REQUEST, response.data.meta.message);
    return response.data;
  }

  async getEsimInstallationGuidelines(ccid: string): Promise<InstructionsResponse['data']['instructions']> {
    const response:{data:InstructionsResponse} = await this.requestHandler(
        `/v2/sims/${ccid}/instructions`,
        'GET',
    )

    if(response.data.meta.message!="success") throw new ApiError(StatusCodes.BAD_REQUEST, response.data.meta.message);
    return response.data.data.instructions

  }

  async getEsimUsage(ccid: string):Promise<EsimUsageResponse['data']> {
    const response:{data:EsimUsageResponse} = await this.requestHandler(
        `/v2/sims/${ccid}/usage`,
        'GET',
    )

    if(response.data.meta.message!="success") throw new ApiError(StatusCodes.BAD_REQUEST, response.data.meta.message);
    return response.data.data
  }
}


export const airaloHelper = new AirAloHelper();

