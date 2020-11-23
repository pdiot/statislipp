import { Subject } from 'rxjs';

class Store {

  internalData = {
    enrichedGameFiles: []
  };

  data = new Subject();

  setGames(games) {
    this.internalData.enrichedGameFiles = games
    this.data.next(this.internalData);
  }

  getStore() {
    return this.data;
  } 
 }

 export let store = new Store();