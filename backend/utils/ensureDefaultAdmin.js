import User from '../models/User.js';
import { env } from '../config/env.js';

export async function ensureDefaultAdmin() {
  if (!env.defaultAdminEmail || !env.defaultAdminPassword) {
    console.log('Default admin bootstrap skipped (ADMIN_EMAIL or ADMIN_PASSWORD not set)');
    return;
  }

  const email = env.defaultAdminEmail.toLowerCase().trim();
  const existingUser = await User.findOne({ email }).select('+password');

  if (!existingUser) {
    await User.create({
      name: 'Farm Admin',
      email,
      password: env.defaultAdminPassword,
      role: 'admin'
    });
    console.log(`Default admin created: ${email}`);
    return;
  }

  if (existingUser.role !== 'admin') {
    existingUser.role = 'admin';
    await existingUser.save();
    console.log(`Existing account promoted to admin: ${email}`);
  }
}
