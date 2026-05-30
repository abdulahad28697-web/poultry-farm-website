import mongoose from 'mongoose';

const treatmentSchema = new mongoose.Schema(
  {
    diagnosis: { type: String, required: true, trim: true }, // e.g. Coccidiosis, Newcastle Disease
    flockGroup: { type: String, required: true, trim: true }, // e.g. Shed 2, Batch B
    treatment: { type: String, required: true, trim: true }, // e.g. Antibiotics in water, Isolation
    medicationUsed: { type: String, trim: true }, // e.g. Amprolium, Tylosin
    startDate: { type: Date, required: true },
    endDate: { type: Date },
    cost: { type: Number, default: 0 },
    outcome: {
      type: String,
      required: true,
      enum: ['Ongoing', 'Recovered', 'Loss'],
      default: 'Ongoing'
    }
  },
  { timestamps: true }
);

export default mongoose.model('Treatment', treatmentSchema);
