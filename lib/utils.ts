import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function debounce<T extends (...args: any[]) => void>(
  func: T,
  wait: number
) {
  let timeout: NodeJS.Timeout | number | undefined | null;

  const debounced = function(...args: Parameters<T>) {
    if (timeout) clearTimeout(timeout as any);
    timeout = setTimeout(() => {
      timeout = null;
      func(...args);
    }, wait);
  };

  const cancel = () => {
    if (timeout) {
      clearTimeout(timeout as any);
      timeout = null;
    }
  };

  const result = debounced as ((...args: Parameters<T>) => void) & { cancel: () => void };
  result.cancel = cancel;

  return result;
}
