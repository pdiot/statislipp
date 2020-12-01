<template>
  <div id="gamelist">
    <div class="gameLine" v-for="gameFile of list" :key="gameFile.file" v-bind:class="{filteredOut: gameFile.filteredOut}">
      <div class="file">{{gameFile.file}}</div>
      <div class="slippiId">{{gameFile.playerCharacterPairs[0].player}}</div>
      <div class="character">{{gameFile.playerCharacterPairs[0].character.name}}</div>
      <div class="character">{{gameFile.playerCharacterPairs[1].player}}</div>
      <div class="slippiId">{{gameFile.playerCharacterPairs[1].character.name}}</div>
      <div class="stage">{{gameFile.stage}}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'GameList',
  props: {
    list: Array
  },
  components: {
  }
}
</script>

<style scoped>
  .gameList {
    width: 60%;
  }

  .gameLine {
    display: flex;
    flex-direction: row;
  }

  .file {
    width: 20%;
  }

  .slippiId {
    width: 15%;
  }

  .character {
    width: 15%;
  }

  .stage {
    width: 20%;
  }

  
</style>