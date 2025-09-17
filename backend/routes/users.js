import express from 'express';
import bcrypt from 'bcryptjs';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';
import User from '../models/User.js';

const router = express.Router();

// Admin invite user to same tenant
// POST /api/users/invite { name, email, password?, role }
router.post('/invite', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email) {
      return res.status(400).json({ message: 'Name and email are required' });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    const user = new User({
      name,
      email,
      password: password || Math.random().toString(36).slice(2, 10),
      tenant: req.user.tenant._id,
      role: role === 'admin' ? 'admin' : 'member',
    });
    // Let pre-save hook hash the password
    await user.save();

    res.status(201).json({
      message: 'User invited successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Invite user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;


