import mongoose from 'mongoose';

const enquirySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    contact: {
      type: String,
      required: true,
      trim: true
    },
    topic: {
      type: String,
      required: true,
      trim: true
    },
    message: {
      type: String,
      required: true,
      trim: true
    },
    status: {
      type: String,
      enum: ['unread', 'read', 'responded'],
      default: 'unread'
    }
  },
  {
    timestamps: true
  }
);

const Enquiry = mongoose.model('Enquiry', enquirySchema);

export default Enquiry;
