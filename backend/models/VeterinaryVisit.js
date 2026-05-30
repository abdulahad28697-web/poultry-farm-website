import mongoose from 'mongoose';

const veterinaryVisitSchema = new mongoose.Schema(
  {
    vetName: { type: String, required: true, trim: true },
    contactNumber: { type: String, trim: true },
    visitDate: { type: Date, required: true },
    purpose: { type: String, required: true, trim: true }, // e.g. Routine Checkup, Emergency flock illness
    cost: { type: Number, default: 0 },
    notes: { type: String, trim: true }
  },
  { timestamps: true }
);

export default mongoose.model('VeterinaryVisit', veterinaryVisitSchema);
