import express from 'express';
import Product from '../models/Product.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = express.Router();

// GET all products (Public route)
router.get('/', async (req, res, next) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    return res.json({ products });
  } catch (error) {
    return next(error);
  }
});

// Create product (Admin only)
router.post('/', requireAuth, requireRole('admin'), async (req, res, next) => {
  try {
    const product = await Product.create(req.body);
    return res.status(201).json({ product });
  } catch (error) {
    return next(error);
  }
});

// Update product (Admin only)
router.put('/:id', requireAuth, requireRole('admin'), async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    return res.json({ product });
  } catch (error) {
    return next(error);
  }
});

// Delete product (Admin only)
router.delete('/:id', requireAuth, requireRole('admin'), async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    return res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    return next(error);
  }
});

export default router;
