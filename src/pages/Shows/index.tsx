import DefaultLayout from '@/layouts/DefaultLayout';
import axios from 'axios';
import Cookies from 'js-cookie';
import { observer } from 'mobx-react-lite';
import { FormEvent, useCallback, useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { IApiShow } from '../../@types/auth';
import { useAuth } from '../../hooks/useAuth';
import showStore, { IShow } from '../../store/show';
import ShowList from './components/ShowList';

const Shows = observer(function () {
  const { user } = useAuth();
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
        <h1 className="text-xl md:text-2xl text-center font-bold">
          Welcome {user.username}
        </h1>
      )}
      <form
        onSubmit={handleAddShow}
        className="flex flex-row justify-center items-center gap-2"
      >
        <input
          name="title"
          placeholder="Title"
          value={show.title}
          onChange={(e) =>
            setShow((prev) => ({ ...prev, title: e.target.value }))
          }
        />
        <input
          name="url"
          placeholder="Url"
          value={show.url}
          onChange={(e) =>
            setShow((prev) => ({ ...prev, url: e.target.value }))
          }
        />
        <input
          name="season"
          type="number"
          placeholder="Season"
          defaultValue={show.season}
          min={0}
          max={99}
          onChange={(e) =>
            setShow((prev) => ({ ...prev, season: +e.target.value }))
          }
        />
        <input
          name="episode"
          type="number"
          placeholder="Episode"
          defaultValue={show.episode}
          min={0}
          max={99}
          onChange={(e) =>
            setShow((prev) => ({ ...prev, episode: +e.target.value }))
          }
        />
        <button type="submit">Add show</button>
      </form>
      <ShowList />
    </DefaultLayout>
  );
});

export default Shows;
