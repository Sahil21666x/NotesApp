import express from 'express';
import Tenant from '../models/Tenant.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Upgrade plan: POST /tenants/:slug/upgrade (Admin only)
router.post('/:slug/upgrade', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { slug } = req.params;
    // Ensure user belongs to this tenant
    if (!req.user.tenant || req.user.tenant.slug !== slug.toLowerCase()) {
      return res.status(403).json({ message: 'Forbidden: cross-tenant access' });
    }

    const tenant = await Tenant.findOneAndUpdate(
      { slug: slug.toLowerCase() },
      { plan: 'pro' },
      { new: true }
    );

    if (!tenant) return res.status(404).json({ message: 'Tenant not found' });

    res.json({ message: 'Tenant upgraded to Pro successfully', tenant });
  } catch (error) {
    console.error('Upgrade error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;


