import mongoose from 'mongoose';

const farmAccessorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true }, // e.g. Fencing, Heating, Waterer, Feeder
    quantity: { type: Number, required: true, default: 0 },
    unit: { type: String, required: true, default: 'pcs', trim: true },
    location: { type: String, trim: true }, // e.g. Shed A, Warehouse, Barn 2
    cost: { type: Number, default: 0 }
  },
  { timestamps: true }
);

export default mongoose.model('FarmAccessory', farmAccessorySchema);
