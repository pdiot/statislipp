<template>
  <div id="gamelist" v-bind:class="{ double: doubleDisplay }" :key="displayKey">
    <div v-for="(gameFile, index) of list" :key="gameFile.file" class="gameLineWrapper" v-bind:class="{ left: isLeft(index) }">
      <GameLine :gameFile="gameFile" :filteredOut="gameFile.filteredOut" v-on:filter-game="updateList($event)" />
    </div>
  </div>
</template>

<script>
import GameLine from "./GameLine";
export default {
  name: "GameList",
  props: {
    list: Array,
    doubleDisplay: Boolean,
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
    isLeft(index) {
      return index % 2 === 0;
    },
  },
};
</script>

<style scoped lang="scss">

#gamelist {
  margin: auto;
}

.double {
  display: flex;
  flex-wrap: wrap;
  .gameLineWrapper {
    width: 48%;
  }
  .left {
    border-right: #c5c9cc 1px solid;
  }
}
</style>
