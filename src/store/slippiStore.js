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

  setProgress(current, total) {
    console.log('Set progress called in store', this.internalData);
    let data = {
      key: 'STATS_PROGRESS',
      current,
      total
    }
    this.internalData = data;
    console.log('internalData :', this.internalData);
    this.data.next(this.internalData);
  }

  setStats(stats) {
    console.log('Set Stats called in store');
    let data = {
      key: 'STATS_DONE',
      stats
    }
    this.internalData = data;
    console.log('internalData :', this.internalData);
    this.data.next(this.internalData);
  }

  getStore() {
    return this.data;
  } 
 }

 export let store = new Store();