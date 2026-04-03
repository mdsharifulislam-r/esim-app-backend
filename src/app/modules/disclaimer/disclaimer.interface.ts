import { Model } from "mongoose";

export type IDisclaimer = {
    content:string;
    type:"terms"|"privacy"|"about"|'work'
}

export type DisclaimerModel = Model<IDisclaimer>