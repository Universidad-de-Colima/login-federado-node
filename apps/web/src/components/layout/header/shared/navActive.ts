import type { NavItem } from '@/types/layout.types';

/**
 * Coincidencia "activo" con límite de segmento: exige que `pathname` sea
 * exactamente `href` o continúe con "/", para no confundir p.ej. "/user"
 * con "/users".
 */
function matchesHrefStrict(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(href + '/');
}

/**
 * isActive con soporte de `children`. Si se pasan `siblings` (los demás items
 * del mismo nivel), un item deja de considerarse activo cuando otro hermano
 * tiene un href más específico (más largo) que también matchea el pathname,
 * p.ej. "/admin" no debe marcarse activo si "/admin/eventos" ya matchea.
 */
export function isNavItemActiveStrict(pathname: string, item: NavItem, siblings?: NavItem[]): boolean {
  if (item.href === '/') return pathname === '/';

  const hasChildren = !!item.children?.length;
  const childActive = hasChildren
    ? item.children!.some((c) => matchesHrefStrict(pathname, c.href))
    : false;

  if (!matchesHrefStrict(pathname, item.href) && !childActive) return false;

  const shadowedByMoreSpecificSibling = siblings?.some(
    (sibling) => sibling !== item && sibling.href.length > item.href.length && matchesHrefStrict(pathname, sibling.href),
  );

  return !shadowedByMoreSpecificSibling;
}
