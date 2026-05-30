import mongoose from 'mongoose';

const vaccinationSchema = new mongoose.Schema(
  {
    vaccineName: { type: String, required: true, trim: true },
    targetDisease: { type: String, required: true, trim: true },
    flockGroup: { type: String, required: true, trim: true }, // e.g. Batch 2026-A, Layer Flock 3
    scheduledDate: { type: Date, required: true },
    status: {
      type: String,
      required: true,
      enum: ['Scheduled', 'Administered'],
      default: 'Scheduled'
    },
    cost: { type: Number, default: 0 },
    administeredBy: { type: String, trim: true } // Name of vet or worker
  },
  { timestamps: true }
);

export default mongoose.model('Vaccination', vaccinationSchema);
