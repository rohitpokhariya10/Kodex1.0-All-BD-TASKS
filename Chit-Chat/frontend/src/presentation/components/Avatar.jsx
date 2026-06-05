export function Avatar({ user, size = 'md' }) {
  return (
    <span className={`avatar avatar-${size}`} title={user.name}>
      {user.initials}
      <i className={`presence-dot presence-${user.status}`} aria-hidden="true" />
    </span>
  );
}
