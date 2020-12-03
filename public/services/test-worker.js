
import { readFileAsSlippiGame } from "../../src/services/node-utils";

self.onmessage = (message) => {
  console.log('in worker', message);
  testWorker(message).then(
    result => {
      console.log('in worker -- metas :', result);
      self.postMessage({key: 'message metas', result});     
    }
  );
}

export async function testWorker(message) {
  let games = [];
  for (const game of message.games) {
    let slippiGame = await readFileAsSlippiGame(game.fileObject);
    games.push({ game: slippiGame, gameFile: game.file, playerCharacterPairs: game.playerCharacterPairs });
  }

  console.log('in worker -- games : ', games);
  let metadatas = [];
  for (let game of games) {
    metadatas.push(game.getMetadata());
  }
  return metadatas;
}