<template>
  <div v-if="playerConversions && opponentConversions" class="content">
    <StatsLine :label="'Conversion Stats'" :highlight="true" />
    <StatsLine :separator="true" />
    <StatsLine :label="'Damage for most common neutral openers'" />
    <StatsLine
      v-for="i of [0, 1, 2]"
      :key="'A'+i"
      :value1="getMoveDisplayWithAverageDamage(playerConversions[currentCharacter][currentStage].processedDamageForMostCommonNeutralOpeners[i])"
      :unit1="'%'"
      :value2="getMoveDisplayWithAverageDamage(opponentConversions[currentCharacter][currentStage].processedDamageForMostCommonNeutralOpeners[i])"
      :unit2="'%'"
    />
    <StatsLine :label="'Damage for most common punishes'" />
    <StatsLine
      v-for="i of [0, 1, 2]"
      :key="'B'+i"
      :value1="getMoveDisplayWithAverageDamage(playerConversions[currentCharacter][currentStage].processedDamageForMostCommonPunishStarts[i])"
      :unit1="'%'"
      :value2="getMoveDisplayWithAverageDamage(opponentConversions[currentCharacter][currentStage].processedDamageForMostCommonPunishStarts[i])"
      :unit2="'%'"
    />
    <StatsLine :separator="true" />
    <StatsLine :label="'Neutral Wins'" :highlight="true" />
    <StatsLine
      :value1="playerConversions[currentCharacter][currentStage].processedNeutralWinsConversions['single-hit'].averageDamage | round"
      :unit1="'%'"
      :value2="opponentConversions[currentCharacter][currentStage].processedNeutralWinsConversions['single-hit'].averageDamage | round"
      :unit2="'%'"
      :label="'Average damage (single-move)'"
    />
    <StatsLine
      :value1="playerConversions[currentCharacter][currentStage].processedNeutralWinsConversions['multi-hits'].averageDamage | round"
      :unit1="'%'"
      :value2="opponentConversions[currentCharacter][currentStage].processedNeutralWinsConversions['multi-hits'].averageDamage | round"
      :unit2="'%'"
      :label="'Average damage (multi-moves conversions)'"
    />
    <StatsLine
      :value1="playerConversions[currentCharacter][currentStage].processedNeutralWinsConversions['multi-hits'].averageLength | round"
      :value2="opponentConversions[currentCharacter][currentStage].processedNeutralWinsConversions['multi-hits'].averageLength | round"
      :label="'Average length (multi-moves conversions)'"
    />
    <StatsLine
      :value1="playerConversions[currentCharacter][currentStage].processedNeutralWinsConversions['multi-hits'].maxDamage | round"
      :value2="opponentConversions[currentCharacter][currentStage].processedNeutralWinsConversions['multi-hits'].maxDamage | round"
      :label="'Maximum damage (multi-moves conversions)'"
    />
    <StatsLine
      :value1="playerConversions[currentCharacter][currentStage].processedNeutralWinsConversions['multi-hits'].maxLength | round"
      :value2="opponentConversions[currentCharacter][currentStage].processedNeutralWinsConversions['multi-hits'].maxLength | round"
      :label="'Longest multi-moves conversion'"
    />
    <StatsLine
      :value1="getMoveDisplayWithCount(playerConversions[currentCharacter][currentStage].processedNeutralWinsFirstHits)"
      :unit1="'%'"
      :value2="getMoveDisplayWithCount(opponentConversions[currentCharacter][currentStage].processedNeutralWinsFirstHits)"
      :unit2="'%'"
      :label="'Most common neutral opener'"
    />
    <StatsLine :separator="true" />

    <StatsLine :label="'Punishes'" :highlight="true" />
    <StatsLine
      :value1="playerConversions[currentCharacter][currentStage].processedPunishes['single-hit'].averageDamage | round"
      :unit1="'%'"
      :value2="opponentConversions[currentCharacter][currentStage].processedPunishes['single-hit'].averageDamage | round"
      :unit2="'%'"
      :label="'Average damage (single-move)'"
    />
    <StatsLine
      :value1="playerConversions[currentCharacter][currentStage].processedPunishes['multi-hits'].averageDamage | round"
      :unit1="'%'"
      :value2="opponentConversions[currentCharacter][currentStage].processedPunishes['multi-hits'].averageDamage | round"
      :unit2="'%'"
      :label="'Average damage (multi-moves conversions)'"
    />
    <StatsLine
      :value1="playerConversions[currentCharacter][currentStage].processedPunishes['multi-hits'].averageLength | round"
      :unit1="'%'"
      :value2="opponentConversions[currentCharacter][currentStage].processedPunishes['multi-hits'].averageLength | round"
      :label="'Average length (multi-moves conversions)'"
    />
    <StatsLine
      :value1="playerConversions[currentCharacter][currentStage].processedPunishes['multi-hits'].maxDamage | round"
      :unit1="'%'"
      :value2="opponentConversions[currentCharacter][currentStage].processedPunishes['multi-hits'].maxDamage | round"
      :label="'Maximum damage (multi-moves conversions)'"
    />
    <StatsLine
      :value1="playerConversions[currentCharacter][currentStage].processedPunishes['multi-hits'].maxLength | round"
      :value2="opponentConversions[currentCharacter][currentStage].processedPunishes['multi-hits'].maxLength | round"
      :label="'Longest multi-moves conversion'"
    />
    <StatsLine
      :value1="getMoveDisplayWithCount(playerConversions[currentCharacter][currentStage].processedPunishesFirstHits)"
      :unit1="'%'"
      :value2="getMoveDisplayWithCount(opponentConversions[currentCharacter][currentStage].processedPunishesFirstHits)"
      :unit2="'%'"
      :label="'Most common punish option'"
    />
    <StatsLine :separator="true" />
    <StatsLine :label="'Kills'" :highlight="true" />
    <StatsLine
      :value1="getMoveDisplayWithCount(playerConversions[currentCharacter][currentStage].processedKillNeutralFirstHits)"
      :unit1="'%'"
      :value2="getMoveDisplayWithCount(opponentConversions[currentCharacter][currentStage].processedKillNeutralFirstHits)"
      :unit2="'%'"
      :label="'Most common neutral kill starter'"
    />
    <StatsLine
      :value1="getMoveDisplayWithCount(playerConversions[currentCharacter][currentStage].processedKillNeutralLastHits)"
      :unit1="'%'"
      :value2="getMoveDisplayWithCount(opponentConversions[currentCharacter][currentStage].processedKillNeutralLastHits)"
      :unit2="'%'"
      :label="'Most common neutral kill finisher'"
    />
    <StatsLine
      :value1="getMoveDisplayWithCount(playerConversions[currentCharacter][currentStage].processedKillPunishFirstHits)"
      :unit1="'%'"
      :value2="getMoveDisplayWithCount(opponentConversions[currentCharacter][currentStage].processedKillPunishFirstHits)"
      :unit2="'%'"
      :label="'Most common punish kill starter'"
    />
    <StatsLine
      :value1="getMoveDisplayWithCount(playerConversions[currentCharacter][currentStage].processedKillPunishLastHits)"
      :unit1="'%'"
      :value2="getMoveDisplayWithCount(opponentConversions[currentCharacter][currentStage].processedKillPunishLastHits)"
      :unit2="'%'"
      :label="'Most common punish kill finisher'"
    />
    <StatsLine :separator="true" />
  </div>
</template>

<script>
import StatsLine from '../StatsLine';
export default {
  name: "ConversionsTab",
  components: {
    StatsLine,
  },
  props: {
    playerConversions: Object,
    opponentConversions: Object,
    currentCharacter: String,
    currentStage: String,
  },
  data() {
    return {
      displayKey: 0,
    };
  },
  watch: {
    playerConversions: {
      handler: function () {
        this.displayKey++;
      },
      immediate: true,
    },
    opponentConversions: {
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
    getMoveDisplayWithCount(move) {
      if (move?.moveId && move?.count) {
        return `${this.getMoveName(move.moveId)} - ${+parseFloat(move.count.toString()).toFixed(2)}`;
      }
      return "N/A";
    },
    getMoveDisplayWithAverageDamage(move) {
      if (move?.moveId && move?.averageDamage) {
        return `${this.getMoveName(move.moveId)} - ${+parseFloat(move.averageDamage.toString()).toFixed(2)}`;
      }
      return "N/A";
    },
    getMoveName(moveId) {
      return "Move Name for " + moveId;
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