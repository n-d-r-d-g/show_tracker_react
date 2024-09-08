import { makeAutoObservable } from 'mobx';

export interface IShow {
  id?: string;
  order: number;
  title: string;
  url: string;
  imgUrl?: string;
  season?: number;
  episode?: number;
}

class ShowStore {
  shows: IShow[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  addShow(show: IShow) {
    this.shows.push(show);
  }

  updateShowByIndex(index: number, show: Partial<IShow>) {
    this.shows[index] = {
      ...this.shows[index],
      ...show,
    };
  }

  updateShowById(id: string, show: Partial<IShow>) {
    const showIndex = this.shows.findIndex((show) => show.id === id);

    if (showIndex < 0) return;

    this.updateShowByIndex(showIndex, show);
  }

  deleteShow(id: string) {
    this.shows = this.shows.filter((show) => show.id !== id);
  }

  setShows(shows: Array<IShow>) {
    this.shows = shows;
  }
}

const showStore = new ShowStore();

export default showStore;
