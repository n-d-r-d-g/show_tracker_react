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
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import axios, { AxiosError } from 'axios';
import { FolderOutput, FolderSymlink, Play, Trash } from 'lucide-react';
import { FormEvent, useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DEBOUNCE_TIMEOUT_IN_MS } from '../../../../constants';
import showStore, { IShow } from '../../../../store/show';

interface Props {
  show: IShow;
}

function ShowItem({ show }: Props) {
  const { t: tShows } = useTranslation('shows');
  const { t: tCommon } = useTranslation('common');
  const { toast } = useToast();
  const [isImgUrlDialogOpen, setIsImgUrlDialogOpen] = useState(false);
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

  const handleImgUrlSubmit = useCallback(
    async (ev: FormEvent<HTMLFormElement>) => {
      ev.preventDefault();

      const imgUrl = (
        ev.currentTarget.elements.namedItem('imgUrl') as HTMLInputElement
      )?.value;
      showStore.updateShowById(show.id!, { imgUrl });

      try {
        await axios.patch(
          `${import.meta.env.VITE_APP_API_URL}shows/${show.id}`,
          {
            image: imgUrl,
          }
        );

        setIsImgUrlDialogOpen(false);

        toast({
          variant: 'default',
          title: tCommon('success.successful'),
          description: tCommon('success.save'),
        });
      } catch (e) {
        console.log(
          'e :>> ',
          `${(e as AxiosError).code} | ${(e as AxiosError).message}`
        );

        toast({
          variant: 'destructive',
          title: tCommon('errors.error'),
          description: tCommon('errors.save'),
        });
      }
    },
    [show.id, tCommon, toast]
  );

  const openImgUrlDialog = useCallback(() => setIsImgUrlDialogOpen(true), []);

  return (
    <div className="min-h-0 relative flex flex-row items-center gap-2">
      <Dialog open={isImgUrlDialogOpen}>
        <DialogTrigger onClick={openImgUrlDialog} asChild>
          <Button
            className="min-w-[24px] max-w-[24px] min-h-full p-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${show.imgUrl ?? './no-poster.jpg'})`,
            }}
            title={tShows('changeImgUrl')}
            aria-label={tShows('changeImgUrl')}
          ></Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <form onSubmit={handleImgUrlSubmit}>
            <DialogHeader>
              <DialogTitle>{tShows('changeImgUrl')}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-2 py-4">
              <Label htmlFor="imgUrl">{tShows('imgUrl')}</Label>
              <Input
                id="imgUrl"
                placeholder={tShows('imgUrl')}
                defaultValue={show.imgUrl ?? ''}
              />
            </div>
            <DialogFooter>
              <Button type="submit">{tCommon('save')}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
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
