import type { HeaderUser } from './types';

const SIZE_DIM: Record<'sm' | 'md' | 'lg', string> = {
  sm: 'w-7 h-7 text-[10px]',
  md: 'w-8 h-8 text-xs',
  lg: 'w-9 h-9 text-xs',
};

export interface HeaderAvatarProps {
  user: HeaderUser;
  bgClass: string;
  ringClass: string;
  textClass: string;
  /** sm: 28px · md: 32px (default) · lg: 36px */
  size?: 'sm' | 'md' | 'lg';
  ringWidth?: 1 | 2;
}

/** Avatar con iniciales como fallback. */
export function HeaderAvatar({
  user,
  bgClass,
  ringClass,
  textClass,
  size = 'md',
  ringWidth = 2,
}: HeaderAvatarProps) {
  const initials = user.name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const dim = SIZE_DIM[size];
  const ring = ringWidth === 1 ? 'ring-1' : 'ring-2';

  if (user.avatar) {
    return (
      <img
        alt={user.name}
        className={`${dim} rounded-full object-cover ${ring} ${ringClass} shrink-0`}
        src={user.avatar}
      />
    );
  }

  return (
    <span className={`${dim} rounded-full ${bgClass} flex items-center justify-center font-bold ${textClass} ${ring} ${ringClass} shrink-0`}>
      {initials}
    </span>
  );
}
