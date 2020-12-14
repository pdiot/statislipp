<template>
  <div id="stats-display">
    <div class="top-block">
      <div class="left">
        <PlayerDisplayBlock :playerId="playerId()" :characters="[playerCharacter()]" :side="'left'" v-on:save-stats="saveStats()" />
      </div>
      <div class="middle">
        <StatsMainBlock :stats="processedStats" :currentCharacter="opponentActiveCharacter" :currentStage="activeStage" />
      </div>
      <div class="right">
        <PlayerDisplayBlock
          :playerId="'Change character'"
          :characters="opponentCharacters()"
          :canChange="true"
          :side="'right'"
          v-on:character-change="changeCharacter()"
          v-on:back="back()"
        />
      </div>
      <div class="modale" v-if="characterModale">
        <div class="characterModale">
          <div v-for="character of opponentCharacters()" class="characterPicture" :key="character.shortName" v-on:click="saveCharacter(character)">
            <img :src="getOpponentCharacterImageUrl(character)" />
          </div>
        </div>
      </div>
    </div>
    <div class="bottom-block">
      <div class="bottom">
        <StageDisplayBlock :stages="stages()" v-on:stage-change="setStage($event)" />
      </div>
    </div>
  </div>
</template>

<script>
import PlayerDisplayBlock from "./PlayerDisplayBlock";
import StageDisplayBlock from "./StageDisplayBlock";
import StatsMainBlock from "./StatsMainBlock";
import { getCharacterVersus } from "../../services/icons.service";
import {
  processWinrates,
  processWavedashes,
  processConversions,
  processOverallList,
  processPunishedActions,
  processLCancels,
  processLedgeDashes,
  processJCGrabs,
} from "../../services/stats-processing";

export default {
  name: "StatsDisplay",
  components: {
    PlayerDisplayBlock,
    StatsMainBlock,
    StageDisplayBlock,
  },
  props: {
    list: Array,
    stats: Object,
    filter: Object,
  },
  data() {
    return {
      opponentActiveCharacter: undefined,
      activeStage: undefined,
      characterModale: false,
      playerConversions: undefined,
      opponentConversions: undefined,
      playerOverall: undefined,
      opponentOverall: undefined,
      punishedActionsForPlayer: undefined,
      punishedActionsForOpponent: undefined,
      lcancelsForPlayer: undefined,
      lcancelsForOpponent: undefined,
      ledgeDashesForPlayer: undefined,
      ledgeDashesForOpponent: undefined,
      playerWavedashes: undefined,
      opponentWavedashes: undefined,
      playerJCGrabs: undefined,
      opponentJCGrabs: undefined,
      gameResults: undefined,
      statsDates: undefined,
    };
  },
  computed: {
    processedStats: function () {
      return {
        playerConversions: this.playerConversions,
        opponentConversions: this.opponentConversions,
        playerOverall: this.playerOverall,
        opponentOverall: this.opponentOverall,
        punishedActionsForPlayer: this.punishedActionsForPlayer,
        punishedActionsForOpponent: this.punishedActionsForOpponent,
        lcancelsForPlayer: this.lcancelsForPlayer,
        lcancelsForOpponent: this.lcancelsForOpponent,
        ledgeDashesForPlayer: this.ledgeDashesForPlayer,
        ledgeDashesForOpponent: this.ledgeDashesForOpponent,
        playerWavedashes: this.playerWavedashes,
        opponentWavedashes: this.opponentWavedashes,
        playerJCGrabs: this.playerJCGrabs,
        opponentJCGrabs: this.opponentJCGrabs,
        gameResults: this.gameResults,
      };
    },
  },
  watch: {
    list: {
      handler: function () {
        if (this.playerOverall) {
          // We already have calculated stuff once, so this should only trigger if we're updating the games
          this.getProcessedStats();
        }
      },
      immediate: true,
      deep: true,
    },
    stats: {
      handler: function () {
        this.getProcessedStats();
      },
      immediate: true,
    },
  },
  methods: {
    playerId: function () {
      return this.filter.playerId;
    },
    setStage: function (stage) {
      this.activeStage = stage.stage;
    },
    playerCharacter: function () {
      return { shortName: this.filter.playerCharacter, active: true };
    },
    changeCharacter: function () {
      this.characterModale = true;
    },
    saveCharacter: function (character) {
      if (this.opponentActiveCharacter !== character.shortName) {
        this.opponentActiveCharacter = character.shortName;
      }
      this.characterModale = false;
    },
    getOpponentCharacterImageUrl: function (character) {
      const path = getCharacterVersus(character.shortName, "right");
      return require(`@/${path}`);
    },
    opponentCharacters: function () {
      let chars = [];
      for (let game of this.list) {
        for (let pcp of game.playerCharacterPairs.filter((pc) => pc.player !== this.playerId())) {
          let found = chars.find((char) => char.shortName === pcp.character.shortName);
          if (!found) {
            chars.push({
              shortName: pcp.character.shortName,
              active: pcp.character.shortName === this.opponentActiveCharacter ? true : false,
            });
          }
        }
      }
      return chars;
    },
    stages: function () {
      let stages = [];
      if (this.opponentActiveCharacter) {
        for (let game of this.list) {
          if (game.playerCharacterPairs.find((pcp) => pcp.player !== this.playerId() && pcp.character.shortName === this.opponentActiveCharacter)) {
            let found = stages.find((s) => s.stage === game.stage);
            if (!found) {
              stages.push({
                stage: game.stage,
                active: game.stage === this.activeStage ? true : false,
              });
            }
          }
        }
        stages.push({
          stage: "allStages",
          active: "allStages" === this.activeStage ? true : false,
        });
      }
      return stages;
    },
    back: function () {
      this.$emit("back", true);
    },
    niceName: function (gameFile) {
      return gameFile.substring(gameFile.length - 19, gameFile.length - 4);
    },
    filterStats: function () {
      const niceNamesToKeep = [];
      for (let game of this.list) {
        if (!game.forcedOut) {
          niceNamesToKeep.push(this.niceName(game.file));
        }
      }
      const newStats = {
        playerCharName: this.stats.playerCharName,
        playerConversions: undefined,
        opponentConversions: undefined,
        gameResults: undefined,
        playerOveralls: undefined,
        opponentOveralls: undefined,
        punishedActionsForOpponent: undefined,
        punishedActionsForPlayer: undefined,
        lcancelsForPlayer: undefined,
        lcancelsForOpponent: undefined,
        ledgeDashesForPlayer: undefined,
        ledgeDashesForOpponent: undefined,
        playerWavedashes: undefined,
        opponentWavedashes: undefined,
        playerJCGrabs: undefined,
        opponentJCGrabs: undefined,
      };
      for (let game of Object.keys(this.stats.conversionsOnOpponent)) {
        if (niceNamesToKeep.includes(game)) {
          if (!newStats.playerConversions) {
            newStats.playerConversions = {};
          }
          newStats.playerConversions[game] = this.stats.conversionsOnOpponent[game];
        }
      }
      for (let game of Object.keys(this.stats.conversionsFromOpponent)) {
        if (niceNamesToKeep.includes(game)) {
          if (!newStats.opponentConversions) {
            newStats.opponentConversions = {};
          }
          newStats.opponentConversions[game] = this.stats.conversionsFromOpponent[game];
        }
      }
      for (let game of Object.keys(this.stats.wavedashesForPlayer)) {
        if (niceNamesToKeep.includes(game)) {
          if (!newStats.playerWavedashes) {
            newStats.playerWavedashes = {};
          }
          newStats.playerWavedashes[game] = this.stats.wavedashesForPlayer[game];
        }
      }
      for (let game of Object.keys(this.stats.wavedashesForOpponent)) {
        if (niceNamesToKeep.includes(game)) {
          if (!newStats.opponentWavedashes) {
            newStats.opponentWavedashes = {};
          }
          newStats.opponentWavedashes[game] = this.stats.wavedashesForOpponent[game];
        }
      }
      for (let game of Object.keys(this.stats.jcGrabsForPlayer)) {
        if (niceNamesToKeep.includes(game)) {
          if (!newStats.playerJCGrabs) {
            newStats.playerJCGrabs = {};
          }
          newStats.playerJCGrabs[game] = this.stats.jcGrabsForPlayer[game];
        }
      }
      for (let game of Object.keys(this.stats.jcGrabsForOpponent)) {
        if (niceNamesToKeep.includes(game)) {
          if (!newStats.opponentJCGrabs) {
            newStats.opponentJCGrabs = {};
          }
          newStats.opponentJCGrabs[game] = this.stats.jcGrabsForOpponent[game];
        }
      }
      for (let game of Object.keys(this.stats.overallOnOpponent)) {
        if (niceNamesToKeep.includes(game)) {
          if (!newStats.playerOveralls) {
            newStats.playerOveralls = {};
          }
          newStats.playerOveralls[game] = this.stats.overallOnOpponent[game];
        }
      }
      for (let game of Object.keys(this.stats.overallFromOpponent)) {
        if (niceNamesToKeep.includes(game)) {
          if (!newStats.opponentOveralls) {
            newStats.opponentOveralls = {};
          }
          newStats.opponentOveralls[game] = this.stats.overallFromOpponent[game];
        }
      }
      for (let game of Object.keys(this.stats.lcancelsForOpponent)) {
        if (niceNamesToKeep.includes(game)) {
          if (!newStats.lcancelsForOpponent) {
            newStats.lcancelsForOpponent = {};
          }
          newStats.lcancelsForOpponent[game] = this.stats.lcancelsForOpponent[game];
        }
      }
      for (let game of Object.keys(this.stats.lcancelsForPlayer)) {
        if (niceNamesToKeep.includes(game)) {
          if (!newStats.lcancelsForPlayer) {
            newStats.lcancelsForPlayer = {};
          }
          newStats.lcancelsForPlayer[game] = this.stats.lcancelsForPlayer[game];
        }
      }
      for (let game of Object.keys(this.stats.punishedActionsForOpponent)) {
        if (niceNamesToKeep.includes(game)) {
          if (!newStats.punishedActionsForOpponent) {
            newStats.punishedActionsForOpponent = {};
          }
          newStats.punishedActionsForOpponent[game] = this.stats.punishedActionsForOpponent[game];
        }
      }
      for (let game of Object.keys(this.stats.punishedActionsForPlayer)) {
        if (niceNamesToKeep.includes(game)) {
          if (!newStats.punishedActionsForPlayer) {
            newStats.punishedActionsForPlayer = {};
          }
          newStats.punishedActionsForPlayer[game] = this.stats.punishedActionsForPlayer[game];
        }
      }
      for (let game of Object.keys(this.stats.ledgeDashesForPlayer)) {
        if (niceNamesToKeep.includes(game)) {
          if (!newStats.ledgeDashesForPlayer) {
            newStats.ledgeDashesForPlayer = {};
          }
          newStats.ledgeDashesForPlayer[game] = this.stats.ledgeDashesForPlayer[game];
        }
      }
      for (let game of Object.keys(this.stats.ledgeDashesForOpponent)) {
        if (niceNamesToKeep.includes(game)) {
          if (!newStats.ledgeDashesForOpponent) {
            newStats.ledgeDashesForOpponent = {};
          }
          newStats.ledgeDashesForOpponent[game] = this.stats.ledgeDashesForOpponent[game];
        }
      }
      for (let game of Object.keys(this.stats.gameResults)) {
        if (niceNamesToKeep.includes(game)) {
          if (!newStats.gameResults) {
            newStats.gameResults = {};
          }
          newStats.gameResults[game] = this.stats.gameResults[game];
        }
      }
      return newStats;
    },
    getStatsDates: function () {
      let dates = [];
      for (let gameTag of Object.keys(this.stats.overallOnOpponent)) {
        const year = +gameTag.substr(0, 4);
        const month = +gameTag.substr(4, 2);
        const day = +gameTag.substr(6, 2);
        const date = new Date(year, month, day);
        if (!dates.find((dateFromArray) => date.getTime() === dateFromArray.getTime())) {
          dates.push(date);
        }
      }
      return dates;
    },
    getProcessedStats: function () {
      // TODO filter this.stats by selectedGames
      const newStats = this.filterStats();
      this.statsDates = this.getStatsDates();
      if (newStats.gameResults) {
        processWinrates(newStats.gameResults).then((result) => {
          console.log("Stats Display - got player winrates back", result);
          this.gameResults = result;
        });
      }
      if (newStats.playerWavedashes) {
        processWavedashes(newStats.playerWavedashes).then((result) => {
          console.log("Stats Display - got player wavedashes back", result);
          this.playerWavedashes = result;
        });
      }
      if (newStats.opponentWavedashes) {
        processWavedashes(newStats.opponentWavedashes).then((result) => {
          console.log("Stats Display - got opponent wavedashes back", result);
          this.opponentWavedashes = result;
        });
      }
      if (newStats.playerJCGrabs) {
        processJCGrabs(newStats.playerJCGrabs).then((result) => {
          console.log("Stats Display - got player jcGrabs back", result);
          this.playerJCGrabs = result;
        });
      }
      if (newStats.opponentJCGrabs) {
        processJCGrabs(newStats.opponentJCGrabs).then((result) => {
          console.log("Stats Display - got opponent jcGrabs back", result);
          this.opponentJCGrabs = result;
        });
      }
      if (newStats.playerConversions) {
        processConversions(newStats.playerConversions).then((result) => {
          console.log("Stats Display - got player conversions back", result);
          this.playerConversions = result;
        });
      }
      if (newStats.opponentConversions) {
        processConversions(newStats.opponentConversions).then((result) => {
          console.log("Stats Display - got opponent conversions back", result);
          this.opponentConversions = result;
        });
      }
      if (newStats.playerOveralls) {
        processOverallList(newStats.playerOveralls).then((result) => {
          console.log("Stats Display - got player overall back", result);
          this.playerOverall = result;
          this.initCurrentCharAndStage();
        });
      }
      if (newStats.opponentOveralls) {
        processOverallList(newStats.opponentOveralls).then((result) => {
          console.log("Stats Display - got opponent overall back", result);
          this.opponentOverall = result;
        });
      }
      if (newStats.punishedActionsForPlayer) {
        processPunishedActions(newStats.punishedActionsForPlayer).then((result) => {
          console.log("Stats Display - got player punishedActions back", result);
          this.punishedActionsForPlayer = result;
        });
      }
      if (newStats.punishedActionsForOpponent) {
        processPunishedActions(newStats.punishedActionsForOpponent).then((result) => {
          console.log("Stats Display - got opponent punishedActions back", result);
          this.punishedActionsForOpponent = result;
        });
      }
      if (newStats.lcancelsForPlayer) {
        processLCancels(newStats.lcancelsForPlayer).then((result) => {
          console.log("Stats Display - got player lcancels back", result);
          this.lcancelsForPlayer = result;
        });
      }
      if (newStats.lcancelsForOpponent) {
        processLCancels(newStats.lcancelsForOpponent).then((result) => {
          console.log("Stats Display - got opponent lcancels back", result);
          this.lcancelsForOpponent = result;
        });
      }
      if (newStats.ledgeDashesForPlayer) {
        processLedgeDashes(newStats.ledgeDashesForPlayer).then((result) => {
          console.log("Stats Display - got player ledgeDashes back", result);
          this.ledgeDashesForPlayer = result;
        });
      }
      if (newStats.ledgeDashesForOpponent) {
        processLedgeDashes(newStats.ledgeDashesForOpponent).then((result) => {
          console.log("Stats Display - got opponent ledgeDashes back", result);
          this.ledgeDashesForOpponent = result;
        });
      }
    },
    initCurrentCharAndStage: function () {
      this.opponentActiveCharacter = Object.keys(this.playerOverall)[0];
      this.activeStage = "allStages";
    },
    saveStats: function () {
      const stats = {
        playerCharName: this.stats.playerCharName,
        playerConversions: this.playerConversions,
        opponentConversions: this.opponentConversions,
        playerOverall: this.playerOverall,
        opponentOverall: this.opponentOverall,
        punishedActionsForPlayer: this.punishedActionsForPlayer,
        punishedActionsForOpponent: this.punishedActionsForOpponent,
        lcancelsForPlayer: this.lcancelsForPlayer,
        lcancelsForOpponent: this.lcancelsForOpponent,
        ledgeDashesForPlayer: this.ledgeDashesForPlayer,
        ledgeDashesForOpponent: this.ledgeDashesForOpponent,
        playerWavedashes: this.playerWavedashes,
        opponentWavedashes: this.opponentWavedashes,
        playerJCGrabs: this.playerJCGrabs,
        opponentJCGrabs: this.opponentJCGrabs,
        dates: this.statsDates,
      };

      const data = this.encode(JSON.stringify(stats, null, 4));
      const blob = new Blob([data], {
        type: "application/octet-stream",
      });
      const url = URL.createObjectURL(blob);
      var link = document.createElement("a");
      link.setAttribute("href", url);
      let timeStamp = new Date();
      timeStamp = timeStamp.toISOString();
      timeStamp = timeStamp.replace("-", "");
      timeStamp = timeStamp.replace("-", "");
      timeStamp = timeStamp.replace(":", "");
      timeStamp = timeStamp.replace(":", "");
      timeStamp = timeStamp.replace(".", "");
      link.setAttribute("download", `stats_${timeStamp.valueOf()}.json`);

      var event = document.createEvent("MouseEvents");
      event.initMouseEvent("click", true, true, window, 1, 0, 0, 0, 0, false, false, false, false, 0, null);
      link.dispatchEvent(event);
    },
    encode: function (s) {
      var out = [];
      for (var i = 0; i < s.length; i++) {
        out[i] = s.charCodeAt(i);
      }
      return new Uint8Array(out);
    },
  },
};
</script>

<style scoped lang="scss">
.top-block {
  display: flex;
  flex-direction: row;

  .left {
    width: 15%;
    position: relative;

    @media (min-width: 2000px) {
      height: 65em;
    }
  }

  .right {
    width: 15%;
    position: relative;
    @media (max-width: 1999px) {
      height: 659px;
    }
  }
  .middle {
    width: 70%;
  }
}

.bottom-block {
  margin-top: 1rem;
}

.modale {
  position: absolute;
  max-width: 730px;
  bottom: 10%;
  right: 30px;
  background-color: rgba(7, 24, 24, 0.808);
  box-shadow: 0 0 6px black;

  .characterModale {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap-reverse;
    .characterPicture {
      padding: 1rem;
      img {
        width: 200px;
        height: 200px;
      }
      cursor: pointer;
    }
    .characterPicture:hover {
      background-color: rgb(40, 97, 99);
    }
  }
}
</style>
