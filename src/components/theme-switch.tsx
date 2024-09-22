import { Monitor, Moon, Sun } from 'lucide-react';
import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from './theme-provider';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

export function ThemeSwitch() {
  const { theme, setTheme } = useTheme();
  const { t: tCommon } = useTranslation('common');
  const themes = useRef({
    system: {
      Icon: Monitor,
      labelKey: 'system',
    },
    light: {
      Icon: Sun,
      labelKey: 'light',
    },
    dark: {
      Icon: Moon,
      labelKey: 'dark',
    },
  } as const);

  const ActiveIcon = themes.current[theme].Icon;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" title={tCommon('theme.toggle')}>
          <ActiveIcon className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">{tCommon('theme.toggle')}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {Object.entries(themes.current).map(([themeName]) => (
          <DropdownMenuItem
            key={themeName}
            onClick={() => setTheme(themeName as keyof typeof themes.current)}
          >
            {tCommon(`theme.${themeName as keyof typeof themes.current}`)}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
