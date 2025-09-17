import express from 'express';
import Note from '../models/Note.js';
import Tenant from '../models/Tenant.js';
import { authenticateToken } from '../middleware/auth.js';
import { validateNote } from '../middleware/validation.js';

const router = express.Router();

// Get all notes for authenticated user
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 10, category, search, isArchived = false } = req.query;
    const skip = (page - 1) * limit;

    let query = { 
      tenant: req.user.tenant._id,
      author: req.user._id,
      isArchived: isArchived === 'true'
    };

    // Add category filter
    if (category && category !== 'All') {
      query.category = category;
    }

    // Add search filter
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } }
      ];
    }

    const notes = await Note.find(query)
      .sort({ isPinned: -1, updatedAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('author', 'name email');

    const total = await Note.countDocuments(query);

    res.json({
      notes,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    console.error('Get notes error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single note
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const note = await Note.findOne({
      _id: req.params.id,
      tenant: req.user.tenant._id,
      $or: [
        { author: req.user._id },
        { 'sharedWith.user': req.user._id }
      ]
    }).populate('author', 'name email');

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    res.json(note);
  } catch (error) {
    console.error('Get note error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new note
router.post('/', authenticateToken, validateNote, async (req, res) => {
  try {
    // Enforce subscription limit for Free tenants
    if (req.user.tenant.plan === 'free') {
      const count = await Note.countDocuments({ tenant: req.user.tenant._id, isArchived: false });
      if (count >= 3) {
        return res.status(402).json({ message: 'Note limit reached for Free plan. Upgrade to Pro to add more notes.' });
      }
    }

    const noteData = {
      ...req.body,
      author: req.user._id,
      tenant: req.user.tenant._id,
    };

    const note = new Note(noteData);
    await note.save();
    await note.populate('author', 'name email');

    res.status(201).json({
      message: 'Note created successfully',
      note
    });
  } catch (error) {
    console.error('Create note error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update note
router.put('/:id', authenticateToken, validateNote, async (req, res) => {
  try {
    const note = await Note.findOne({ _id: req.params.id, tenant: req.user.tenant._id, author: req.user._id });

    if (!note) {
      return res.status(404).json({ message: 'Note not found or access denied' });
    }

    const updatedNote = await Note.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('author', 'name email');

    res.json({
      message: 'Note updated successfully',
      note: updatedNote
    });
  } catch (error) {
    console.error('Update note error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete note
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const note = await Note.findOne({ _id: req.params.id, tenant: req.user.tenant._id, author: req.user._id });

    if (!note) {
      return res.status(404).json({ message: 'Note not found or access denied' });
    }

    await Note.findByIdAndDelete(req.params.id);

    res.json({ message: 'Note deleted successfully' });
  } catch (error) {
    console.error('Delete note error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Toggle pin status
router.patch('/:id/pin', authenticateToken, async (req, res) => {
  try {
    const note = await Note.findOne({ _id: req.params.id, tenant: req.user.tenant._id, author: req.user._id });

    if (!note) {
      return res.status(404).json({ message: 'Note not found or access denied' });
    }

    note.isPinned = !note.isPinned;
    await note.save();

    res.json({
      message: `Note ${note.isPinned ? 'pinned' : 'unpinned'} successfully`,
      note
    });
  } catch (error) {
    console.error('Toggle pin error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Toggle archive status
router.patch('/:id/archive', authenticateToken, async (req, res) => {
  try {
    const note = await Note.findOne({ _id: req.params.id, tenant: req.user.tenant._id, author: req.user._id });

    if (!note) {
      return res.status(404).json({ message: 'Note not found or access denied' });
    }

    note.isArchived = !note.isArchived;
    await note.save();

    res.json({
      message: `Note ${note.isArchived ? 'archived' : 'unarchived'} successfully`,
      note
    });
  } catch (error) {
    console.error('Toggle archive error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get categories
router.get('/categories/list', authenticateToken, async (req, res) => {
  try {
    const categories = await Note.distinct('category', { tenant: req.user.tenant._id, author: req.user._id });
    res.json({ categories });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
