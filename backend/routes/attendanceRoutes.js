import express from 'express';
import Attendance from '../models/Attendance.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = express.Router();

router.use(requireAuth);
router.use(requireRole('admin'));

// Fetch all attendance records (optional query param: date)
router.get('/', async (req, res, next) => {
  try {
    const { date } = req.query;
    let filter = {};

    if (date) {
      // Find records specifically for that day (midnight to midnight)
      const startOfDay = new Date(date);
      startOfDay.setUTCHours(0, 0, 0, 0);

      const endOfDay = new Date(date);
      endOfDay.setUTCHours(23, 59, 59, 999);

      filter.date = {
        $gte: startOfDay,
        $lte: endOfDay
      };
    }

    const records = await Attendance.find(filter)
      .populate('recordedBy', 'name email')
      .sort({ date: -1, employeeName: 1 });

    return res.json({ records });
  } catch (error) {
    return next(error);
  }
});

// Add or update an attendance record
router.post('/', async (req, res, next) => {
  try {
    const { employeeName, date, status, notes } = req.body;

    if (!employeeName || !date || !status) {
      return res.status(400).json({ message: 'Employee name, date, and status are required.' });
    }

    if (!['Present', 'Absent', 'Half-Day', 'Leave'].includes(status)) {
      return res.status(400).json({ message: 'Invalid attendance status.' });
    }

    // Determine target date at midnight UTC for consistency
    const targetDate = new Date(date);
    targetDate.setUTCHours(0, 0, 0, 0);

    // Update or create
    const record = await Attendance.findOneAndUpdate(
      { employeeName: String(employeeName).trim(), date: targetDate },
      {
        status,
        notes: String(notes || '').trim(),
        recordedBy: req.user.id
      },
      { new: true, upsert: true }
    );

    return res.status(200).json({
      message: 'Attendance recorded successfully.',
      record
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Attendance already recorded for this employee on this date.' });
    }
    return next(error);
  }
});

export default router;
