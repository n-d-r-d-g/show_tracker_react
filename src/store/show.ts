import { makeAutoObservable } from 'mobx';

export interface IShow {
  id?: string;
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

  deleteShow(index: number) {
    this.shows = this.shows.filter((_, i) => i !== index);
  }
}

const showStore = new ShowStore();

export default showStore;
