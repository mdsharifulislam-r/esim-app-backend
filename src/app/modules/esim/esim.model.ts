import mongoose from "mongoose";
import { IEsim, IEsimModel } from "./esim.interface";

const esimSchema = new mongoose.Schema<IEsim,IEsimModel>({
    packageId: {
        type: String,
        required: true
    },
    package_name: {
        type: String,
        required: true
    },
    id: {
        type: Number,
        required: true
    },
    code: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: false,
        default: 1
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    validity: {
        type: Number,
        required: true
    },
    data: {
        type: String,
        required: true
    },
    text: {
        type: Number,
        required: false
    },
    voice: {
        type: Number,
        required: false
    },
    price: {
        type: Number,
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: false
    },
    net_price: {
        type: Number,
        required: false
    },
    manual_installation: {
        type: String,
        required: true
    },
    qr_installation: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['active', 'archived', 'expired'],
        required: false,
        default: 'active'
    },
    installation_guides: {
        type: String,
        required: true
    },
    sims: {
        type: [Object],
        required: true
    },
    supported_countries: {
        type: [Object],
        required: false
    },
    oparator_info:{
        type: Object,
    },
    system_commission: {
        type: Number,
        required: false,
        default: 0
    }

}, { timestamps: true });


esimSchema.index({ user: 1});
esimSchema.pre('save', async function (next) {
    this.endDate = new Date(Date.now() + this.validity * 24 * 60 * 60 * 1000) 
    next();
})
export const Esim = mongoose.model<IEsim, IEsimModel>('Esim', esimSchema);