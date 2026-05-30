import dotenv from 'dotenv';

dotenv.config();

export const env = {
  port: Number.parseInt(process.env.PORT || '5000', 10),
  mongoUri: process.env.MONGO_URI || '',
  jwtSecret: process.env.JWT_SECRET || 'change_me_for_production',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  defaultAdminEmail: process.env.ADMIN_EMAIL || '',
  defaultAdminPassword: process.env.ADMIN_PASSWORD || ''
};
