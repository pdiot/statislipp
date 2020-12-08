<template>
  <div v-if="playerOverall && opponentOverall" class="content" :key="displayKey">
    <StatsLine :label="'Overall Stats'" :highlight="true" />
    <StatsLine v-if="gameResults" :label="'Winrate'" :value1="cpGameResults | round" :value2="(100 - cpGameResults) | round" :unit1="'%'" :unit2="'%'" />
    <StatsLine :separator="true" />
    <StatsLine
      :value1="playerOverall[currentCharacter][currentStage].conversionsRatio | round"
      :unit1="'%'"
      :value2="opponentOverall[currentCharacter][currentStage].conversionsRatio | round"
      :unit2="'%'"
      :label="'% of openings'"
    />
    <StatsLine
      :value1="playerOverall[currentCharacter][currentStage].killCountMoyenne | round"
      :value2="opponentOverall[currentCharacter][currentStage].killCountMoyenne | round"
      :label="'Average number of kills'"
    />
    <StatsLine
      :value1="playerOverall[currentCharacter][currentStage].killPercentMoyenne | round"
      :unit1="'%'"
      :value2="opponentOverall[currentCharacter][currentStage].killPercentMoyenne | round"
      :unit2="'%'"
      :label="'Average kill %'"
    />
    <StatsLine
      :value1="playerOverall[currentCharacter][currentStage].openingsPerKillMoyenne | round"
      :value2="opponentOverall[currentCharacter][currentStage].openingsPerKillMoyenne | round"
      :label="'Openings per kill'"
    />
    <StatsLine
      :value1="playerOverall[currentCharacter][currentStage].totalDamageMoyenne | round"
      :unit1="'%'"
      :value2="opponentOverall[currentCharacter][currentStage].totalDamageMoyenne | round"
      :unit2="'%'"
      :label="'Average damage done'"
    />
    <StatsLine :separator="true" />
  </div>
</template>

<script>
import StatsLine from "../StatsLine";
export default {
  name: "OverallTab",
  components: {
    StatsLine,
  },
  filters: {
    round: function (value) {
      if (!value) return "N/A";
      value = +parseFloat(value.toString()).toFixed(2);
      return "" + value;
    },
  },
  data() {
    return {
      displayKey: 0,
    };
  },
  props: {
    playerOverall: Object,
    opponentOverall: Object,
    gameResults: Object,
    currentCharacter: String,
    currentStage: String,
  },
  watch: {
    playerOverall: {
      handler: function () {
        this.displayKey++;
      },
      immediate: true,
    },
    opponentOverall: {
      handler: function () {
        this.displayKey++;
      },
      immediate: true,
    },
    gameResults: {
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
  computed: {
    cpGameResults: function () {
      return this.gameResults[this.currentCharacter][this.currentStage];
    },
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