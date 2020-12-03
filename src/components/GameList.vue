<template>
  <div id="gamelist" :key="displayKey">
    <GameLine v-for="gameFile of list" :key="gameFile.file" :gameFile="gameFile" :filteredOut="gameFile.filteredOut" v-on:filter-game="updateList($event)" />
  </div>
</template>

<script>
import GameLine from "./GameLine";
export default {
  name: "GameList",
  props: {
    list: Array,
  },
  components: {
    GameLine,
  },
  data: function () {
    return {
      displayKey: 0,
    };
  },
  watch: {
    list: {
      handler: function () {
        console.log("called gameList watcher");
        this.displayKey++;
      },
      immediate: true,
    },
  },
  methods: {
    updateList: function (game) {
      let index = this.list.findIndex((g) => g.file === game.file);
      if (index !== -1) {
        this.list[index] = game;
      }
      this.displayKey++;
      this.$emit("update-list", this.list);
    },
  },
};
</script>

<style scoped>
.gameList {
  width: 60%;
}
</style>