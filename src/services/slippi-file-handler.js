import { GameMode } from "@slippi/slippi-js";
import {EXTERNALCHARACTERS, STAGES } from "../libs/constants";
import {readFileAsSlippiGame} from "./node-utils";


export async function enrichGameFile(file) {
  let enrichedGameFile;
  const game = await readFileAsSlippiGame(file);
  const gameFile = file.name;
  const stage = getMapName(game.getSettings().stageId);
  if (stage) {
    const meta = game.getMetadata();
    const settings = game.getSettings();
    let playerCharacterPairs;
    if (meta.players) {
      if (settings.gameMode === GameMode.VS) {
        let playerA;
        let playerB;
        let characterSlotA;
        let characterSlotB;
        if (meta.players[0]) {
          playerA = 'PORT1';
          characterSlotA = 0;
          if (meta.players[1]) {
            playerB = 'PORT2';
            characterSlotB = 1;
          } else if (meta.players[2]) {
            playerB = 'PORT3';
            characterSlotB = 2;
          } else if (meta.players[3]) {
            playerB = 'PORT4';
            characterSlotB = 3;
          }
        } else if (meta.players[1]) {
          playerA = 'PORT2';
          characterSlotA = 1;
          if (meta.players[2]) {
            playerB = 'PORT3';
            characterSlotB = 2;
          } else if (meta.players[3]) {
            playerB = 'PORT4';
            characterSlotB = 3;
          }
        } else {
          playerA = 'PORT3';
          characterSlotA = 2;
          playerB = 'PORT4';
          characterSlotB = 3;
        }
        playerCharacterPairs = [
          {
            player: playerA,
            character: getFullChar(Object.keys(meta.players[characterSlotA].characters)[0])
          },
          {
            player: playerB,
            character: getFullChar(Object.keys(meta.players[characterSlotB].characters)[0])
          }
        ];
      } else {
        playerCharacterPairs = [
          {
            // @ts-ignore
            player: meta.players[0].names.code,
            character: getFullChar(Object.keys(meta.players[0].characters)[0])
          },
          {
            // @ts-ignore
            player: meta.players[1].names.code,
            character: getFullChar(Object.keys(meta.players[1].characters)[0])
          }
        ];
      }

      enrichedGameFile = {
        fileObject: file,
        file: gameFile,
        playerCharacterPairs: playerCharacterPairs,
        stage: stage
      };
    }
    console.log('File enriching done');
    return enrichedGameFile;
  }
  console.log('File skipped');
  return undefined;

}

function getMapName(id) {
  const stage = STAGES.find(stage => stage.id === +id);
  if (stage) {
      return stage.name;
  }
  return undefined;
}

function getFullChar(id) {
  return EXTERNALCHARACTERS.find(char => char.id === +id);
}
