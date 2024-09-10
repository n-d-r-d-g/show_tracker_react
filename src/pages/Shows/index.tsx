import axios from 'axios';
import Cookies from 'js-cookie';
import { toJS } from 'mobx';
import { observer } from 'mobx-react-lite';
import { FormEvent, useCallback, useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useAuth } from '../../hooks/useAuth';
import showStore, { IShow } from '../../store/show';
import { IApiShow } from '../../@types/auth';
import ShowList from './components/ShowList';

function Shows() {
  const { user, isSignedIn, signIn, signOut } = useAuth();
  const [show, setShow] = useState<IShow>({
    order: -1,
    title: '',
    url: '',
    season: 1,
    episode: 1,
  });

  useEffect(() => {
    const accessToken = Cookies.get('auth-access-token');

    if (!accessToken) return;

    axios
      .get(`${import.meta.env.VITE_APP_API_URL}shows`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((r) => {
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

  const shows = useCallback(() => toJS(showStore.shows), []);

  const handleSignInFormSubmit = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e?.preventDefault?.();
      const formTarget = e.target as HTMLFormElement;
      const username = (
        formTarget.elements.namedItem('username') as HTMLInputElement
      ).value;
      const password = (
        formTarget.elements.namedItem('password') as HTMLInputElement
      ).value;

      signIn({ username, password });
    },
    [signIn]
  );

  return (
    <>
      {isSignedIn && user?.username && <h1>Welcome {user.username}</h1>}
      {!isSignedIn && (
        <form id="signin" onSubmit={handleSignInFormSubmit}>
          <input name="username" placeholder="Username" />
          <input name="password" type="password" placeholder="Password" />
          <button type="submit">Login</button>
        </form>
      )}
      {isSignedIn && (
        <button
          type="button"
          onClick={() => {
            signOut();
            showStore.setShows([]);
          }}
          disabled={!user}
        >
          Logout
        </button>
      )}
      <form
        onSubmit={(e) => {
          e.preventDefault();

          const showId = uuidv4();
          const showOrder = showStore.shows.length;

          showStore.addShow({
            ...show,
            id: showId,
            order: showOrder,
          });

          axios.post(
            `${import.meta.env.VITE_APP_API_URL}shows`,
            {
              id: showId,
              name: show.title,
              url: show.url,
              season: show.season,
              episode: show.episode,
              image: show.imgUrl,
            } as IApiShow,
            {
              headers: {
                Authorization: `Bearer ${Cookies.get('auth-access-token')}`,
              },
            }
          );

          setShow({
            id: '',
            order: -1,
            title: '',
            url: '',
            season: 1,
            episode: 1,
          });
        }}
      >
        <input
          placeholder="Title"
          value={show.title}
          onChange={(e) =>
            setShow((prev) => ({ ...prev, title: e.target.value }))
          }
        />
        <input
          placeholder="Url"
          value={show.url}
          onChange={(e) =>
            setShow((prev) => ({ ...prev, url: e.target.value }))
          }
        />
        <button type="submit">Add show</button>
      </form>
      <ShowList shows={shows()} />
    </>
  );
}

export default observer(Shows);
