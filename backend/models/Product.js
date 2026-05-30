import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    price: { type: Number },
    priceNote: { type: String, trim: true },
    unit: { type: String, required: true, trim: true },
    image: { type: String, required: true, trim: true }
  },
  { timestamps: true }
);

export default mongoose.model('Product', productSchema);
