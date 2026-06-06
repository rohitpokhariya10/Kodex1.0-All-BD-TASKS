import dotenv from 'dotenv';

dotenv.config();

export const env = {
  clientOrigin: process.env.CLIENT_ORIGIN ?? 'http://localhost:5173',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? '7d',
  jwtSecret: process.env.JWT_SECRET,
  mongoUri: process.env.MONGODB_URI,
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: Number(process.env.PORT ?? 5000),
};

export function validateEnv() {
  const missing = [];

  if (!env.mongoUri) missing.push('MONGODB_URI');
  if (!env.jwtSecret) missing.push('JWT_SECRET');

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
}
