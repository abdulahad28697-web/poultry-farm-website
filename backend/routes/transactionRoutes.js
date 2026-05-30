import express from 'express';
import Transaction from '../models/Transaction.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = express.Router();

router.use(requireAuth);
router.use(requireRole('admin'));

// Fetch all transactions
router.get('/', async (req, res, next) => {
  try {
    const isArchived = req.query.archived === 'true';
    const transactions = await Transaction.find({ isArchived })
      .populate('recordedBy', 'name email')
      .sort({ date: -1 });

    return res.json({ transactions });
  } catch (error) {
    return next(error);
  }
});

// Fetch transaction summary (totals)
router.get('/summary', async (req, res, next) => {
  try {
    const isArchived = req.query.archived === 'true';
    const summary = await Transaction.aggregate([
      { $match: { isArchived } },
      {
        $group: {
          _id: '$type',
          totalAmount: { $sum: '$totalAmount' }
        }
      }
    ]);

    let totalInvestment = 0;
    let totalSales = 0;

    summary.forEach(item => {
      if (item._id === 'Purchase') {
        totalInvestment = item.totalAmount;
      } else if (item._id === 'Sale') {
        totalSales = item.totalAmount;
      }
    });

    return res.json({ totalInvestment, totalSales });
  } catch (error) {
    return next(error);
  }
});

// Add a new transaction
router.post('/', async (req, res, next) => {
  try {
    const { type, category, description, quantity, unitPrice, totalAmount, date } = req.body;

    if (!type || !category || !unitPrice || !totalAmount) {
      return res.status(400).json({ message: 'Type, category, unit price, and total amount are required.' });
    }

    if (!['Purchase', 'Sale'].includes(type)) {
      return res.status(400).json({ message: 'Invalid transaction type.' });
    }

    const transaction = await Transaction.create({
      type,
      category,
      description: String(description || '').trim(),
      quantity: Number(quantity) || 1,
      unitPrice: Number(unitPrice),
      totalAmount: Number(totalAmount),
      date: date ? new Date(date) : new Date(),
      recordedBy: req.user.id
    });

    return res.status(201).json({
      message: 'Transaction added successfully.',
      transaction
    });
  } catch (error) {
    return next(error);
  }
});



// Update transaction
router.put('/:id', async (req, res, next) => {
  try {
    const transaction = await Transaction.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!transaction) return res.status(404).json({ message: 'Transaction not found' });
    return res.json({ transaction });
  } catch (error) {
    return next(error);
  }
});

// Delete transaction
router.delete('/:id', async (req, res, next) => {
  try {
    const transaction = await Transaction.findByIdAndDelete(req.params.id);
    if (!transaction) return res.status(404).json({ message: 'Transaction not found' });
    return res.json({ message: 'Transaction deleted successfully' });
  } catch (error) {
    return next(error);
  }
});

// Archive all current transactions (End of Flock)
router.post('/archive-all', async (req, res, next) => {
  try {
    await Transaction.updateMany({ isArchived: false }, { isArchived: true });
    return res.json({ message: 'All current transactions archived.' });
  } catch (error) {
    return next(error);
  }
});

export default router;
