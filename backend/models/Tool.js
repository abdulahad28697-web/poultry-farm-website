import mongoose from 'mongoose';

const toolSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    sku: { type: String, trim: true },
    quantity: { type: Number, required: true, default: 0 },
    condition: {
      type: String,
      required: true,
      enum: ['Good', 'Needs Repair', 'Broken'],
      default: 'Good'
    },
    lastServiced: { type: Date },
    cost: { type: Number, default: 0 }
  },
  { timestamps: true }
);

export default mongoose.model('Tool', toolSchema);
