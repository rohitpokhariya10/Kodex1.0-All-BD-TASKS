import { Router } from 'express';
import {
  createDirectConversation,
  createDirectConversationSchema,
  getConversation,
  listConversations,
  listMessages,
  markConversationRead,
  sendMessage,
  sendMessageSchema,
} from '../controllers/conversationController.js';
import { requireAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

export const conversationRoutes = Router();

conversationRoutes.use(requireAuth);
conversationRoutes.get('/', listConversations);
conversationRoutes.post('/direct', validate(createDirectConversationSchema), createDirectConversation);
conversationRoutes.get('/:conversationId', getConversation);
conversationRoutes.get('/:conversationId/messages', listMessages);
conversationRoutes.post('/:conversationId/messages', validate(sendMessageSchema), sendMessage);
conversationRoutes.patch('/:conversationId/read', markConversationRead);
