import axios from 'axios';
import { observer } from 'mobx-react-lite';
import { useCallback } from 'react';
import { ItemInterface, ReactSortable, SortableEvent } from 'react-sortablejs';
import showStore from '../../../../store/show';
import ShowItem from '../ShowItem';

const ShowList = observer(function () {
  const handleDragEnd = useCallback((evt: SortableEvent) => {
    const tmpShow = {
      ...showStore.shows[evt.newIndex!],
      order: showStore.shows[evt.oldIndex!].order,
    };
    showStore.updateShowByIndex(evt.newIndex!, {
      ...showStore.shows[evt.oldIndex!],
      order: showStore.shows[evt.newIndex!].order,
    });
    showStore.updateShowByIndex(evt.oldIndex!, tmpShow);

    axios.patch(
      `${import.meta.env.VITE_APP_API_URL}shows/${
        showStore.shows[evt.oldIndex!].id
      }`,
      { order: showStore.shows[evt.oldIndex!].order }
    );
    axios.patch(
      `${import.meta.env.VITE_APP_API_URL}shows/${
        showStore.shows[evt.newIndex!].id
      }`,
      { order: showStore.shows[evt.newIndex!].order }
    );
  }, []);

  return (
    <ReactSortable
      list={showStore.shows as Array<ItemInterface>}
      setList={() => undefined}
      onEnd={handleDragEnd}
      className="flex flex-col gap-2"
    >
      {showStore.shows.map((show) => (
        <ShowItem key={show.id} show={show} />
      ))}
    </ReactSortable>
  );
});

export default ShowList;
