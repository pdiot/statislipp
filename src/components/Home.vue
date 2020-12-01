<template>
  <div id="home">
    <div class="side-panel" v-if="hasStats" >
      <FilterForm v-bind:list="enrichedGameFiles" v-if="renderFilterForm"/>
    </div>
    <div class="main-panel" v-bind:class="{'single-panel': !hasStats}">
      <Upload />
      <GameList
        v-if="hasStats"
        v-bind:list="enrichedGameFiles"
      />
      <div
        class="button"
        v-on:click="generateStats"
        v-if="hasStats"
      >
        Generate stats
      </div>
    </div>
  </div>
</template>

<script>
import Upload from "./Upload";
//eslint-disable-next-line
import GameList from "./GameList";
import FilterForm from "./FilterForm";
import { store } from "../store/slippiStore";
//eslint-disable-next-line
let sub;

export default {
  name: "Home",
  components: {
    Upload,
    GameList,
    FilterForm,
  },
  data() {
    return {
      enrichedGameFiles: [],
      renderFilterForm: true,
    };
  },
  computed: {
    hasStats: function() {
      return this.enrichedGameFiles && this.enrichedGameFiles.length > 0;
    }
  },
  created: function () {
    sub = store.getStore().subscribe((value) => {
      console.log("Got value : ", value);
      if (value.enrichedGameFiles) {
        this.enrichedGameFiles = value.enrichedGameFiles;
        // this.refreshFilter();
      }
      if (value.filter) {
        this.filterGames(value.filter);
      }
    });
  },
  methods: {
    filterGames: function (filter) {
      console.log("Filter : ", filter);
    },
    generateStats: function() {
      console.log("TODO Generate stats");
    },
    refreshFilter: function() {
      this.renderFilterForm = false;
      this.$nextTick().then(() => {
        this.renderFilterForm = true;
      });
    }
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