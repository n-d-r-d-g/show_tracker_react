import { useTranslation } from 'react-i18next';
import { THEMES } from '../constants';
import { useTheme } from './theme-provider';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

function ThemeIcons() {
  const { theme } = useTheme();

  return THEMES.map((themeObj) => {
    const Icon = themeObj.Icon;

    return (
      <Icon
        key={themeObj.key}
        data-active={themeObj.key === theme}
        className="absolute h-full w-full p-2 text-neutral-500 dark:text-neutral-300 -rotate-90 scale-0 opacity-0 data-[active='true']:rotate-0 data-[active='true']:scale-100 data-[active='true']:opacity-100 motion-safe:transition-all"
      />
    );
  });
}

function ThemeDropdownMenuItems() {
  const { setTheme } = useTheme();
  const { t: tCommon } = useTranslation('common');

  return THEMES.map((themeObj) => (
    <DropdownMenuItem
      key={themeObj.key}
      onClick={() => {
        setTheme(themeObj.key);
      }}
    >
      {tCommon(`theme.${themeObj.labelKey}`)}
    </DropdownMenuItem>
  ));
}

export function ThemeSwitch() {
  const { t: tCommon } = useTranslation('common');

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          title={tCommon('theme.toggle')}
          className="relative h-9 w-9"
        >
          <ThemeIcons />
          <span className="sr-only">{tCommon('theme.toggle')}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <ThemeDropdownMenuItems />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
