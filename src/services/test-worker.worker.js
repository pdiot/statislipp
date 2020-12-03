
import { readFileAsSlippiGame } from "./node-utils";

export async function testWorker(message) {
  let games = [];
  for (const game of message.games) {
    let slippiGame = await readFileAsSlippiGame(game.fileObject);
    games.push({ game: slippiGame, gameFile: game.file, playerCharacterPairs: game.playerCharacterPairs });
  }

  console.log('in worker -- games : ', games);
  let metadatas = [];
  for (let game of games) {
    metadatas.push(game.game.getMetadata());
  }
  return metadatas;
}