import axios from 'axios';
import Cookies from 'js-cookie';
import { useCallback, useEffect, useState } from 'react';
import { ItemInterface, ReactSortable } from 'react-sortablejs';
import showStore, { IShow } from '../../../../store/show';
import ShowItem from '../ShowItem';

interface Props {
  shows: IShow[];
}

function ShowList({ shows }: Props) {
  const [showsCopy, setShowsCopy] = useState([...shows]);

  useEffect(() => {
    setShowsCopy(shows);
  }, [shows]);

  const handleSort = useCallback((newList: Array<ItemInterface>) => {
    if (newList.length > 0) {
      const reOrderedList = (newList as Array<IShow>).map((show, i) => {
        const order = i + 1;

        axios.patch(
          `${import.meta.env.VITE_APP_API_URL}shows/${show.id}`,
          {
            order,
          },
          {
            headers: {
              Authorization: `Bearer ${Cookies.get('auth-access-token')}`,
            },
          }
        );

        return {
          ...show,
          order,
        };
      });

      showStore.setShows(reOrderedList);

      setShowsCopy(reOrderedList as Array<IShow>);
    }
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <ReactSortable
        list={showsCopy as Array<ItemInterface>}
        setList={handleSort}
        style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}
      >
        {showsCopy.map((show) => (
          <ShowItem key={show.id} show={show} />
        ))}
      </ReactSortable>
      <ShowItem show={{ order: -1, title: '', url: '' }} />
    </div>
  );
}

export default ShowList;
