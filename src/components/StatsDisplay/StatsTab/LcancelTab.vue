<template>
  <div v-if="lcancelsForPlayer && lcancelsForOpponent" :key="displayKey" class="content">
    <StatsLine :label="'L-Cancel Stats'" :highlight="true" />
    <StatsLine :separator="true" />
    <StatsLine
      :value1="getRatio(lcancelsForPlayer[currentCharacter][currentStage].lcancels)"
      :value2="getRatio(lcancelsForOpponent[currentCharacter][currentStage].lcancels)"
      :label="'Ratio of successful L-Cancels'"
    />
    <StatsLine :label="'Moves with failed l-cancels'" />
    <StatsLine
      v-for="(option, index) of lcancelsForPlayer[currentCharacter][currentStage].failedMoves.slice(0,3)"
      :key="'Failed' + index"
      :value1="getMoveWithCount(option)"
      :value2="getMoveWithCount(lcancelsForOpponent[currentCharacter][currentStage].failedMoves[index])"
    />
    <StatsLine :separator="true" />
  </div>
</template>

<script>
import StatsLine from '../StatsLine';
export default {
  name: "LcancelTab",
  props: {
    lcancelsForPlayer: Object,
    lcancelsForOpponent: Object,
    currentCharacter: String,
    currentStage: String,
  },
  components: {
    StatsLine,
  },
  data() {
    return {
      displayKey: 0,
    };
  },
  watch: {
    lcancelsForPlayer: {
      handler: function () {
        this.displayKey++;
      },
      immediate: true,
    },
    lcancelsForOpponent: {
      handler: function () {
        this.displayKey++;
      },
      immediate: true,
    },
    currentCharacter: {
      handler: function () {
        this.displayKey++;
      },
      immediate: true,
    },
    currentStage: {
      handler: function () {
        this.displayKey++;
      },
      immediate: true,
    },
  },
  methods: {
    getMoveWithCount: function (option) {
      if (option?.move && option?.count) {
        return `${option.move.split(' ')[0]} - ${+parseFloat(option.count.toString()).toFixed(2)}%`;
      }
      return "N/A";
    },
    getRatio: function(option) {
      if (option && (option.failed + option.successful !== 0)) {
        return `${+parseFloat((option.successful / (option.failed + option.successful) * 100).toFixed(2))}%`;
      }
      return "N/A";
    }
  },
};
</script>

<style scoped lang="scss">
.content {
  width: 90%;
  margin: auto;

  .app-stats-line {
    margin-top: 0.5rem;
  }

  .app-stats-line:last-child {
    margin-bottom: 4rem;
  }
}
</style>
