import { makeAutoObservable } from 'mobx';

export interface IShow {
  id: string;
  title: string;
  url: string;
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
    this.shows.splice(index, 1);
  }
}

const showStore = new ShowStore();

export default showStore;
