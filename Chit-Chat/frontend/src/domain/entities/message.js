export const messageStatus = Object.freeze({
  SENT: 'sent',
  DELIVERED: 'delivered',
  READ: 'read',
});

export function createMessage({
  id,
  authorId,
  body,
  createdAt,
  readAt = null,
  deletedAt = null,
  attachment = null,
  status = messageStatus.DELIVERED,
}) {
  return {
    id,
    authorId,
    body,
    createdAt,
    readAt,
    deletedAt,
    attachment,
    status,
  };
}
