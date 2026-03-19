import mongoose, { Schema, Document } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export interface IOrder extends Document {
  id: string;
  customerId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  orderId: string;
  orderDate: string;
  product: string;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  status: 'Pending' | 'In progress' | 'Completed';
  createdBy: string;
}

const OrderSchema = new Schema<IOrder>(
  {
    id: { type: String, default: () => uuidv4(), unique: true },
    customerId: { type: String, default: () => `CUST-${uuidv4().slice(0, 8).toUpperCase()}` },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true },
    orderId: { type: String, default: () => `ORD-${uuidv4().slice(0, 8).toUpperCase()}` },
    orderDate: { type: String, default: () => new Date().toISOString() },
    product: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    unitPrice: { type: Number, required: true, min: 0 },
    totalAmount: { type: Number, required: true },
    status: { type: String, enum: ['Pending', 'In progress', 'Completed'], default: 'Pending' },
    createdBy: { type: String, required: true },
  },
  { timestamps: false }
);

export default mongoose.model<IOrder>('Order', OrderSchema);
