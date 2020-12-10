<template>
  <div class="content" :key="displayKey">
    <template v-if="ledgeDashesForPlayer && ledgeDashesForOpponent">
      <StatsLine :label="'Ledgedashes Stats'" :highlight="true" />
      <StatsLine :separator="true" />
      <StatsLine :label="'Invincible Ledgedashes'" :highlight="true" />
      <StatsLine
        :label="'% of total ledgedashes'"
        :value1="ledgeDashesForPlayer[currentCharacter][currentStage].invincible.percentOfTotalLedgedashes | round('%')"
        :value2="ledgeDashesForOpponent[currentCharacter][currentStage].invincible.percentOfTotalLedgedashes | round('%')"
      />
      <StatsLine
        :label="'Average extra invincibility frames'"
        :value1="ledgeDashesForPlayer[currentCharacter][currentStage].invincible.averageExtraInvincibilityFrames | round"
        :value2="ledgeDashesForOpponent[currentCharacter][currentStage].invincible.averageExtraInvincibilityFrames | round"
      />
      <StatsLine
        :label="'Average framecount since ledgedrop'"
        :value1="ledgeDashesForPlayer[currentCharacter][currentStage].invincible.averageFramesSinceLedgeDrop | round"
        :value2="ledgeDashesForOpponent[currentCharacter][currentStage].invincible.averageFramesSinceLedgeDrop | round"
      />
      <StatsLine :separator="true" />
      <StatsLine :label="'Non-invincible Ledgedashes'" :highlight="true" />
      <StatsLine
        :label="'Average framecount since ledgedrop'"
        :value1="ledgeDashesForPlayer[currentCharacter][currentStage].notInvincible.averageFramesSinceLedgeDrop | round"
        :value2="ledgeDashesForOpponent[currentCharacter][currentStage].notInvincible.averageFramesSinceLedgeDrop | round"
      />
      <StatsLine
        :label="'Average vulnerability frames'"
        :value1="ledgeDashesForPlayer[currentCharacter][currentStage].notInvincible.averageVulnerabilityFrames | round"
        :value2="ledgeDashesForOpponent[currentCharacter][currentStage].notInvincible.averageVulnerabilityFrames | round"
      />
      <StatsLine
        :label="'Min vulnerability frames'"
        :value1="ledgeDashesForPlayer[currentCharacter][currentStage].notInvincible.minVulnerabilityFrames | round"
        :value2="ledgeDashesForOpponent[currentCharacter][currentStage].notInvincible.minVulnerabilityFrames | round"
      />
      <StatsLine
        :label="'Max vulnerability frames'"
        :value1="ledgeDashesForPlayer[currentCharacter][currentStage].notInvincible.maxVulnerabilityFrames | round"
        :value2="ledgeDashesForOpponent[currentCharacter][currentStage].notInvincible.maxVulnerabilityFrames | round"
      />
      <StatsLine :separator="true" />
    </template>
    <template v-if="playerWavedashes && opponentWavedashes">
      <StatsLine :label="'Wavedash Stats'" :highlight="true" />
      <StatsLine :separator="true" />
      <StatsLine
        :label="'Frame 1 wavedashes'"
        :value1="playerWavedashes[currentCharacter][currentStage].frame1 | round('%')"
        :value2="opponentWavedashes[currentCharacter][currentStage].frame1 | round('%')"
      />
      <StatsLine
        :label="'Frame 2 wavedashes'"
        :value1="playerWavedashes[currentCharacter][currentStage].frame2 | round('%')"
        :value2="opponentWavedashes[currentCharacter][currentStage].frame2 | round('%')"
      />
      <StatsLine
        :label="'Frame 3 wavedashes'"
        :value1="playerWavedashes[currentCharacter][currentStage].frame3 | round('%')"
        :value2="opponentWavedashes[currentCharacter][currentStage].frame3 | round('%')"
      />
      <StatsLine
        :label="'Frame 4+ wavedashes'"
        :value1="playerWavedashes[currentCharacter][currentStage].more | round('%')"
        :value2="opponentWavedashes[currentCharacter][currentStage].more | round('%')"
      />
      <StatsLine :separator="true" />
    </template>
    <template v-if="playerJCGrabs && opponentJCGrabs">
      <StatsLine :label="'Jump Cancel Grabs Stats'" :highlight="true" />
      <StatsLine :separator="true" />
      <StatsLine
        :label="'Frame 1 JC Grabs'"
        :value1="playerJCGrabs[currentCharacter][currentStage].successful.frame1 | round('%')"
        :value2="opponentJCGrabs[currentCharacter][currentStage].successful.frame1 | round('%')"
      />
      <StatsLine
        :label="'Frame 2 JC Grabs'"
        :value1="playerJCGrabs[currentCharacter][currentStage].successful.frame2 | round('%')"
        :value2="opponentJCGrabs[currentCharacter][currentStage].successful.frame2 | round('%')"
      />
      <StatsLine
        :label="'Frame 3 or more JC Grabs'"
        :value1="playerJCGrabs[currentCharacter][currentStage].successful.frame3orMore | round('%')" 
        :value2="opponentJCGrabs[currentCharacter][currentStage].successful.frame3orMore | round('%')"
      />
      <StatsLine :separator="true" />
      <StatsLine :label="'Failed JC Grabs'" />
      <StatsLine
        :label="'Jump input one frame late'"
        :value1="playerJCGrabs[currentCharacter][currentStage].failed.oneFrameLate | round('%')"
        :value2="opponentJCGrabs[currentCharacter][currentStage].failed.oneFrameLate | round('%')"
      />
      <StatsLine
        :label="'Jump input two frames late'"
        :value1="playerJCGrabs[currentCharacter][currentStage].failed.twoFramesLate | round('%')"
        :value2="opponentJCGrabs[currentCharacter][currentStage].failed.twoFramesLate | round('%')"
      />
      <StatsLine
        :label="'Jump input three frames late'"
        :value1="playerJCGrabs[currentCharacter][currentStage].failed.threeFramesLate | round('%')"
        :value2="opponentJCGrabs[currentCharacter][currentStage].failed.threeFramesLate | round('%')"
      />
      <StatsLine :separator="true" />
    </template>
  </div>
</template>

<script>
import StatsLine from "../StatsLine";
export default {
  name: "ExecutionTab",
  props: {
    ledgeDashesForPlayer: Object,
    ledgeDashesForOpponent: Object,
    playerWavedashes: Object,
    opponentWavedashes: Object,
    playerJCGrabs: Object,
    opponentJCGrabs: Object,
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
    playerWavedashes: {
      handler: function () {
        this.displayKey++;
      },
      immediate: true,
    },
    opponentWavedashes: {
      handler: function () {
        this.displayKey++;
      },
      immediate: true,
    },
    playerJCGrabs: {
      handler: function () {
        this.displayKey++;
      },
      immediate: true,
    },
    opponentJCGrabs: {
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
