import axios from 'axios';
import Cookies from 'js-cookie';
import { useCallback } from 'react';
import showStore, { IShow } from '../../../../store/show';

interface Props {
  show: IShow;
}

function ShowItem({ show }: Props) {
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

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: '0.5rem',
        opacity: show.id ? 1 : 0.5,
      }}
    >
      <img
        src={show.imgUrl || './logo192.png'}
        alt={`${show.title} cover`}
        width="24px"
        height="24px"
      />
      <input
        name="title"
        defaultValue={show.title}
        onBlur={(e) =>
          axios.patch(
            `${process.env.REACT_APP_API_URL}shows/${show.id}`,
            {
              name: e.target.value,
            },
            {
              headers: {
                Authorization: `Bearer ${Cookies.get('auth-access-token')}`,
              },
            }
          )
        }
      />
      <input
        name="url"
        defaultValue={show.url}
        onBlur={(e) =>
          axios.patch(
            `${process.env.REACT_APP_API_URL}shows/${show.id}`,
            {
              url: e.target.value,
            },
            {
              headers: {
                Authorization: `Bearer ${Cookies.get('auth-access-token')}`,
              },
            }
          )
        }
      />
      <div>
        <small>S: </small>
        <input
          name="season"
          type="number"
          defaultValue={show.season}
          min={0}
          max={99}
          onBlur={(e) =>
            axios.patch(
              `${process.env.REACT_APP_API_URL}shows/${show.id}`,
              {
                season: +e.target.value,
              },
              {
                headers: {
                  Authorization: `Bearer ${Cookies.get('auth-access-token')}`,
                },
              }
            )
          }
        />
      </div>
      <div>
        <small>E: </small>
        <input
          name="episode"
          type="number"
          defaultValue={show.episode}
          min={0}
          max={99}
          onBlur={(e) =>
            axios.patch(
              `${process.env.REACT_APP_API_URL}shows/${show.id}`,
              {
                episode: +e.target.value,
              },
              {
                headers: {
                  Authorization: `Bearer ${Cookies.get('auth-access-token')}`,
                },
              }
            )
          }
        />
      </div>
      <a href={sanitizedURL()} target="_blank" rel="noreferrer">
        Watch now
      </a>
      <button
        onClick={() => {
          axios.delete(`${process.env.REACT_APP_API_URL}shows/${show.id}`, {
            headers: {
              Authorization: `Bearer ${Cookies.get('auth-access-token')}`,
            },
          });
          showStore.deleteShow(show.id!);
        }}
      >
        Delete
      </button>
    </div>
  );
}

export default ShowItem;
