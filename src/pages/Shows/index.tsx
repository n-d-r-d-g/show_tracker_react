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
  const { user, signOut } = useAuth();
  const [show, setShow] = useState<IShow>({
    order: -1,
    title: '',
    url: '',
    season: 1,
    episode: 1,
  });

  useEffect(() => {
    const accessToken = Cookies.get(import.meta.env.VITE_ACCESS_TOKEN_COOKIE);

    if (!accessToken) return;

    axios.get(`${import.meta.env.VITE_APP_API_URL}shows`).then((r) => {
      const newShows: Array<IShow> = r.data.map((show: IApiShow) => ({
        id: show.id,
        order: show.order,
        title: show.name,
        url: show.url,
        imgUrl: show.image,
        season: show.season,
        episode: show.episode,
      }));

      showStore.setShows(newShows);
    });
  }, [user]);

  const handleSignOut = useCallback(() => {
    signOut();
    showStore.setShows([]);
  }, [signOut]);

  const handleAddShow = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      const showId = uuidv4();
      const showOrder = showStore.shows[showStore.shows.length - 1].order + 1;

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
    <>
      {user?.username && <h1>Welcome {user.username}</h1>}
      <button type="button" onClick={handleSignOut} disabled={!user}>
        Log out
      </button>
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
    </>
  );
});

export default Shows;
