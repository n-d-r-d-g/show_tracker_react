import axios from 'axios';
import { useCallback, useEffect, useRef } from 'react';
import showStore, { IShow } from '../../../../store/show';
import { DEBOUNCE_TIMEOUT_IN_MS } from '../../../../constants';

interface Props {
  show: IShow;
}

function ShowItem({ show }: Props) {
  const timeoutRef = useRef<number>();

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

  return (
    <div className="flex flex-row items-center gap-2">
      <img
        src={show.imgUrl ?? './logo192.png'}
        alt={`${show.title} cover`}
        width="24px"
        height="24px"
      />
      <input
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
      <input
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
      <div>
        <small>S: </small>
        <input
          name="season"
          type="number"
          defaultValue={show.season}
          min={0}
          max={99}
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
      <div>
        <small>E: </small>
        <input
          name="episode"
          type="number"
          defaultValue={show.episode}
          min={0}
          max={99}
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
      <a href={sanitizedURL()} target="_blank" rel="noreferrer">
        Watch now
      </a>
      <button
        type="button"
        onClick={() => {
          axios.delete(`${import.meta.env.VITE_APP_API_URL}shows/${show.id}`);

          showStore.deleteShow(show.id!);
        }}
      >
        Delete
      </button>
    </div>
  );
}

export default ShowItem;
