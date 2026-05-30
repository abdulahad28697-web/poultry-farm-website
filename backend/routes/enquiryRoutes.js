import express from 'express';
import Enquiry from '../models/Enquiry.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = express.Router();

// Public route to submit an enquiry (no auth required)
router.post('/', async (req, res, next) => {
  try {
    const { name, contact, topic, message } = req.body;

    if (!name || !contact || !message) {
      return res.status(400).json({ message: 'Name, contact details, and message are required.' });
    }

    const enquiry = await Enquiry.create({
      name: String(name).trim(),
      contact: String(contact).trim(),
      topic: String(topic || 'General enquiry').trim(),
      message: String(message).trim()
    });

    return res.status(201).json({
      message: 'Enquiry submitted successfully.',
      enquiry
    });
  } catch (error) {
    return next(error);
  }
});

// Admin-only route to fetching enquiries
router.get('/', requireAuth, requireRole('admin'), async (req, res, next) => {
  try {
    const enquiries = await Enquiry.find().sort({ createdAt: -1 });
    return res.json({ enquiries });
  } catch (error) {
    return next(error);
  }
});

export default router;
