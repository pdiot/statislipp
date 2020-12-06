import { Subject } from 'rxjs';

class Store {

  internalData = {
    enrichedGameFiles: []
  };

  data = new Subject();

  setGames(games) {
    let data = {
      enrichedGameFiles: games
    }
    this.internalData = data;
    this.data.next(this.internalData);
  }

  setStats(stats) {
    this.internalData = {
      ...this.internalData,
      stats: stats
    };
    this.data.next(this.internalData);
  }

  getStore() {
    return this.data;
  } 
 }

 export let store = new Store();