import { PropsWithChildren } from 'react';
import { ThemeSwitch } from '../../components/theme-switch';
import { cn } from '../../lib/utils';
import { useTranslation } from 'react-i18next';

type Props = PropsWithChildren<{
  className?: string;
}>;

export default function DefaultLayout({ className, children }: Props) {
  const { t: tCommon } = useTranslation('common');

  return (
    <>
      <header className="w-full max-w-full sticky top-0 flex flex-row justify-between items-center px-[max(calc((100%-75rem)/2),0.5rem)] py-2 bg-neutral-50 dark:bg-neutral-900/50 border-b-2 border-neutral-200/50 dark:border-neutral-800/50">
        <p className="uppercase text-sm font-bold">{tCommon('title')}</p>
        <ThemeSwitch />
      </header>
      <main
        className={cn(
          'max-w-full grow min-h-0 px-2 py-8 place-content-center mx-auto',
          className
        )}
      >
        {children}
      </main>
    </>
  );
}
