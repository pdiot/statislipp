<template>
  <div id="home">
    <Upload />
    <GameList
      v-if="enrichedGameFiles && enrichedGameFiles.length > 0"
      v-bind:list="enrichedGameFiles"/>
  </div>
</template>

<script>
import Upload from "./Upload";
//eslint-disable-next-line
import GameList from "./GameList";
import { store } from "../store/slippiStore";
//eslint-disable-next-line
let sub;

export default {
  name: "Home",
  components: {
    Upload,
    GameList
  },
  data() {
    return {
      enrichedGameFiles: [],
    };
  },
  created: function () {
    sub = store.getStore().subscribe((value) => {
      console.log("Got value : ", value);
      if (value.enrichedGameFiles) {
        this.enrichedGameFiles = value.enrichedGameFiles;
      }
    });
  },
};
</script>