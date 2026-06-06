import { Router } from 'express';
import { deleteMessage } from '../controllers/messageController.js';
import { requireAuth } from '../middleware/auth.js';

export const messageRoutes = Router();

messageRoutes.delete('/:messageId', requireAuth, deleteMessage);
