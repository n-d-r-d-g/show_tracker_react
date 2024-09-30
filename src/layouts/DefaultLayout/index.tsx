import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import showStore from '@/store/show';
import { AxiosError } from 'axios';
import { Power } from 'lucide-react';
import { PropsWithChildren, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ThemeSwitch } from '../../components/theme-switch';
import { Button } from '../../components/ui/button';
import { cn } from '../../lib/utils';

type Props = PropsWithChildren<{
  className?: string;
}>;

function Actions() {
  const { t: tCommon } = useTranslation('common');
  const { isSignedIn, signOut, signOutAll } = useAuth();
  const { toast } = useToast();

  const handleSignOut = useCallback(async () => {
    try {
      await signOut();
    } catch (e) {
      console.log(
        'e :>> ',
        `${(e as AxiosError).code} | ${(e as AxiosError).message}`
      );

      toast({
        variant: 'destructive',
        title: tCommon('errors.error'),
        description: tCommon('errors.signOut'),
      });
    }

    showStore.setShows([]);
  }, [signOut, tCommon, toast]);

  const handleSignOutEverywhere = useCallback(async () => {
    try {
      await signOutAll();
    } catch (e) {
      console.log(
        'e :>> ',
        `${(e as AxiosError).code} | ${(e as AxiosError).message}`
      );

      toast({
        variant: 'destructive',
        title: tCommon('errors.error'),
        description: tCommon('errors.signOut'),
      });
    }

    showStore.setShows([]);
  }, [signOutAll, tCommon, toast]);

  if (!isSignedIn) return;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" title={tCommon('signOutOptions')}>
          <Power className="h-full w-full p-2 text-neutral-600 dark:text-neutral-300" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuItem onClick={handleSignOut as () => void}>
          <span>{tCommon('signOut')}</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleSignOutEverywhere as () => void}>
          <span>{tCommon('signOutEverywhere')}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default function DefaultLayout({ className, children }: Props) {
  const { t: tCommon } = useTranslation('common');

  return (
    <>
      <header className="w-full max-w-full sticky top-0 flex flex-row justify-between items-center px-[max(calc((100%-75rem)/2),0.25rem)] py-1 bg-neutral-50 dark:bg-neutral-900/50 border-b-2 border-neutral-200/50 dark:border-neutral-800/50">
        <Button variant="link" className="h-auto px-1 py-1" asChild>
          <Link to="/" className="uppercase font-mono text-sm font-bold">
            {tCommon('title')}
          </Link>
        </Button>
        <aside className="flex flex-row items-center">
          <ThemeSwitch />
          <Actions />
        </aside>
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
