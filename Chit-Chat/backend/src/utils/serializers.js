import { Message } from '../models/Message.js';
import { conversationTypes } from '../models/Conversation.js';

export async function serializeConversation(conversation, currentUserId) {
  const latestMessage = await Message.findOne({
    conversationId: conversation._id,
    deletedAt: null,
  }).sort({ createdAt: -1 });
  const unreadCount = await Message.countDocuments({
    authorId: { $ne: currentUserId },
    conversationId: conversation._id,
    deletedAt: null,
    readBy: { $not: { $elemMatch: { userId: currentUserId } } },
  });
  const members = conversation.memberIds.map((member) => member.toJSON?.() ?? member);

  return {
    id: conversation.id,
    createdAt: conversation.createdAt,
    lastMessageAt: conversation.lastMessageAt,
    latestMessage: latestMessage ? serializeMessage(latestMessage, currentUserId) : null,
    memberIds: members.map((member) => member.id ?? member._id.toString()),
    members,
    title: getConversationTitle(conversation, members, currentUserId),
    type: conversation.type,
    unreadCount,
    updatedAt: conversation.updatedAt,
  };
}

export function serializeMessage(message, currentUserId) {
  const readReceipt = message.readBy.find(
    (receipt) => receipt.userId.toString() === currentUserId.toString(),
  );

  return {
    id: message.id,
    authorId: message.authorId.toString(),
    body: message.body,
    createdAt: message.createdAt,
    deletedAt: message.deletedAt,
    readAt: readReceipt?.readAt ?? null,
    status: readReceipt ? 'read' : 'delivered',
    updatedAt: message.updatedAt,
  };
}

function getConversationTitle(conversation, members, currentUserId) {
  if (conversation.type === conversationTypes.GROUP) {
    return conversation.title;
  }

  const otherMember = members.find((member) => member.id !== currentUserId.toString());

  return otherMember?.name ?? 'Direct chat';
}
