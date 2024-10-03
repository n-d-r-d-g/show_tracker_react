import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import axios from 'axios';
import { FolderOutput, FolderSymlink, Play, Trash } from 'lucide-react';
import { useCallback, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { DEBOUNCE_TIMEOUT_IN_MS } from '../../../../constants';
import showStore, { IShow } from '../../../../store/show';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface Props {
  show: IShow;
}

function ShowItem({ show }: Props) {
  const { t: tShows } = useTranslation('shows');
  const { t: tCommon } = useTranslation('common');
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    return () => clearTimeout(timeoutRef.current);
  }, []);

  const sanitizedURL = useCallback(() => {
    let sanitizedShowURL = show.url ?? '';

    sanitizedShowURL = sanitizedShowURL.replaceAll(
      '{season}',
      String(show.season)
    );
    sanitizedShowURL = sanitizedShowURL.replaceAll(
      '{episode}',
      String(show.episode)
    );

    return sanitizedShowURL;
  }, [show.episode, show.season, show.url]);

  const deleteShow = useCallback(() => {
    axios.delete(`${import.meta.env.VITE_APP_API_URL}shows/${show.id}`);

    showStore.deleteShow(show.id!);
  }, [show.id]);

  return (
    <div className="relative flex flex-row items-center gap-2">
      <img
        src={show.imgUrl ?? './logo192.png'}
        alt={`${show.title} cover`}
        width="24px"
        height="24px"
      />
      <Input
        name="title"
        defaultValue={show.title}
        onChange={(e) => {
          clearTimeout(timeoutRef.current);

          timeoutRef.current = setTimeout(() => {
            showStore.updateShowById(show.id!, { title: e.target.value });

            axios.patch(`${import.meta.env.VITE_APP_API_URL}shows/${show.id}`, {
              name: e.target.value,
            });
          }, DEBOUNCE_TIMEOUT_IN_MS);
        }}
      />
      <Input
        name="url"
        defaultValue={show.url}
        onChange={(e) => {
          clearTimeout(timeoutRef.current);

          timeoutRef.current = setTimeout(() => {
            showStore.updateShowById(show.id!, {
              url: e.target.value,
            });

            axios.patch(`${import.meta.env.VITE_APP_API_URL}shows/${show.id}`, {
              url: e.target.value,
            });
          }, DEBOUNCE_TIMEOUT_IN_MS);
        }}
      />
      <div className="flex flex-row items-center gap-2">
        <small title={tShows('season')} aria-label={tShows('season')}>
          S:
        </small>
        <Input
          name="season"
          type="number"
          defaultValue={show.season}
          min={0}
          max={99}
          className="min-w-[4.5rem]"
          onChange={(e) => {
            clearTimeout(timeoutRef.current);

            timeoutRef.current = setTimeout(() => {
              showStore.updateShowById(show.id!, {
                season: +e.target.value,
              });

              axios.patch(
                `${import.meta.env.VITE_APP_API_URL}shows/${show.id}`,
                {
                  season: +e.target.value,
                }
              );
            }, DEBOUNCE_TIMEOUT_IN_MS);
          }}
        />
      </div>
      <div className="flex flex-row items-center gap-2">
        <small title={tShows('episode')} aria-label={tShows('episode')}>
          E:
        </small>
        <Input
          name="episode"
          type="number"
          defaultValue={show.episode}
          min={0}
          max={99}
          className="min-w-[4.5rem]"
          onChange={(e) => {
            clearTimeout(timeoutRef.current);

            timeoutRef.current = setTimeout(() => {
              showStore.updateShowById(show.id!, {
                episode: +e.target.value,
              });

              axios.patch(
                `${import.meta.env.VITE_APP_API_URL}shows/${show.id}`,
                {
                  episode: +e.target.value,
                }
              );
            }, DEBOUNCE_TIMEOUT_IN_MS);
          }}
        />
      </div>
      <Button size="icon" variant="ghost" className="min-w-9 min-h-9" asChild>
        <a
          href={sanitizedURL()}
          target="_blank"
          rel="noreferrer"
          title={tShows('watchNow')}
          aria-label={tShows('watchNow')}
        >
          <Play className="w-4 h-4 text-green-800 dark:text-green-400" />
        </a>
      </Button>
      <Button
        type="button"
        title={show.isArchived ? tShows('unarchive') : tShows('archive')}
        aria-label={show.isArchived ? tShows('unarchive') : tShows('archive')}
        variant="ghost"
        className="min-w-9 min-h-9 p-0"
        onClick={() => {
          const newIsArchived = !show.isArchived;
          showStore.updateShowById(show.id!, { isArchived: newIsArchived });

          axios.patch(
            `${import.meta.env.VITE_APP_API_URL}shows/${show.id}/${
              newIsArchived ? 'archive' : 'unarchive'
            }`
          );
        }}
      >
        {show.isArchived ? (
          <FolderOutput className="w-4 h-4 text-yellow-900 dark:text-yellow-300" />
        ) : (
          <FolderSymlink className="w-4 h-4 text-yellow-900 dark:text-yellow-300" />
        )}
      </Button>
      <AlertDialog>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {tShows('deleteConfirmation', { show: show.title })}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {tShows('deleteDescription')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{tCommon('cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={deleteShow}>
              {tCommon('delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
        <AlertDialogTrigger asChild>
          <Button
            type="button"
            title={tCommon('delete')}
            aria-label={tCommon('delete')}
            variant="ghost"
            className="min-w-9 min-h-9 p-0"
          >
            <Trash className="w-4 h-4 text-red-800 dark:text-red-300" />
          </Button>
        </AlertDialogTrigger>
      </AlertDialog>
      {show.isArchived && (
        <div className="absolute w-full h-[2px] top-1/2 left-0 -translate-y-1/2 bg-gray-500 pointer-events-none"></div>
      )}
    </div>
  );
}

export default ShowItem;
