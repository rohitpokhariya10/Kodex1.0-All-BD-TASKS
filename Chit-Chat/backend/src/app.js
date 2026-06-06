import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import { env } from './config/env.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import { authRoutes } from './routes/authRoutes.js';
import { conversationRoutes } from './routes/conversationRoutes.js';
import { groupRoutes } from './routes/groupRoutes.js';
import { userRoutes } from './routes/userRoutes.js';

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
  app.use('/api/users', userRoutes);
  app.use('/api/groups', groupRoutes);
  app.use('/api/conversations', conversationRoutes);
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
