import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import showStore from '../../store/show';
import logo from '../../logo.svg';

function Home() {
  const { t } = useTranslation(['common', 'home']);
  const [show, setShow] = useState({
    id: '',
    title: '',
    url: '',
  });
  const [index, setIndex] = useState('');

  return (
    <header className="App-header">
      <h1>{t('home:title')}</h1>
      <img src={logo} className="App-logo" alt="logo" />
      <p>
        Edit <code>src/App.tsx</code> and save to reload.
      </p>
      <a
        className="App-link"
        href="https://reactjs.org"
        target="_blank"
        rel="noopener noreferrer"
      >
        Learn React
      </a>
      <Link to="/about">Go to about</Link>
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
      <pre style={{ textAlign: 'left' }}>
        {JSON.stringify(showStore.shows, null, 2)}
      </pre>
    </header>
  );
}

export default observer(Home);
