import SlippiGame, { GameMode } from "@slippi/slippi-js";
import {EXTERNALCHARACTERS, STAGES } from "../libs/constants"

export async function readFileAsSlippiGame(file) {
  const data = (await readFileAsArrayBuffer(file));
  const arr = new Int8Array(data);
  const buf = Buffer.from(arr);
  return new SlippiGame(buf);
}

export async function readFileAsArrayBuffer(file) {
  return new Promise((resolve, reject) => {
    const fr = new FileReader();
    fr.onabort = () => reject("file reading was aborted");
    fr.onerror = () => reject("file reading has failed");
    if (fr.readAsBinaryString) {
      fr.addEventListener(
        "load",
        function () {
          const string = this.resultString != null ? this.resultString : this.result;
          const result = new Uint8Array(string.length);
          for (let i = 0; i < string.length; i++) {
            result[i] = string.charCodeAt(i);
          }
          resolve(result.buffer);
        },
        false
      );
      fr.readAsBinaryString(file);
    } else {
      fr.addEventListener(
        "load",
        function () {
          if (this.result) {
            resolve(this.result);
          } else {
            reject("no data read");
          }
        },
        false
      );
      fr.readAsArrayBuffer(file);
    }
  });
}

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
