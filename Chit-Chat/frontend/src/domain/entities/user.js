export const presenceStates = Object.freeze({
  ONLINE: 'online',
  AWAY: 'away',
  OFFLINE: 'offline',
});

export function createUser({ id, name, email, avatar, status = presenceStates.OFFLINE }) {
  return {
    id,
    name,
    email,
    avatar,
    status,
    initials: name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase(),
  };
}
