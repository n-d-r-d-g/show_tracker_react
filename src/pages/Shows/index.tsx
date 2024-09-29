import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import DefaultLayout from '@/layouts/DefaultLayout';
import axios from 'axios';
import Cookies from 'js-cookie';
import { Plus } from 'lucide-react';
import { observer } from 'mobx-react-lite';
import { FormEvent, useCallback, useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { IApiShow } from '../../@types/auth';
import { useAuth } from '../../hooks/useAuth';
import showStore, { IShow } from '../../store/show';
import ShowList from './components/ShowList';
import { useTranslation } from 'react-i18next';

const Shows = observer(function () {
  const { user } = useAuth();
  const { t: tShows } = useTranslation('shows');
  const [show, setShow] = useState<IShow>({
    order: -1,
    title: '',
    url: '',
    season: 1,
    episode: 1,
  });

  useEffect(() => {
    const accessToken = Cookies.get(
      import.meta.env.VITE_ACCESS_TOKEN_COOKIE as string
    );

    if (!accessToken) return;

    axios.get(`${import.meta.env.VITE_APP_API_URL}shows`).then((r) => {
      const newShows = (r.data as Array<IApiShow>).map((show) => ({
        id: show.id,
        order: show.order,
        title: show.name,
        url: show.url,
        imgUrl: show.image,
        season: show.season,
        episode: show.episode,
        isArchived: !!show.archived_at,
      })) as Array<IShow>;

      showStore.setShows(newShows);
    });
  }, []);

  const handleAddShow = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      const showId = uuidv4();
      const showOrder =
        (showStore.shows[showStore.shows.length - 1]?.order ?? 0) + 1;

      showStore.addShow({
        ...show,
        id: showId,
        order: showOrder,
      });

      axios.post(`${import.meta.env.VITE_APP_API_URL}shows`, {
        id: showId,
        name: show.title,
        url: show.url,
        season: show.season,
        episode: show.episode,
        image: show.imgUrl,
      } as IApiShow);

      setShow({
        id: '',
        order: -1,
        title: '',
        url: '',
        season: 1,
        episode: 1,
      });
    },
    [show]
  );

  return (
    <DefaultLayout className="place-content-start">
      {user?.username && (
        <h1 className="mb-8 text-xl md:text-2xl text-center font-bold">
          {tShows('welcome')} {user.username}
        </h1>
      )}
      <ShowList />
      <form
        onSubmit={handleAddShow}
        className="flex flex-row justify-center items-center gap-2 mt-6"
      >
        <Input
          name="title"
          placeholder={tShows('title')}
          value={show.title}
          onChange={(e) =>
            setShow((prev) => ({ ...prev, title: e.target.value }))
          }
        />
        <Input
          name="url"
          placeholder={tShows('url')}
          value={show.url}
          onChange={(e) =>
            setShow((prev) => ({ ...prev, url: e.target.value }))
          }
        />
        <Input
          name="season"
          type="number"
          placeholder={tShows('season')}
          defaultValue={show.season}
          min={0}
          max={99}
          onChange={(e) =>
            setShow((prev) => ({ ...prev, season: +e.target.value }))
          }
        />
        <Input
          name="episode"
          type="number"
          placeholder={tShows('episode')}
          defaultValue={show.episode}
          min={0}
          max={99}
          onChange={(e) =>
            setShow((prev) => ({ ...prev, episode: +e.target.value }))
          }
        />
        <Button
          type="submit"
          variant="ghost"
          className="text-green-800 dark:text-green-400 hover:text-white dark:hover:text-black hover:bg-green-800 dark:hover:bg-green-400 hover:border-green-800 dark:hover:border-green-400 focus-visible:text-white dark:focus-visible:text-black focus-visible:bg-green-800 dark:focus-visible:bg-green-400 focus-visible:border-green-800 dark:focus-visible:border-green-400 motion-safe:transition-all"
        >
          <Plus className="mr-2 min-h-4 min-w-4" />
          {tShows('addShow')}
        </Button>
      </form>
    </DefaultLayout>
  );
});

export default Shows;
