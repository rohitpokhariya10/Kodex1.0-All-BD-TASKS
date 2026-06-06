import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import { env } from './config/env.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import { authRoutes } from './routes/authRoutes.js';

export function createApp() {
  const app = express();

  app.use(helmet());
  app.use(
    cors({
      credentials: true,
      origin: env.clientOrigin,
    }),
  );
  app.use(express.json({ limit: '1mb' }));
  app.use(morgan(env.nodeEnv === 'production' ? 'combined' : 'dev'));

  app.get('/api/health', (_req, res) => {
    res.json({
      status: 'ok',
      service: 'chit-chat-backend',
    });
  });

  app.use('/api/auth', authRoutes);
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
