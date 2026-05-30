import express from 'express';
import mongoose from 'mongoose';
import Order, { ORDER_STATUSES } from '../models/Order.js';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { generateOrderNumber } from '../utils/orderNumber.js';

const router = express.Router();

router.use(requireAuth);

function normalizeItems(items) {
  if (!Array.isArray(items) || items.length === 0) {
    return null;
  }

  const normalized = items
    .map((item) => ({
      productId: String(item.productId || '').trim(),
      name: String(item.name || '').trim(),
      quantity: Number(item.quantity || 0),
      unitPrice: Number(item.unitPrice || 0),
      priceNote: String(item.priceNote || '').trim()
    }))
    .filter((item) => item.productId && item.name && item.quantity > 0);

  if (normalized.length === 0) {
    return null;
  }

  return normalized;
}

function calculateSubtotal(items) {
  return items.reduce((sum, item) => {
    if (!item.unitPrice || Number.isNaN(item.unitPrice)) {
      return sum;
    }

    return sum + item.unitPrice * item.quantity;
  }, 0);
}

async function generateUniqueOrderNumber() {
  for (let attempts = 0; attempts < 6; attempts += 1) {
    const candidate = generateOrderNumber();
    const exists = await Order.exists({ orderNumber: candidate });
    if (!exists) {
      return candidate;
    }
  }

  throw new Error('Could not generate unique order number, please retry.');
}

router.post('/', requireRole('user'), async (req, res, next) => {
  try {
    const { items, phone, address, notes } = req.body;
    const normalizedItems = normalizeItems(items);

    if (!normalizedItems) {
      return res.status(400).json({ message: 'At least one valid order item is required.' });
    }

    if (!phone || !address) {
      return res.status(400).json({ message: 'Phone and address are required.' });
    }

    const orderNumber = await generateUniqueOrderNumber();
    const subtotal = calculateSubtotal(normalizedItems);

    const order = await Order.create({
      orderNumber,
      user: req.user.id,
      items: normalizedItems,
      subtotal,
      phone: String(phone).trim(),
      address: String(address).trim(),
      notes: String(notes || '').trim(),
      status: 'pending',
      statusHistory: [
        {
          status: 'pending',
          note: 'Order placed by customer',
          changedBy: req.user.id
        }
      ]
    });

    return res.status(201).json({
      message: 'Order created successfully.',
      order
    });
  } catch (error) {
    return next(error);
  }
});

router.get('/my', requireRole('user'), async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
    return res.json({ orders });
  } catch (error) {
    return next(error);
  }
});

router.get('/track/:orderNumber', requireRole('user', 'admin'), async (req, res, next) => {
  try {
    const { orderNumber } = req.params;
    const query = { orderNumber };

    if (req.user.role === 'user') {
      query.user = req.user.id;
    }

    const order = await Order.findOne(query).populate('user', 'name email');
    if (!order) {
      return res.status(404).json({ message: 'Order not found.' });
    }

    return res.json({ order });
  } catch (error) {
    return next(error);
  }
});

router.get('/', requireRole('admin'), async (req, res, next) => {
  try {
    const { status } = req.query;
    const query = {};

    if (status && ORDER_STATUSES.includes(status)) {
      query.status = status;
    }

    const orders = await Order.find(query)
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    return res.json({ orders });
  } catch (error) {
    return next(error);
  }
});

router.patch('/:orderId/status', requireRole('admin'), async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const { status, note } = req.body;

    if (!ORDER_STATUSES.includes(status)) {
      return res.status(400).json({ message: 'Invalid status value.' });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found.' });
    }

    order.status = status;
    order.statusHistory.push({
      status,
      note: String(note || '').trim() || 'Status updated by admin',
      changedBy: req.user.id
    });

    await order.save();

    return res.json({
      message: 'Order status updated successfully.',
      order
    });
  } catch (error) {
    return next(error);
  }
});

router.get('/:orderId', requireRole('user', 'admin'), async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const query = {};

    if (orderId.startsWith('HF-ORD-')) {
      query.orderNumber = orderId;
    } else if (mongoose.isValidObjectId(orderId)) {
      query._id = orderId;
    } else {
      return res.status(400).json({ message: 'Invalid order identifier.' });
    }

    if (req.user.role === 'user') {
      query.user = req.user.id;
    }

    const order = await Order.findOne(query).populate('user', 'name email');
    if (!order) {
      return res.status(404).json({ message: 'Order not found.' });
    }

    return res.json({ order });
  } catch (error) {
    return next(error);
  }
});

export default router;
