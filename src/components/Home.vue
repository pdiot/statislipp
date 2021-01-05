<template>
  <div id="home">
    <template v-if="!hasStats">
      <Overlay v-if="showOverlay" :label="'Please wait while your stats are being processed (roughly 500ms per file)'" />
      <div class="side-panel" v-if="hasGames">
        <FilterForm v-bind:list="enrichedGameFiles" v-on:filtered-game="updateList($event)" v-on:update-filter="updateFilter($event)" />
      </div>
      <div class="main-panel" v-bind:class="{ 'single-panel': !hasGames }">
        <div class="header-data-line">
          <div class="d40"></div>
          <h1>Slippi stats calculator V1.1</h1>
          <div class="d20"></div>
          <div class="slippi-link">
            <a v-on:click="openSlippiGG()">
              <img alt="Powered by Slippi" title="Open Slippi.gg homepage" src="../assets/powered-by.png" />
            </a>
          </div>
        </div>
        <Upload />
        <GameList v-if="hasGames" v-bind:list="gameFilesForList" v-on:update-list="updateList($event)" />
        <div class="button generateStats" v-on:click="generateStats" v-if="displayButton()">Generate stats</div>
      </div>
    </template>
    <template v-else>
      <div class="stats-display-wrapper">
        <div class="game-list">
          <GameList v-bind:list="gameFilesForStats" :doubleDisplay="true" v-on:update-list="updateListStats($event)"/>
        </div>
        <div class="stats-block">
          <StatsDisplay :list="gameFilesForStats" :stats="stats" :filter="filter" v-on:back="resetStats()" />
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import Upload from "./Upload";
//eslint-disable-next-line
import GameList from "./GameList";
import FilterForm from "./FilterForm";
import Overlay from "./Overlay";
import { store } from "../store/slippiStore";
import { EXTERNALCHARACTERS } from "../libs/constants";
import { processStats } from "../services/slippi-stats.worker";
import StatsDisplay from "./StatsDisplay/StatsDisplay";
//eslint-disable-next-line

export default {
  name: "Home",
  components: {
    Upload,
    GameList,
    FilterForm,
    Overlay,
    StatsDisplay,
  },
  data() {
    return {
      enrichedGameFiles: [],
      gameFilesForList: [],
      filter: {},
      showOverlayVar: undefined,
      storeValue: undefined,
      stats: undefined,
      gameFilesForStats: [],
    };
  },
  computed: {
    hasGames: function () {
      return this.enrichedGameFiles && this.enrichedGameFiles.length > 0;
    },
    hasStats: function () {
      return this.stats && Object.keys(this.stats).length > 0;
    },
    showOverlay: function () {
      return this.showOverlayVar;
    }
  },
  created: function () {
    this.storeValue = store.getStore();
    this.storeValue.subscribe((value) => {
      if (value.enrichedGameFiles) {
        this.enrichedGameFiles = value.enrichedGameFiles;
        this.gameFilesForList = value.enrichedGameFiles;
      }
      if (value.stats) {
        this.stats = value.stats;
      }
    });
  },
  methods: {
    generateStats: function () {
      let gamesForcedIn = this.gameFilesForList.filter((g) => g.forcedIn === true);
      let gamesNotForcedOut = this.gameFilesForList.filter((g) => !g.forcedIn && !g.forcedOut && !g.filteredOut);
      let gamesToProcess = [...gamesForcedIn, ...gamesNotForcedOut];
      this.gameFilesForStats = gamesToProcess;
      let playerSlippiId = this.filter.playerId;
      let playerCharacter = EXTERNALCHARACTERS.find((ch) => ch.shortName === this.filter.playerCharacter);
      let data = {
        games: gamesToProcess,
        slippiId: playerSlippiId,
        characterId: playerCharacter.id,
      };
      this.showOverlayVar = true;
      processStats(data).then((value) => {
        store.setStats(value);
        this.showOverlayVar = false;
      });
    },
    updateList: function (event) {
      this.gameFilesForList = [];
      for (let data of event) {
        this.gameFilesForList.push(data);
      }
      this.gameFilesForList = this.gameFilesForList.sort((a, b) => {
        if (a.filteredOut === b.filteredOut) {
          return 0;
        } else if (a.filteredOut && !b.filteredOut) {
          return 1;
        } else {
          return -1;
        }
      });
    },
    updateFilter: function (event) {
      this.filter = event;
    },
    updateListStats: function(event) {
      this.gameFilesForStats = [];
      for (let game of event) {
        this.gameFilesForStats.push(game);
      }
    },
    openSlippiGG: function () {
      window.open("https://slippi.gg", "_blank");
    },
    resetStats: function() {
      this.stats = undefined;
      this.filter = {};
      this.gameFilesForList= [];
      for (let game of this.enrichedGameFiles) {
        game.filteredOut = false;
        game.forcedIn = false;
        game.forcedOut = false;
        this.gameFilesForList.push(game);
      }
    },
    displayButton: function() {
      return this.enrichedGameFiles?.length > 0 && this.filter?.playerId && this.filter?.playerCharacter;
    }
  },
};
</script>

<style scoped lang="scss">
#home {
  display: flex;
  height: 100%;
}
.side-panel {
  width: 20%;
  margin-top: 50px;
}

.main-panel {
  width: 80%;
}

.single-panel {
  width: 100%;
}

.stats-display-wrapper {
  width: 100%;
  display: flex;
  flex-direction: column;
}

@media (min-width: 2000px) {
  .stats-display-wrapper .game-list {
    width: 87%;
    height: 8em;
  }
}
@media (max-width: 1999px) {
  .stats-display-wrapper .game-list {
    width: 90%;
    height: 150px;
  }
}
.stats-display-wrapper .game-list {
  overflow-x: none;
  margin: auto;
  margin-bottom: 1em;
  margin-top: 1em;
}

.stats-display-wrapper .stats-block {
  width: 100%;
}

.header-data-line {
  display: flex;
}

.d40 {
  width: 40%;
}

h1 {
  width: 20%;
}

.d20 {
  width: 20%;
}

.slippi-link {
  width: 20%;
  padding-top: 2em;
  a {
    cursor: pointer;
    img {
      height: 100px;
    }
  }
}

.offset {
  
  @media (min-width : 2000px) {
    margin-left: -32em;
  }
  @media (max-width : 1999px) {
    margin-left: -384px;
  }
}

.generateStats {
  margin: auto;
  margin-top: 1em;
  font-size: 2em;
}
</style>
