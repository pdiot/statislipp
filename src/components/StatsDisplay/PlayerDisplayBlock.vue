<template>
  <div class="player-display-block">
    Player display block
    <div class="character">
      {{characterToDisplay}}
    </div>
    <div class="button">
      {{playerId}}
    </div>
  </div>
</template>

<script>
export default {
  name: 'PlayerDisplayBlock',
  props: {
    playerId: String,
    characters: Array,
    canChange: Boolean,
  },
  computed: {
    characterToDisplay: function() {
      if (this.characters && this.characters.length > 1) {
        let found =  this.characters.find(char => char.active === true);
        if (found) {
          return found.shortName;
        } else {
          return 'Erreur';
        }
      }
    }
  }
}
</script>