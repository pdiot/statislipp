<template>
  <div class="stats-main-block">
    <div class="stats-tabs">
      <div class="label" v-for="tab of tabs" :key="tab.label" v-bind:class="{ active: tab.active }" v-on:click="setActiveTab(tab.label)">
        {{ tab.label }}
      </div>
    </div>
    <div class="tab-contents">
      <template v-if="getActiveTab() === 'overall'">
        <OverallTab
          :playerOverall="stats.playerOverall"
          :opponentOverall="stats.opponentOverall"
          :gameResults="stats.gameResults"
          :currentCharacter="currentCharacter"
          :currentStage="currentStage"
        />
      </template>
      <template v-if="getActiveTab() === 'conversions'">
        <ConversionsTab
          :playerConversions="stats.playerConversions"
          :opponentConversions="stats.opponentConversions"
          :currentCharacter="currentCharacter"
          :currentStage="currentStage"
        />
      </template>
      <template v-if="getActiveTab() === 'punishes'">
        <PunishesTab
          :punishedActionsForPlayer="stats.punishedActionsForPlayer"
          :punishedActionsForOpponent="stats.punishedActionsForOpponent"
          :currentCharacter="currentCharacter"
          :currentStage="currentStage"
        />
      </template>
      <template v-if="getActiveTab() === 'lcancels'">
        <LcancelTab
          :lcancelsForPlayer="stats.lcancelsForPlayer"
          :lcancelsForOpponent="stats.lcancelsForOpponent"
          :currentCharacter="currentCharacter"
          :currentStage="currentStage"
        />
      </template>
      <template v-if="getActiveTab() === 'execution'">
        <ExecutionTab
          :ledgeDashesForPlayer="stats.ledgeDashesForPlayer"
          :ledgeDashesForOpponent="stats.ledgeDashesForOpponent"
          :playerWavedashes="stats.playerWavedashes"
          :opponentWavedashes="stats.opponentWavedashes"
          :playerJCGrabs="stats.playerJCGrabs"
          :opponentJCGrabs="stats.opponentJCGrabs"
          :currentCharacter="currentCharacter"
          :currentStage="currentStage"
        />
      </template>
    </div>
  </div>
</template>

<script>
import OverallTab from "./StatsTab/OverallTab";
import ConversionsTab from "./StatsTab/ConversionsTab";
import PunishesTab from "./StatsTab/PunishesTab";
import LcancelTab from "./StatsTab/LcancelTab";
import ExecutionTab from "./StatsTab/ExecutionTab";
export default {
  name: "StatsMainBlock",
  components: {
    OverallTab,
    ConversionsTab,
    PunishesTab,
    LcancelTab,
    ExecutionTab,
  },
  props: {
    stats: Object,
    currentCharacter: String,
    currentStage: String,
  },
  data() {
    return {
      tabs: [
        {
          active: true,
          label: "overall",
        },
        {
          active: false,
          label: "conversions",
        },
        {
          active: false,
          label: "punishes",
        },
        {
          active: false,
          label: "lcancels",
        },
        {
          active: false,
          label: "execution",
        },
      ],
    };
  },
  methods: {
    getActiveTab: function () {
      console.log("tabs :", this.tabs);
      if (this.tabs && this.tabs.length > 0) {
        let found = this.tabs.find((t) => t.active);
        return found ? found.label : undefined;
      }
    },
    setActiveTab: function (label) {
      console.log("called Set active tab", label);
      for (let tab of this.tabs) {
        if (tab.label === label) {
          tab.active = true;
        } else {
          tab.active = false;
        }
      }
    },
  },
};
</script>

<style scoped lang="scss">
.tab-contents {
  background: rgba(0, 0, 0, 0) linear-gradient(to right, rgb(18, 16, 32), transparent, rgb(18, 16, 32)) repeat scroll 0% 0%;
  overflow-y: auto;
  @media (min-width: 2000px) {
    height: 61.3em;
  }
  @media (max-width: 1999px) {
    height: 600px;
  }
}

.stats-tabs {
  width: 70%;
  display: flex;
  @media (min-width: 2000px) {
    height: 3.7em;
  }

  .label {
    width: 20%;
    text-align: center;
    font-weight: 600;
    font-size: 1.4rem;
    cursor: pointer;
    padding-bottom: 1rem;
    padding-top: 1rem;
    transition-duration: 0.25s;
    transition-timing-function: ease-in-out;
  }

  .label.active {
    background: #0204045e;
  }
}
</style>
