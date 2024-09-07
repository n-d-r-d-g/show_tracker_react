import { toJS } from 'mobx';
import { observer } from 'mobx-react-lite';
import { FormEvent, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../composables/useAuth';
import showStore from '../../store/show';
import ShowList from './components/ShowList';

function Home() {
  const { t } = useTranslation(['common', 'home']);
  const { user, isSignedIn, signIn, signOut } = useAuth();
  const [show, setShow] = useState({
    id: '',
    title: '',
    url: '',
  });
  const [index, setIndex] = useState('');

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
        <button type="button" onClick={signOut} disabled={!user}>
          Logout
        </button>
      )}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          showStore.addShow(show);
          setShow({ id: '', title: '', url: '' });
        }}
      >
        <input
          placeholder="Id"
          value={show.id}
          onChange={(e) => setShow((prev) => ({ ...prev, id: e.target.value }))}
        />
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
        <button>Add show</button>
      </form>
      <input placeholder="Index" onChange={(e) => setIndex(e.target.value)} />
      <button onClick={() => showStore.deleteShow(+index)}>
        Delete show by index
      </button>
      <ShowList shows={shows()} />
    </>
  );
}

export default observer(Home);
