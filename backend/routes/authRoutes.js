import express from 'express';
import User from '../models/User.js';
import { requireAuth } from '../middleware/auth.js';
import { signAuthToken } from '../utils/token.js';

const router = express.Router();

function normalizeUserResponse(user) {
  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role
  };
}

router.post('/register', async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long.' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
      return res.status(409).json({ message: 'An account already exists for this email.' });
    }

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password,
      role: 'user'
    });

    const token = signAuthToken(user);

    return res.status(201).json({
      message: 'Registration successful.',
      token,
      user: normalizeUserResponse(user)
    });
  } catch (error) {
    return next(error);
  }
});

function createLoginHandler(expectedRole) {
  return async (req, res, next) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required.' });
      }

      const normalizedEmail = email.toLowerCase().trim();
      const user = await User.findOne({ email: normalizedEmail }).select('+password');

      if (!user) {
        return res.status(401).json({ message: 'Invalid email or password.' });
      }

      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid email or password.' });
      }

      if (expectedRole === 'admin' && user.role !== 'admin') {
        return res.status(403).json({ message: 'This account does not have admin access.' });
      }

      if (expectedRole === 'user' && user.role !== 'user') {
        return res
          .status(403)
          .json({ message: 'Use admin login for admin accounts.' });
      }

      const token = signAuthToken(user);

      return res.json({
        message: 'Login successful.',
        token,
        user: normalizeUserResponse(user)
      });
    } catch (error) {
      return next(error);
    }
  };
}

router.post('/login-user', createLoginHandler('user'));
router.post('/login-admin', createLoginHandler('admin'));

router.get('/me', requireAuth, async (req, res) => {
  res.json({
    user: req.user
  });
});

export default router;
