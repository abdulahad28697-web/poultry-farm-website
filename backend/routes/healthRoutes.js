import express from 'express';
import Vaccination from '../models/Vaccination.js';
import Treatment from '../models/Treatment.js';
import VeterinaryVisit from '../models/VeterinaryVisit.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = express.Router();

// Apply admin protection to all routes
router.use(requireAuth);
router.use(requireRole('admin'));

// ==========================================
// 1. VACCINATION SCHEDULE CRUD
// ==========================================

// GET all vaccinations
router.get('/vaccinations', async (req, res, next) => {
  try {
    const vaccinations = await Vaccination.find().sort({ scheduledDate: 1 });
    return res.json({ vaccinations });
  } catch (error) {
    return next(error);
  }
});

// CREATE a vaccination
router.post('/vaccinations', async (req, res, next) => {
  try {
    const vaccination = await Vaccination.create(req.body);
    return res.status(201).json({ vaccination });
  } catch (error) {
    return next(error);
  }
});

// UPDATE a vaccination
router.put('/vaccinations/:id', async (req, res, next) => {
  try {
    const vaccination = await Vaccination.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!vaccination) return res.status(404).json({ message: 'Vaccination not found' });
    return res.json({ vaccination });
  } catch (error) {
    return next(error);
  }
});

// DELETE a vaccination
router.delete('/vaccinations/:id', async (req, res, next) => {
  try {
    const vaccination = await Vaccination.findByIdAndDelete(req.params.id);
    if (!vaccination) return res.status(404).json({ message: 'Vaccination not found' });
    return res.json({ message: 'Vaccination deleted successfully' });
  } catch (error) {
    return next(error);
  }
});

// ==========================================
// 2. DISEASE & TREATMENT RECORDS CRUD
// ==========================================

// GET all treatments
router.get('/treatments', async (req, res, next) => {
  try {
    const treatments = await Treatment.find().sort({ startDate: -1 });
    return res.json({ treatments });
  } catch (error) {
    return next(error);
  }
});

// CREATE a treatment
router.post('/treatments', async (req, res, next) => {
  try {
    const treatment = await Treatment.create(req.body);
    return res.status(201).json({ treatment });
  } catch (error) {
    return next(error);
  }
});

// UPDATE a treatment
router.put('/treatments/:id', async (req, res, next) => {
  try {
    const treatment = await Treatment.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!treatment) return res.status(404).json({ message: 'Treatment not found' });
    return res.json({ treatment });
  } catch (error) {
    return next(error);
  }
});

// DELETE a treatment
router.delete('/treatments/:id', async (req, res, next) => {
  try {
    const treatment = await Treatment.findByIdAndDelete(req.params.id);
    if (!treatment) return res.status(404).json({ message: 'Treatment not found' });
    return res.json({ message: 'Treatment deleted successfully' });
  } catch (error) {
    return next(error);
  }
});

// ==========================================
// 3. VETERINARY MANAGEMENT CRUD
// ==========================================

// GET all vet visits
router.get('/vet-visits', async (req, res, next) => {
  try {
    const visits = await VeterinaryVisit.find().sort({ visitDate: -1 });
    return res.json({ visits });
  } catch (error) {
    return next(error);
  }
});

// CREATE a vet visit
router.post('/vet-visits', async (req, res, next) => {
  try {
    const visit = await VeterinaryVisit.create(req.body);
    return res.status(201).json({ visit });
  } catch (error) {
    return next(error);
  }
});

// UPDATE a vet visit
router.put('/vet-visits/:id', async (req, res, next) => {
  try {
    const visit = await VeterinaryVisit.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!visit) return res.status(404).json({ message: 'Veterinary visit not found' });
    return res.json({ visit });
  } catch (error) {
    return next(error);
  }
});

// DELETE a vet visit
router.delete('/vet-visits/:id', async (req, res, next) => {
  try {
    const visit = await VeterinaryVisit.findByIdAndDelete(req.params.id);
    if (!visit) return res.status(404).json({ message: 'Veterinary visit not found' });
    return res.json({ message: 'Veterinary visit deleted successfully' });
  } catch (error) {
    return next(error);
  }
});

export default router;
