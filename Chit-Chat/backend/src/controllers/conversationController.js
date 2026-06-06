import mongoose from 'mongoose';
import { z } from 'zod';
import { Conversation, conversationTypes } from '../models/Conversation.js';
import { Message } from '../models/Message.js';
import { User } from '../models/User.js';
import { HttpError } from '../utils/httpError.js';

export const createDirectConversationSchema = z.object({
  participantId: z.string().trim().min(1),
});

export const sendMessageSchema = z.object({
  body: z.string().trim().min(1).max(2000),
});

export async function listConversations(req, res, next) {
  try {
    const conversations = await Conversation.find({ memberIds: req.user._id })
      .populate('memberIds', 'name email status lastSeenAt')
      .sort({ lastMessageAt: -1, updatedAt: -1 });

    const payload = await Promise.all(
      conversations.map((conversation) => serializeConversation(conversation, req.user._id)),
    );

    res.json({ conversations: payload });
  } catch (error) {
    next(error);
  }
}

export async function createDirectConversation(req, res, next) {
  try {
    assertObjectId(req.body.participantId, 'Participant id is invalid.');

    if (req.body.participantId === req.user.id) {
      throw new HttpError(400, 'You cannot start a direct chat with yourself.');
    }

    const participant = await User.findById(req.body.participantId);

    if (!participant) {
      throw new HttpError(404, 'Participant was not found.');
    }

    const directKey = createDirectKey(req.user._id, participant._id);
    let conversation = await Conversation.findOne({ directKey });
    let statusCode = 200;

    if (!conversation) {
      conversation = await Conversation.create({
        createdBy: req.user._id,
        directKey,
        memberIds: [req.user._id, participant._id],
        type: conversationTypes.DIRECT,
      });
      statusCode = 201;
    }

    await conversation.populate('memberIds', 'name email status lastSeenAt');

    res.status(statusCode).json({
      conversation: await serializeConversation(conversation, req.user._id),
    });
  } catch (error) {
    next(error);
  }
}

export async function listMessages(req, res, next) {
  try {
    const conversation = await requireConversationMember(req.params.conversationId, req.user._id);
    const messages = await Message.find({
      conversationId: conversation._id,
      deletedAt: null,
    }).sort({ createdAt: 1 });

    res.json({
      messages: messages.map((message) => serializeMessage(message, req.user._id)),
    });
  } catch (error) {
    next(error);
  }
}

export async function sendMessage(req, res, next) {
  try {
    const conversation = await requireConversationMember(req.params.conversationId, req.user._id);
    const message = await Message.create({
      authorId: req.user._id,
      body: req.body.body,
      conversationId: conversation._id,
      readBy: [{ userId: req.user._id, readAt: new Date() }],
    });

    conversation.lastMessageAt = message.createdAt;
    await conversation.save();

    res.status(201).json({
      message: serializeMessage(message, req.user._id),
    });
  } catch (error) {
    next(error);
  }
}

export async function markConversationRead(req, res, next) {
  try {
    const conversation = await requireConversationMember(req.params.conversationId, req.user._id);
    const result = await Message.updateMany(
      {
        authorId: { $ne: req.user._id },
        conversationId: conversation._id,
        deletedAt: null,
        readBy: { $not: { $elemMatch: { userId: req.user._id } } },
      },
      {
        $push: {
          readBy: {
            readAt: new Date(),
            userId: req.user._id,
          },
        },
      },
    );

    res.json({
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    next(error);
  }
}

async function requireConversationMember(conversationId, userId) {
  assertObjectId(conversationId, 'Conversation id is invalid.');

  const conversation = await Conversation.findById(conversationId);

  if (!conversation) {
    throw new HttpError(404, 'Conversation was not found.');
  }

  if (!conversation.hasMember(userId)) {
    throw new HttpError(403, 'You do not have access to this conversation.');
  }

  return conversation;
}

async function serializeConversation(conversation, currentUserId) {
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

function serializeMessage(message, currentUserId) {
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

function createDirectKey(firstUserId, secondUserId) {
  return [firstUserId.toString(), secondUserId.toString()].sort().join(':');
}

function assertObjectId(value, message) {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    throw new HttpError(400, message);
  }
}
