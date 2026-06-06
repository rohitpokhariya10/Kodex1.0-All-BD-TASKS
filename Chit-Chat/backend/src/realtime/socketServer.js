import { Server } from 'socket.io';
import { Conversation } from '../models/Conversation.js';
import { Message } from '../models/Message.js';
import { presenceStates, User } from '../models/User.js';
import { deleteOwnMessage } from '../services/messageService.js';
import { verifyAuthToken } from '../utils/jwt.js';
import { serializeMessage } from '../utils/serializers.js';

export function createSocketServer(httpServer, { corsOrigin }) {
  const io = new Server(httpServer, {
    cors: {
      credentials: true,
      origin: corsOrigin,
    },
  });

  io.use(authenticateSocket);

  io.on('connection', async (socket) => {
    const user = socket.user;

    socket.join(userRoom(user.id));
    await setUserPresence(io, user, presenceStates.ONLINE);

    socket.on('conversation:join', async ({ conversationId } = {}, ack) => {
      try {
        const conversation = await requireConversationMember(conversationId, user.id);
        socket.join(conversationRoom(conversation.id));
        ack?.({ ok: true, conversationId: conversation.id });
      } catch (error) {
        emitSocketError(socket, ack, error);
      }
    });

    socket.on('conversation:leave', ({ conversationId } = {}, ack) => {
      if (conversationId) {
        socket.leave(conversationRoom(conversationId));
      }

      ack?.({ ok: true });
    });

    socket.on('message:send', async ({ conversationId, body } = {}, ack) => {
      try {
        const cleanBody = body?.toString().trim();

        if (!cleanBody) {
          throw new Error('Message body is required.');
        }

        if (cleanBody.length > 2000) {
          throw new Error('Message body must be 2000 characters or fewer.');
        }

        const conversation = await requireConversationMember(conversationId, user.id);
        const message = await Message.create({
          authorId: user._id,
          body: cleanBody,
          conversationId: conversation._id,
          readBy: [{ userId: user._id, readAt: new Date() }],
        });

        conversation.lastMessageAt = message.createdAt;
        await conversation.save();

        const senderPayload = {
          conversationId: conversation.id,
          message: serializeMessage(message, user._id),
        };
        const recipientPayload = {
          conversationId: conversation.id,
          message: serializeMessageForRecipient(message),
        };

        socket.emit('message:new', senderPayload);
        socket.to(conversationRoom(conversation.id)).emit('message:new', recipientPayload);
        ack?.({ ok: true, ...senderPayload });
      } catch (error) {
        emitSocketError(socket, ack, error);
      }
    });

    socket.on('typing:update', async ({ conversationId, isTyping } = {}, ack) => {
      try {
        const conversation = await requireConversationMember(conversationId, user.id);
        const payload = {
          conversationId: conversation.id,
          isTyping: Boolean(isTyping),
          userId: user.id,
        };

        socket.to(conversationRoom(conversation.id)).emit('typing:update', payload);
        ack?.({ ok: true });
      } catch (error) {
        emitSocketError(socket, ack, error);
      }
    });

    socket.on('message:delete', async ({ messageId } = {}, ack) => {
      try {
        if (!messageId) {
          throw new Error('Message id is required.');
        }

        const { conversation, message } = await deleteOwnMessage({ messageId, user });
        const payload = {
          conversationId: conversation.id,
          deletedAt: message.deletedAt,
          messageId: message.id,
        };

        io.to(conversationRoom(conversation.id)).emit('message:deleted', payload);
        ack?.({ ok: true, ...payload });
      } catch (error) {
        emitSocketError(socket, ack, error);
      }
    });

    socket.on('disconnect', async () => {
      const sockets = await io.in(userRoom(user.id)).fetchSockets();

      if (sockets.length === 0) {
        await setUserPresence(io, user, presenceStates.OFFLINE);
      }
    });
  });

  return io;
}

async function authenticateSocket(socket, next) {
  try {
    const token = socket.handshake.auth?.token;

    if (!token) {
      throw new Error('Authentication token is required.');
    }

    const payload = verifyAuthToken(token);
    const user = await User.findById(payload.sub);

    if (!user) {
      throw new Error('Authenticated user no longer exists.');
    }

    socket.user = user;
    next();
  } catch (error) {
    next(error);
  }
}

async function requireConversationMember(conversationId, userId) {
  if (!conversationId) {
    throw new Error('Conversation id is required.');
  }

  const conversation = await Conversation.findById(conversationId);

  if (!conversation) {
    throw new Error('Conversation was not found.');
  }

  if (!conversation.hasMember(userId)) {
    throw new Error('You do not have access to this conversation.');
  }

  return conversation;
}

async function setUserPresence(io, user, status) {
  user.status = status;
  user.lastSeenAt = status === presenceStates.OFFLINE ? new Date() : null;
  await user.save();

  io.emit('presence:update', {
    lastSeenAt: user.lastSeenAt,
    status: user.status,
    userId: user.id,
  });
}

function emitSocketError(socket, ack, error) {
  const payload = {
    message: error.message ?? 'Realtime request failed.',
  };

  if (ack) {
    ack({ ok: false, ...payload });
    return;
  }

  socket.emit('error', payload);
}

function serializeMessageForRecipient(message) {
  return {
    id: message.id,
    authorId: message.authorId.toString(),
    body: message.body,
    createdAt: message.createdAt,
    deletedAt: message.deletedAt,
    readAt: null,
    status: 'delivered',
    updatedAt: message.updatedAt,
  };
}

function conversationRoom(conversationId) {
  return `conversation:${conversationId}`;
}

function userRoom(userId) {
  return `user:${userId}`;
}
