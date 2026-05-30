import express from 'express';
import Tool from '../models/Tool.js';
import Feed from '../models/Feed.js';
import FarmAccessory from '../models/FarmAccessory.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = express.Router();

// Apply admin protection to all routes
router.use(requireAuth);
router.use(requireRole('admin'));

// ==========================================
// 1. TOOLS MANAGEMENT CRUD
// ==========================================

// GET all tools
router.get('/tools', async (req, res, next) => {
  try {
    const tools = await Tool.find().sort({ name: 1 });
    return res.json({ tools });
  } catch (error) {
    return next(error);
  }
});

// CREATE a tool
router.post('/tools', async (req, res, next) => {
  try {
    const tool = await Tool.create(req.body);
    return res.status(201).json({ tool });
  } catch (error) {
    return next(error);
  }
});

// UPDATE a tool
router.put('/tools/:id', async (req, res, next) => {
  try {
    const tool = await Tool.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!tool) return res.status(404).json({ message: 'Tool not found' });
    return res.json({ tool });
  } catch (error) {
    return next(error);
  }
});

// DELETE a tool
router.delete('/tools/:id', async (req, res, next) => {
  try {
    const tool = await Tool.findByIdAndDelete(req.params.id);
    if (!tool) return res.status(404).json({ message: 'Tool not found' });
    return res.json({ message: 'Tool deleted successfully' });
  } catch (error) {
    return next(error);
  }
});

// ==========================================
// 2. FEED MANAGEMENT CRUD
// ==========================================

// GET all feed records
router.get('/feed', async (req, res, next) => {
  try {
    const feeds = await Feed.find().sort({ name: 1 });
    return res.json({ feeds });
  } catch (error) {
    return next(error);
  }
});

// CREATE a feed record
router.post('/feed', async (req, res, next) => {
  try {
    const feed = await Feed.create(req.body);
    return res.status(201).json({ feed });
  } catch (error) {
    return next(error);
  }
});

// UPDATE a feed record
router.put('/feed/:id', async (req, res, next) => {
  try {
    const feed = await Feed.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!feed) return res.status(404).json({ message: 'Feed not found' });
    return res.json({ feed });
  } catch (error) {
    return next(error);
  }
});

// DELETE a feed record
router.delete('/feed/:id', async (req, res, next) => {
  try {
    const feed = await Feed.findByIdAndDelete(req.params.id);
    if (!feed) return res.status(404).json({ message: 'Feed not found' });
    return res.json({ message: 'Feed deleted successfully' });
  } catch (error) {
    return next(error);
  }
});

// ==========================================
// 3. FARM ACCESSORIES CRUD
// ==========================================

// GET all accessories
router.get('/accessories', async (req, res, next) => {
  try {
    const accessories = await FarmAccessory.find().sort({ name: 1 });
    return res.json({ accessories });
  } catch (error) {
    return next(error);
  }
});

// CREATE an accessory
router.post('/accessories', async (req, res, next) => {
  try {
    const accessory = await FarmAccessory.create(req.body);
    return res.status(201).json({ accessory });
  } catch (error) {
    return next(error);
  }
});

// UPDATE an accessory
router.put('/accessories/:id', async (req, res, next) => {
  try {
    const accessory = await FarmAccessory.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!accessory) return res.status(404).json({ message: 'Accessory not found' });
    return res.json({ accessory });
  } catch (error) {
    return next(error);
  }
});

// DELETE an accessory
router.delete('/accessories/:id', async (req, res, next) => {
  try {
    const accessory = await FarmAccessory.findByIdAndDelete(req.params.id);
    if (!accessory) return res.status(404).json({ message: 'Accessory not found' });
    return res.json({ message: 'Accessory deleted successfully' });
  } catch (error) {
    return next(error);
  }
});

export default router;
