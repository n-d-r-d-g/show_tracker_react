import { Monitor, Moon, Sun } from 'lucide-react';

export const DEBOUNCE_TIMEOUT_IN_MS = 300;
export const THEMES = [
  {
    key: 'system',
    Icon: Monitor,
    labelKey: 'system',
  },
  {
    key: 'light',
    Icon: Sun,
    labelKey: 'light',
  },
  {
    key: 'dark',
    Icon: Moon,
    labelKey: 'dark',
  },
] as const;
