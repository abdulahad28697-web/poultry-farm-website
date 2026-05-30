import express from 'express';
import FlockRecord from '../models/FlockRecord.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = express.Router();

router.use(requireAuth);
router.use(requireRole('admin'));

// Fetch all flock records (sorted by date, newest first)
router.get('/', async (req, res, next) => {
  try {
    const records = await FlockRecord.find()
      .populate('recordedBy', 'name email')
      .sort({ recordDate: -1 });

    return res.json({ records });
  } catch (error) {
    return next(error);
  }
});

// Add a new daily flock record
router.post('/', async (req, res, next) => {
  try {
    const { recordDate, mortalityCount, totalChicks, note } = req.body;

    if (mortalityCount === undefined || totalChicks === undefined) {
      return res.status(400).json({ message: 'Mortality count and total chicks are required.' });
    }

    const record = await FlockRecord.create({
      recordDate: recordDate ? new Date(recordDate) : new Date(),
      mortalityCount: Number(mortalityCount),
      totalChicks: Number(totalChicks),
      note: String(note || '').trim(),
      recordedBy: req.user.id
    });

    return res.status(201).json({
      message: 'Flock record added successfully.',
      record
    });
  } catch (error) {
    return next(error);
  }
});

export default router;
