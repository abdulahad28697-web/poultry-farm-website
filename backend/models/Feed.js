import mongoose from 'mongoose';

const feedSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    type: { type: String, required: true, trim: true }, // e.g. Poultry Feed, Chick Starter, Finisher
    quantity: { type: Number, required: true, default: 0 },
    unit: { type: String, required: true, default: 'bags', trim: true }, // e.g. bags, kg, lbs
    cost: { type: Number, default: 0 },
    expirationDate: { type: Date }
  },
  { timestamps: true }
);

export default mongoose.model('Feed', feedSchema);
