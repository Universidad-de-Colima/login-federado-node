import clsx from 'clsx';

import { HeaderAvatar, type HeaderAvatarProps } from './HeaderAvatar';
import { UserInfoTooltip } from './UserInfoTooltip';
import type { HeaderUser } from './types';

export interface HeaderUserDisplayProps {
  user: HeaderUser;
  /** "full" (default) → avatar + nombre/rol · "avatar" → sólo avatar con tooltip al hover */
  userDisplay?: 'full' | 'avatar';
  avatarBgClass: string;
  avatarRingClass: string;
  avatarTextClass: string;
  /** Color del nombre */
  textClass: string;
  /** Color del rol/email */
  textMutedClass: string;
  size?: HeaderAvatarProps['size'];
  ringWidth?: HeaderAvatarProps['ringWidth'];
}

/** Bloque "usuario" del header: avatar + nombre/rol, o solo avatar con tooltip. */
export function HeaderUserDisplay({
  user,
  userDisplay = 'full',
  avatarBgClass,
  avatarRingClass,
  avatarTextClass,
  textClass,
  textMutedClass,
  size = 'md',
  ringWidth = 2,
}: HeaderUserDisplayProps) {
  const avatar = (
    <HeaderAvatar bgClass={avatarBgClass} ringClass={avatarRingClass} ringWidth={ringWidth} size={size} textClass={avatarTextClass} user={user} />
  );

  if (userDisplay === 'avatar') {
    return (
      <UserInfoTooltip user={user}>
        <span className="flex cursor-default">{avatar}</span>
      </UserInfoTooltip>
    );
  }

  return (
    <div className={clsx('flex items-center min-w-0 gap-2.5')}>
      {avatar}
      <div className="flex flex-col leading-tight min-w-0">
        <span className={clsx('text-sm font-medium truncate max-w-36', textClass)}>{user.name}</span>
        {(user.role ?? user.email) && (
          <span className={clsx('text-xs truncate max-w-36', textMutedClass)}>{user.role ?? user.email}</span>
        )}
      </div>
    </div>
  );
}
