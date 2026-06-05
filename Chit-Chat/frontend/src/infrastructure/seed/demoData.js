import { createConversation, conversationTypes } from '../../domain/entities/conversation.js';
import { createUser, presenceStates } from '../../domain/entities/user.js';

export const demoUser = createUser({
  id: 'u-rohit',
  name: 'Rohit Pokhariya',
  email: 'rohit@student.dev',
  status: presenceStates.ONLINE,
});

export const demoUsers = [
  demoUser,
  createUser({
    id: 'u-aisha',
    name: 'Aisha Khan',
    email: 'aisha@student.dev',
    status: presenceStates.ONLINE,
  }),
  createUser({
    id: 'u-veer',
    name: 'Veer Sharma',
    email: 'veer@student.dev',
    status: presenceStates.AWAY,
  }),
];

export const demoConversations = [
  createConversation({
    id: 'c-direct-aisha',
    type: conversationTypes.DIRECT,
    title: 'Aisha Khan',
    memberIds: ['u-rohit', 'u-aisha'],
    messages: [
      {
        id: 'm-101',
        authorId: 'u-aisha',
        body: 'Frontend foundation first, then Socket.IO wiring. Solid plan.',
        createdAt: '2026-06-05T17:10:00.000Z',
        readAt: null,
      },
    ],
  }),
  createConversation({
    id: 'c-group-kodex',
    type: conversationTypes.GROUP,
    title: 'Kodex Batch',
    memberIds: ['u-rohit', 'u-aisha', 'u-veer'],
    messages: [],
  }),
];

export const demoMetrics = [
  { label: 'Architecture layers', value: '4' },
  { label: 'Core modules', value: '7' },
  { label: 'Chat modes', value: '2' },
  { label: 'UX states planned', value: '10+' },
];
