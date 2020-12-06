<template>
  <div id="home">
    <template v-if="!hasStats">
      <Overlay v-if="showOverlay" :label="'Please wait while your stats are being processed'" />
      <div class="side-panel" v-if="hasGames">
        <FilterForm v-bind:list="enrichedGameFiles" v-on:filtered-game="updateList($event)" v-on:update-filter="updateFilter($event)" />
      </div>
      <div class="main-panel" v-bind:class="{ 'single-panel': !hasGames }">
        <Upload />
        <GameList v-if="hasGames" v-bind:list="gameFilesForList" v-on:update-list="updateList($event)" />
        <div class="button" v-on:click="generateStats" v-if="hasGames">Generate stats</div>
      </div>
    </template>
    <template v-else>
      <div class="stats-display-wrapper">
        <div class="game-list">
          <GameList v-bind:list="gameFilesForList" />
        </div>
        <div class="stats-block">
          <StatsDisplay :list="gameFilesForStats" :stats="stats" :filter="filter" />
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
    },
  },
  created: function () {
    this.storeValue = store.getStore();
    this.storeValue.subscribe((value) => {
      console.log("Got value : ", value);
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
      console.log("Called generate stats");
      console.log("games : ", this.gameFilesForList);
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
      console.log("Data to process : ", data);
      this.showOverlayVar = true;
      processStats(data).then((value) => {
        console.log("Got stats", value);
        store.setStats(value);
        this.showOverlayVar = false;
      });
    },
    updateList: function (event) {
      console.log("Callback Home.vue", event);
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
  },
};
</script>

<style scoped>
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
  height: 300px;
}

.stats-display-wrapper .stats-block {
  width: 100%;
}
</style>