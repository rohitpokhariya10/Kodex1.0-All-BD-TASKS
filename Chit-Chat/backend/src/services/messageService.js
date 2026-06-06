import { Conversation } from '../models/Conversation.js';
import { Message } from '../models/Message.js';
import { HttpError } from '../utils/httpError.js';

export async function deleteOwnMessage({ messageId, user }) {
  const message = await Message.findById(messageId);

  if (!message || message.deletedAt) {
    throw new HttpError(404, 'Message was not found.');
  }

  const conversation = await Conversation.findById(message.conversationId);

  if (!conversation || !conversation.hasMember(user._id)) {
    throw new HttpError(403, 'You do not have access to this message.');
  }

  if (message.authorId.toString() !== user.id) {
    throw new HttpError(403, 'Only the message author can delete this message.');
  }

  message.deletedAt = new Date();
  await message.save();

  await refreshConversationLastMessageAt(conversation);

  return { conversation, message };
}

async function refreshConversationLastMessageAt(conversation) {
  const latestMessage = await Message.findOne({
    conversationId: conversation._id,
    deletedAt: null,
  }).sort({ createdAt: -1 });

  conversation.lastMessageAt = latestMessage?.createdAt ?? null;
  await conversation.save();
}
