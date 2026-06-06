import { Router } from 'express';
import { createGroup, createGroupSchema } from '../controllers/conversationController.js';
import { requireAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

export const groupRoutes = Router();

groupRoutes.post('/', requireAuth, validate(createGroupSchema), createGroup);
