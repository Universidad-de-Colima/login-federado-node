import { useEffect, useState } from 'react';

/** true cuando `window.scrollY` supera `threshold` (default 5px). */
export function useScrolled(threshold = 5): boolean {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > threshold);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [threshold]);

  return scrolled;
}
