import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema(
  {
    employeeName: {
      type: String,
      required: true,
      trim: true
    },
    date: {
      type: Date,
      required: true
    },
    status: {
      type: String,
      enum: ['Present', 'Absent', 'Half-Day', 'Leave'],
      required: true
    },
    notes: {
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

// Ensure one record per employee per day
attendanceSchema.index({ employeeName: 1, date: 1 }, { unique: true });

const Attendance = mongoose.model('Attendance', attendanceSchema);
export default Attendance;
