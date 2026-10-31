export const borderClassExpressive = (isFirst = false, isLast = false): string => {
  const base =
    '!bg-gray-200/50 dark:!bg-ucol_gray_dark-100 hover:!bg-gray-300/50 dark:hover:!bg-ucol_gray_dark-300';
  if (isFirst && isLast) return base + ' rounded-3xl';
  if (isFirst) return base + ' rounded-t-3xl rounded-b-md';
  if (isLast) return base + ' rounded-b-3xl rounded-t-md';
  return base + ' rounded-md';
};
