import mongoose from 'mongoose';

const flockRecordSchema = new mongoose.Schema(
  {
    recordDate: {
      type: Date,
      required: true,
      default: Date.now
    },
    mortalityCount: {
      type: Number,
      required: true,
      min: 0,
      default: 0
    },
    totalChicks: {
      type: Number,
      required: true,
      min: 0
    },
    note: {
      type: String,
      trim: true,
      default: ''
    },
    recordedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  {
    timestamps: true
  }
);

const FlockRecord = mongoose.model('FlockRecord', flockRecordSchema);

export default FlockRecord;
