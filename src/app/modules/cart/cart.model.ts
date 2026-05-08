import { Schema, model } from 'mongoose';
import { ICart, CartModel } from './cart.interface';

const cartSchema = new Schema<ICart, CartModel>({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  esim: {
    type: Schema.Types.Mixed,
    required: true
  },
  quantity: {
    type: Number,
    required: false,
    default: 1
  }
}, {
  timestamps: true
});

cartSchema.index({ user: 1 });

export const Cart = model<ICart, CartModel>('Cart', cartSchema);
