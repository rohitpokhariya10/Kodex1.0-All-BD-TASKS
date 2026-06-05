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
  createUser({
    id: 'u-nisha',
    name: 'Nisha Rawat',
    email: 'nisha@student.dev',
    status: presenceStates.OFFLINE,
  }),
];

export const demoConversations = [
  createConversation({
    id: 'c-direct-aisha',
    type: conversationTypes.DIRECT,
    title: 'Aisha Khan',
    memberIds: ['u-rohit', 'u-aisha'],
    currentUserId: demoUser.id,
    messages: [
      {
        id: 'm-101',
        authorId: 'u-aisha',
        body: 'Frontend foundation first, then backend API wiring tomorrow. Solid plan.',
        createdAt: '2026-06-05T17:10:00.000Z',
        readAt: '2026-06-05T17:12:00.000Z',
      },
      {
        id: 'm-102',
        authorId: 'u-rohit',
        body: 'I want this UI to look submit-ready, not like a basic demo.',
        createdAt: '2026-06-05T17:13:00.000Z',
        readAt: '2026-06-05T17:14:00.000Z',
      },
      {
        id: 'm-103',
        authorId: 'u-aisha',
        body: 'Then keep room for read receipts, typing, files, deletion, and group details.',
        createdAt: '2026-06-05T17:16:00.000Z',
        readAt: null,
      },
    ],
  }),
  createConversation({
    id: 'c-group-kodex',
    type: conversationTypes.GROUP,
    title: 'Kodex Batch',
    memberIds: ['u-rohit', 'u-aisha', 'u-veer', 'u-nisha'],
    currentUserId: demoUser.id,
    messages: [
      {
        id: 'm-201',
        authorId: 'u-veer',
        body: 'Group chat layout should show online members and shared files clearly.',
        createdAt: '2026-06-05T16:50:00.000Z',
        readAt: '2026-06-05T16:55:00.000Z',
      },
      {
        id: 'm-202',
        authorId: 'u-nisha',
        body: 'I added a test attachment state for frontend review.',
        createdAt: '2026-06-05T16:57:00.000Z',
        readAt: null,
        attachment: {
          name: 'socket-flow.png',
          size: '1.8 MB',
        },
      },
    ],
  }),
];

export const demoMetrics = [
  { label: 'Architecture layers', value: '4' },
  { label: 'Core modules', value: '7' },
  { label: 'Chat modes', value: '2' },
  { label: 'UX states planned', value: '10+' },
];
