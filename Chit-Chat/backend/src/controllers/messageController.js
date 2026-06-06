import mongoose from 'mongoose';
import { HttpError } from '../utils/httpError.js';
import { serializeMessage } from '../utils/serializers.js';
import { deleteOwnMessage } from '../services/messageService.js';

export async function deleteMessage(req, res, next) {
  try {
    assertObjectId(req.params.messageId, 'Message id is invalid.');

    const { message } = await deleteOwnMessage({
      messageId: req.params.messageId,
      user: req.user,
    });

    res.json({
      message: serializeMessage(message, req.user._id),
    });
  } catch (error) {
    next(error);
  }
}

function assertObjectId(value, message) {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    throw new HttpError(400, message);
  }
}
