<template>
  <div id="home">
    <Overlay v-if="showOverlay" :label="'Please wait while your stats are being processed'"/>
    <div class="side-panel" v-if="hasStats">
      <FilterForm v-bind:list="enrichedGameFiles" v-on:filtered-game="updateList($event)" v-on:update-filter="updateFilter($event)" />
    </div>
    <div class="main-panel" v-bind:class="{ 'single-panel': !hasStats }">
      <Upload />
      <GameList v-if="hasStats" v-bind:list="gameFilesForList" v-on:update-list="updateList($event)" />
      <div class="button" v-on:click="generateStats" v-if="hasStats">Generate stats</div>
    </div>
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
//eslint-disable-next-line

export default {
  name: "Home",
  components: {
    Upload,
    GameList,
    FilterForm,
    Overlay,
  },
  data() {
    return {
      enrichedGameFiles: [],
      gameFilesForList: [],
      filter: {},
      showOverlayVar: undefined,
      store: undefined,
    };
  },
  computed: {
    hasStats: function () {
      return this.enrichedGameFiles && this.enrichedGameFiles.length > 0;
    },
    showOverlay: function () {
      return this.showOverlayVar;
    },
  },
  created: function () {
    this.store = store.getStore();
    this.store.subscribe((value) => {
      console.log("Got value : ", value);
      if (value.enrichedGameFiles) {
        this.enrichedGameFiles = value.enrichedGameFiles;
        this.gameFilesForList = value.enrichedGameFiles;
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
      let playerSlippiId = this.filter.playerId;
      let playerCharacter = EXTERNALCHARACTERS.find((ch) => ch.shortName === this.filter.playerCharacter);
      let data = {
        games: gamesToProcess,
        slippiId: playerSlippiId,
        characterId: playerCharacter.id,
      };
      console.log("Data to process : ", data);
      this.showOverlayVar = true;
      processStats(data).then(value => {
        console.log('Got stats', value);
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
</style>