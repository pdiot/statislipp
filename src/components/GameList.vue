<template>
  <div id="gamelist" v-bind:class="{ double: doubleDisplay }" :key="displayKey">
    <div v-for="(gameFile, index) of list" :key="gameFile.file" class="gameLineWrapper" v-bind:class="{ left: isLeft(index) }">
      <GameLine :gameFile="gameFile" :filteredOut="gameFile.filteredOut" v-on:filter-game="updateList($event)" :simple="doubleDisplay"/>
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
  margin-top: 1em;
  width: 90%;
  overflow-y: scroll;
  @media (min-width: 2000px) {
    max-height: 1000px;
  }
  @media (max-width: 1999px) {
    max-height: 600px;
  }
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
    max-height: 100px !important;
}
</style>
