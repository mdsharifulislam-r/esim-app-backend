import { model, Schema } from "mongoose";
import { EmptyCountyModel, IEmptyCountry } from "./country.interface";

const emptycountrySchema = new Schema<IEmptyCountry,EmptyCountyModel>({
    name: {
        type: String,
        required: false
    },
    code: {
        type: String,
        required: true
    }
});


export const EmptyCountry = model<IEmptyCountry, EmptyCountyModel>('EmptyCountry', emptycountrySchema);