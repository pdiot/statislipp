<template>
  <div v-if="punishedActionsForOpponent && punishedActionsForPlayer" class="content" :key="displayKey">
    <StatsLine :label="'Punished options Stats'" :highlight="true" />
    <StatsLine :value1="'Player actions punished by opponent'" :value2="'Opponent actions punished by player'" />
    <StatsLine :separator="true" />
    <StatsLine :label="'Punished attacks'" :highlight="true" />
    <StatsLine :label="'On whiff'" />
    <StatsLine
      v-for="(option, index) in punishedActionsForPlayer[currentCharacter][currentStage].punishedAttacks.onWhiff.slice(0, 3)"
      :key="'Whiff' + index"
      :value1="getAttackWithCount(option)"
      :unit1="'%'"
      :unit2="'%'"
      :value2="getAttackWithCount(punishedActionsForOpponent[currentCharacter][currentStage].punishedAttacks.onWhiff.slice(0, 3)[index])"
    />

    <StatsLine :label="'On shield'" />
    <StatsLine
      v-for="(option, index) in punishedActionsForPlayer[currentCharacter][currentStage].punishedAttacks.onShield.slice(0, 3)"
      :key="'Shield' + index"
      :value1="getAttackWithCount(option)"
      :unit1="'%'"
      :unit2="'%'"
      :value2="getAttackWithCount(punishedActionsForOpponent[currentCharacter][currentStage].punishedAttacks.onShield.slice(0, 3)[index])"
    />

    <StatsLine :label="'On powershield'" />
    <StatsLine
      v-for="(option, index) in punishedActionsForPlayer[currentCharacter][currentStage].punishedAttacks.onPShield.slice(0, 3)"
      :key="'PShield' + index"
      :value1="getAttackWithCount(option)"
      :unit1="'%'"
      :unit2="'%'"
      :value2="getAttackWithCount(punishedActionsForOpponent[currentCharacter][currentStage].punishedAttacks.onPShield.slice(0, 3)[index])"
    />

    <StatsLine :label="'On hit'" />
    <StatsLine
      v-for="(option, index) in punishedActionsForPlayer[currentCharacter][currentStage].punishedAttacks.onHit.slice(0, 3)"
      :key="'Hit' + index"
      :value1="getAttackWithCount(option)"
      :unit1="'%'"
      :unit2="'%'"
      :value2="getAttackWithCount(punishedActionsForOpponent[currentCharacter][currentStage].punishedAttacks.onHit.slice(0, 3)[index])"
    />

    <StatsLine :label="'Punished defensive options'" :highlight="true" />
    <StatsLine
      v-for="(option, index) in punishedActionsForPlayer[currentCharacter][currentStage].punishedDefensiveOptions.slice(0, 3)"
      :key="'Def' + index"
      :value1="getDefOptionWithCount(option)"
      :unit1="'%'"
      :unit2="'%'"
      :value2="getDefOptionWithCount(punishedActionsForOpponent[currentCharacter][currentStage].punishedDefensiveOptions.slice(0, 3)[index])"
    />

    <StatsLine :label="'Punished movement options'" :highlight="true" />
    <StatsLine
      v-for="(option, index) in punishedActionsForPlayer[currentCharacter][currentStage].punishedMovementOptions.slice(0, 3)"
      :key="'Mov' + index"
      :value1="getMovOptionWithCount(option)"
      :unit1="'%'"
      :unit2="'%'"
      :value2="getMovOptionWithCount(punishedActionsForOpponent[currentCharacter][currentStage].punishedMovementOptions.slice(0, 3)[index])"
    />

    <StatsLine :separator="true" />
  </div>
</template>

<script>
import StatsLine from "../StatsLine";
export default {
  name: "PunishesTab",
  props: {
    punishedActionsForPlayer: Object,
    punishedActionsForOpponent: Object,
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
    punishedActionsForPlayer: {
      handler: function () {
        this.displayKey++;
      },
      immediate: true,
    },
    punishedActionsForOpponent: {
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
    getAttackWithCount: function (option) {
      if (option?.attack && option?.count) {
        return `${option.attack} - ${+parseFloat(option.count.toString()).toFixed(2)}`;
      }
      return "N/A";
    },
    getDefOptionWithCount: function (option) {
      if (option?.defensiveOption && option?.count) {
        return `${option.defensiveOption} - ${+parseFloat(option.count.toString()).toFixed(2)}`;
      }
      return "N/A";
    },
    getMovOptionWithCount: function (option) {
      if (option?.movementOption && option?.count) {
        return `${option.movementOption} - ${+parseFloat(option.count.toString()).toFixed(2)}`;
      }
      return "N/A";
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