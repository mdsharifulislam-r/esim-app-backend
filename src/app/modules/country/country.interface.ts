import { Model } from "mongoose";

export type IEmptyCountry = {
    name: string;
    code: string;
}

export type EmptyCountyModel = Model<IEmptyCountry>;