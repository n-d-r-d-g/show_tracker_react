import { useEffect, useState } from 'react';
import { ItemInterface, ReactSortable } from 'react-sortablejs';
import { IShow } from '../../../../store/show';
import ShowItem from '../ShowItem';

interface Props {
  shows: IShow[];
}

function ShowList({ shows }: Props) {
  const [showsCopy, setShowsCopy] = useState([...shows]);

  useEffect(() => {
    setShowsCopy(shows);
  }, [shows]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <ReactSortable
        list={showsCopy as ItemInterface[]}
        setList={(newList) => setShowsCopy(newList as IShow[])}
        style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}
      >
        {showsCopy.map((show) => (
          <ShowItem key={show.id} show={show} />
        ))}
      </ReactSortable>
      <ShowItem show={{ title: '', url: '' }} />
    </div>
  );
}

export default ShowList;
