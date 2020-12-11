<template>
  <div class="gameLine" v-bind:class="classes" v-on:click="filter">
    <div class="file ellipsize-left">{{ gameFile.file }}</div>
    <div class="slippiId">{{ gameFile.playerCharacterPairs[0].player }}</div>
    <div class="character">{{ gameFile.playerCharacterPairs[0].character.name }}</div>
    <div class="character">{{ gameFile.playerCharacterPairs[1].player }}</div>
    <div class="slippiId">{{ gameFile.playerCharacterPairs[1].character.name }}</div>
    <div class="stage ellipsize-left">{{ gameFile.stage }}</div>
  </div>
</template>

<script>
export default {
  name: "GameLine",
  props: {
    gameFile: Object,
    simple: Boolean,
  },
  components: {},
  computed: {
    classes: function () {
      let classes = [];
      if (this.simple) {
        if (this.gameFile.forcedOut) {
          classes.push("grayedOut");
        } else {
          classes.push("filteredIn");
        }
      } else {
        if (this.gameFile.forcedIn) {
          classes.push("forcedIn");
        }
        if (this.gameFile.forcedOut) {
          classes.push("forcedOut");
        }
        if (classes.length === 0) {
          if (this.gameFile.filteredOut) {
            classes.push("filteredOut");
          }
          if (!this.gameFile.filteredOut) {
            classes.push("filteredIn");
          }
        }
      }
      return classes;
    },
  },
  methods: {
    filter: function () {
      if (this.simple) {
        if (this.gameFile.forcedOut) {
          this.gameFile.forcedOut = false;
        } else {
          this.gameFile.forcedOut = true;
        }
      } else {
        if (this.gameFile.forcedIn) {
          this.gameFile.forcedOut = true;
          this.gameFile.forcedIn = false;
        } else if (this.gameFile.forcedOut) {
          this.gameFile.forcedOut = false;
        } else {
          this.gameFile.forcedIn = true;
        }
      }
      this.$emit("filter-game", this.gameFile);
    },
  },
};
</script>

<style scoped>
.gameLine {
  display: flex;
  flex-direction: row;
  padding-left: 1em;
  padding-right: 1em;
  padding-top: 0.2em;
  padding-bottom: 0.2em;
}

.file {
  width: 19%;
  margin-right: 10px;
}

.slippiId {
  width: 14%;
  margin-right: 2px;
}

.character {
  width: 14%;
  margin-right: 2px;
}

.stage {
  width: 19%;
}

.ellipsize-left {
  /* Standard CSS ellipsis */
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 200px;

  /* Beginning of string */
  direction: rtl;
  text-align: left;
}
</style>
