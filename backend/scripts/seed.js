import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import Tenant from '../models/Tenant.js';
import User from '../models/User.js';

dotenv.config();

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    // Clear minimal data for idempotent seed of tenants and users
    const tenants = [
      { name: 'Acme', slug: 'acme', plan: 'free' },
      { name: 'Globex', slug: 'globex', plan: 'free' },
    ];

    const created = {};
    for (const t of tenants) {
      const tenant = await Tenant.findOneAndUpdate({ slug: t.slug }, t, { upsert: true, new: true, setDefaultsOnInsert: true });
      created[t.slug] = tenant;
    }

    const passwordHash = await bcrypt.hash('password', 10);

    const users = [
      { name: 'Acme Admin', email: 'admin@acme.test', role: 'admin', tenant: created['acme']._id },
      { name: 'Acme User', email: 'user@acme.test', role: 'member', tenant: created['acme']._id },
      { name: 'Globex Admin', email: 'admin@globex.test', role: 'admin', tenant: created['globex']._id },
      { name: 'Globex User', email: 'user@globex.test', role: 'member', tenant: created['globex']._id },
    ];

    for (const u of users) {
      await User.findOneAndUpdate(
        { email: u.email },
        { ...u, password: passwordHash },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
    }

    console.log('Seed completed. Accounts ready with password: password');
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
};

run();


