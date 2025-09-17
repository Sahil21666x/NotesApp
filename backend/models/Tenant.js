import mongoose from 'mongoose';

const tenantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  plan: {
    type: String,
    enum: ['free', 'pro'],
    default: 'free',
  }
}, { timestamps: true });

// Mongoose will enforce uniqueness via the 'unique' option above; avoid duplicate index definition

export default mongoose.model('Tenant', tenantSchema);


