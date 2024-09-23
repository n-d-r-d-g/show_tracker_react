import { Moon, Sun, SunMoon } from 'lucide-react';

export const DEBOUNCE_TIMEOUT_IN_MS = 300;
export const THEMES = [
  {
    key: 'system',
    Icon: SunMoon,
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
