<template>
  <div id="filterform" :key="mandatoryDataKey">
    <h2>Select player Slippi Id</h2>
    <div id="playerId" class="formRow">
      <div
        class="button"
        v-for="slippiId in slippiIds"
        :key="slippiId"
        v-on:click="selectSlippiId(slippiId)"
        v-bind:class="{
          selected: isSelectedPlayerId(slippiId),
          ignored: isIgnoredPlayerId(slippiId),
        }"
      >
        {{ slippiId }}
      </div>
    </div>
    <div id="playerCharacter" v-if="playerIdSelected && playerCharacters && playerCharacters.length > 0">
      <h2>Select player Character</h2>
      <div class="formRow">
        <div
          class="button"
          v-for="character in playerCharacters"
          :key="character"
          v-on:click="selectPlayerCharacter(character)"
          v-bind:class="{
            selected: isSelectedPlayerChar(character),
            ignored: isIgnoredPlayerCharacter(character),
          }"
        >
          {{ character }}
        </div>
      </div>
    </div>
    <div id="optionalFilters" v-if="playerIdSelected && playerCharacterSelected" :key="optionalDataKey">
      <h2>Optional Filters</h2>
      <h3>Opponent Ids</h3>
      <div id="opponentIds" class="formRow">
        <div
          class="button"
          v-for="opp of opponentIds"
          :key="opp.id"
          v-on:click="toggleOpponentId(opp.id)"
          v-bind:class="{
            filteredIn: opp.filterType === 'Whitelist',
            filteredOut: opp.filterType === 'Blacklist',
          }"
        >
          {{ opp.id }}
        </div>
      </div>
      <h3>Opponent Characters</h3>
      <div id="opponentCharacters" class="formRow">
        <div
          class="button"
          v-for="character of opponentCharacters"
          :key="character.shortName"
          v-on:click="toggleOpponentCharacter(character.shortName)"
          v-bind:class="{
            filteredIn: character.filterType === 'Whitelist',
            filteredOut: character.filterType === 'Blacklist',
          }"
        >
          {{ character.shortName }}
        </div>
      </div>
      <h3>Stages</h3>
      <div id="stages" class="formRow">
        <div
          class="button"
          v-for="stage of stages"
          :key="stage.name"
          v-on:click="toggleStage(stage.name)"
          v-bind:class="{
            filteredIn: stage.filterType === 'Whitelist',
            filteredOut: stage.filterType === 'Blacklist',
          }"
        >
          {{ stage.name }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "FilterForm",
  components: {},
  props: {
    list: Array,
  },
  data() {
    return {
      slippiIds: [],
      playerCharacterPairs: [],
      playerCharacters: [],
      opponentIds: [],
      opponentCharacters: [],
      stages: [],
      playerIdSelected: false,
      playerCharacterSelected: false,
      filter: {},
      optionalDataKey: 0,
      mandatoryDataKey: 0,
    };
  },
  watch: {
    list: {
      handler: function () {
        this.resetAfterGameListChanged();
        if (this.list && this.list.length > 0) {
          let slippiIds = [];
          let playerCharacterPairs = [];
          let stages = [];
          for (let egf of this.list) {
            for (let pcp of egf.playerCharacterPairs) {
              if (!slippiIds.includes(pcp.player)) {
                slippiIds.push(pcp.player);
              }
              if (
                !playerCharacterPairs.find((pcpArray) => {
                  return pcpArray.playerId === pcp.player && pcpArray.characterShortName === pcp.character.shortName;
                })
              ) {
                playerCharacterPairs.push({
                  playerId: pcp.player,
                  characterShortName: pcp.character.shortName,
                });
              }
            }
            if (!stages.find((stage) => stage.name === egf.stage)) {
              stages.push({ name: egf.stage });
            }
          }
          this.slippiIds = slippiIds;
          this.playerCharacterPairs = playerCharacterPairs;
          this.stages = stages;
        }
      },
      immediate: true,
    },
  },
  methods: {
    filterGames: function () {
      if (this.filter) {
        if (Object.keys(this.filter).length === 0) {
          // It's a new filter, so we probably just reset everything, let's clean it up
          for (let game of this.list) {
            game.filteredOut = false;
          }
        }
        if (this.filter.playerId) {
          for (let game of this.list) {
            let playerIdFound = game.playerCharacterPairs.find((pcp) => pcp.player === this.filter.playerId);
            if (!playerIdFound) {
              game.filteredOut = true;
            } else {
              game.filteredOut = false;
            }
          }
        }
        if (this.filter.playerCharacter) {
          for (let game of this.list.filter((game) => !game.filteredOut)) {
            let playerCharacterFound = game.playerCharacterPairs.find((pcp) => pcp.player === this.filter.playerId && pcp.character.shortName === this.filter.playerCharacter);
            if (!playerCharacterFound) {
              game.filteredOut = true;
            } else {
              game.filteredOut = false;
            }
          }
        }
        if (this.filter.opponentIds) {
          // Filter on opponent slippi Id
          let foundWhitelist = this.filter.opponentIds.find((opp) => opp.type === "Whitelist");
          if (foundWhitelist) {
            for (let game of this.list.filter((game) => !game.filteredOut)) {
              let filteredIn = false;
              for (let opp of this.filter.opponentIds) {
                if (opp.type === "Whitelist") {
                  let foundOppId = game.playerCharacterPairs.find((pcp) => pcp.player === opp.id);
                  if (foundOppId) {
                    filteredIn = true;
                  }
                }
              }
              game.filteredOut = !filteredIn;
            }
          } else {
            let foundBlacklist = this.filter.opponentIds.find((opp) => opp.type === "Blacklist");
            if (foundBlacklist) {
              for (let game of this.list.filter((game) => !game.filteredOut)) {
                for (let opp of this.filter.opponentIds) {
                  if (opp.type === "Blacklist") {
                    let foundOppId = game.playerCharacterPairs.find((pcp) => pcp.player === opp.id);
                    if (foundOppId) {
                      game.filteredOut = true;
                    }
                  }
                }
              }
            }
          }
        }
        if (this.filter.opponentChars) {
          // Filter on opponentCharacters
          let foundWhitelist = this.filter.opponentChars.find((oppChar) => oppChar.type === "Whitelist");
          if (foundWhitelist) {
            for (let game of this.list.filter((game) => !game.filteredOut)) {
              let filteredIn = false;
              for (let oppChar of this.filter.opponentChars) {
                if (oppChar.type === "Whitelist") {
                  let foundOppChar = game.playerCharacterPairs.find((pcp) => pcp.character.shortName === oppChar.characterShortName && pcp.player !== this.filter.playerId);
                  if (foundOppChar) {
                    filteredIn = true;
                  }
                }
              }
              game.filteredOut = !filteredIn;
            }
          } else {
            let foundBlacklist = this.filter.opponentChars.find((oppChar) => oppChar.type === "Blacklist");
            if (foundBlacklist) {
              for (let game of this.list.filter((game) => !game.filteredOut)) {
                for (let oppChar of this.filter.opponentChars) {
                  if (oppChar.type === "Blacklist") {
                    let foundOppChar = game.playerCharacterPairs.find((pcp) => pcp.character.shortName === oppChar.characterShortName && pcp.player !== this.filter.playerId);
                    if (foundOppChar) {
                      game.filteredOut = true;
                    }
                  }
                }
              }
            }
          }
        }
        if (this.filter.stages) {
          // Filter on stage
          let foundWhitelist = this.filter.stages.find((stage) => stage.type === "Whitelist");
          if (foundWhitelist) {
            for (let game of this.list.filter((game) => !game.filteredOut)) {
              let filteredIn = false;
              for (let stageFilter of this.filter.stages) {
                if (stageFilter.type === "Whitelist") {
                  if (game.stage === stageFilter.stage) {
                    filteredIn = true;
                  }
                }
              }
              game.filteredOut = !filteredIn;
            }
          } else {
            let foundBlacklist = this.filter.stages.find((stage) => stage.type === "Blacklist");
            if (foundBlacklist) {
              for (let game of this.list.filter((game) => !game.filteredOut)) {
                for (let stageFilter of this.filter.stages) {
                  if (stageFilter.type === "Blacklist") {
                    if (game.stage === stageFilter.stage) {
                      game.filteredOut = true;
                    }
                  }
                }
              }
            }
          }
        }
        this.$emit("filtered-game", this.list);
        this.$emit("update-filter", this.filter);
      }
    },
    selectSlippiId: function (slippiId) {
      if (!this.filter.playerId || this.filter.playerId !== slippiId) {
        this.playerIdSelected = true;
        this.filter.playerId = slippiId;
        this.resetAfterPlayerIdChanged();
        this.filterGames();
        this.getPlayerCharacterList();
        this.mandatoryDataKey++;
        this.optionalDataKey++;
      }
    },
    getPlayerCharacterList: function () {
      this.playerCharacters = this.playerCharacterPairs.filter((pcp) => pcp.playerId === this.filter.playerId).map((pcp) => pcp.characterShortName);
    },
    selectPlayerCharacter: function (characterShortName) {
      if (!this.filter.playerCharacter || this.filter.playerCharacter !== characterShortName) {
        this.playerCharacterSelected = true;
        this.filter.playerCharacter = characterShortName;
        this.resetAfterPlayerCharacterChanged();
        this.filterGames();
        this.getOpponentSlippiIds();
        this.mandatoryDataKey++;
        this.optionalDataKey++;
      }
    },
    getOpponentSlippiIds: function () {
      this.opponentIds = [];
      for (let game of this.list) {
        if (!game.filteredOut) {
          let opponentPcp = game.playerCharacterPairs.find((pcp) => pcp.player !== this.filter.playerId);
          if (opponentPcp && !this.opponentIds.find((opp) => opp.id === opponentPcp.player)) {
            this.opponentIds.push({ id: opponentPcp.player });
          }
        }
      }
      this.getOpponentCharacters();
    },
    getOpponentCharacters: function () {
      this.opponentCharacters = [];
      if (this.filter.opponentIds?.length > 0) {
        if (this.filter.opponentIds.includes((filterOpponentId) => filterOpponentId.type === "Whitelist")) {
          for (let opponentId of this.filter.opponentIds.filter((opp) => opp.type === "Whitelist")) {
            for (let game of this.list) {
              if (!game.filteredOut) {
                let pcp = game.playerCharacterPairs.find((pc) => pc.player === opponentId.id);
                if (pcp) {
                  if (!this.opponentCharacters.find((opp) => opp.shortName === pcp.character.shortName)) {
                    this.opponentCharacters.push({
                      shortName: pcp.character.shortName,
                    });
                  }
                }
              }
            }
          }
        } else if (this.filter.opponentIds.includes((filterOpponentId) => filterOpponentId.type === "Blacklist")) {
          for (let game of this.list) {
            if (!game.filteredOut) {
              let pcp = game.playerCharacterPairs.find((pc) => pc.player !== this.filter.playerId);
              if (pcp) {
                if (!this.opponentCharacters.find((opp) => opp.shortName === pcp.character.shortName)) {
                  this.opponentCharacters.push({
                    shortName: pcp.character.shortName,
                  });
                }
              }
            }
          }
        }
      } else {
        for (let game of this.list) {
          if (!game.filteredOut) {
            let pcp = game.playerCharacterPairs.find((pc) => pc.player !== this.filter.playerId);
            if (pcp && !this.opponentCharacters.find((opp) => opp.shortName === pcp.character.shortName)) {
              this.opponentCharacters.push({
                shortName: pcp.character.shortName,
              });
            }
          }
        }
      }
    },
    toggleOpponentId: function (opponentId) {
      if (!this.filter.opponentIds) {
        this.filter.opponentIds = [
          {
            id: opponentId,
            type: "Whitelist",
          },
        ];
        this.opponentIds.find((opp) => opp.id === opponentId).filterType = "Whitelist";
      } else {
        let filteredOpponent = this.filter.opponentIds.find((filterOpp) => filterOpp.id === opponentId);
        if (filteredOpponent && filteredOpponent.type === "Blacklist") {
          this.filter.opponentIds = this.filter.opponentIds.filter((filterOpp) => filterOpp.id !== opponentId);
          this.opponentIds.find((opp) => opp.id === opponentId).filterType = undefined;
        } else if (filteredOpponent && filteredOpponent.type === "Whitelist") {
          filteredOpponent.type = "Blacklist";
          this.opponentIds.find((opp) => opp.id === opponentId).filterType = "Blacklist";
        } else {
          this.filter.opponentIds.push({
            id: opponentId,
            type: "Whitelist",
          });
          this.opponentIds.find((opp) => opp.id === opponentId).filterType = "Whitelist";
        }
      }
      this.filterGames();
      this.optionalDataKey++;
    },
    toggleOpponentCharacter: function (opponentChar) {
      if (!this.filter.opponentChars) {
        this.filter.opponentChars = [
          {
            characterShortName: opponentChar,
            type: "Whitelist",
          },
        ];
        this.opponentCharacters.find((opp) => opp.shortName === opponentChar).filterType = "Whitelist";
      } else {
        let filteredOpponent = this.filter.opponentChars.find((filterOpp) => filterOpp.characterShortName === opponentChar);
        if (filteredOpponent && filteredOpponent.type === "Blacklist") {
          this.filter.opponentChars = this.filter.opponentChars.filter((filterOpp) => filterOpp.characterShortName !== opponentChar);
          this.opponentCharacters.find((opp) => opp.shortName === opponentChar).filterType = undefined;
        } else if (filteredOpponent && filteredOpponent.type === "Whitelist") {
          filteredOpponent.type = "Blacklist";
          this.opponentCharacters.find((opp) => opp.shortName === opponentChar).filterType = "Blacklist";
        } else {
          this.filter.opponentChars.push({
            characterShortName: opponentChar,
            type: "Whitelist",
          });
          this.filterGames();
          this.opponentCharacters.find((opp) => opp.shortName === opponentChar).filterType = "Whitelist";
        }
      }
      this.optionalDataKey++;
    },
    toggleStage: function (stageName) {
      if (!this.filter.stages) {
        this.filter.stages = [
          {
            stage: stageName,
            type: "Whitelist",
          },
        ];
        this.stages.find((s) => s.name === stageName).filterType = "Whitelist";
      } else {
        let filteredStage = this.filter.stages.find((filterStage) => filterStage.stage === stageName);
        if (filteredStage && filteredStage.type === "Blacklist") {
          this.filter.stages = this.filter.stages.filter((filterStage) => filterStage.stage !== stageName);
          this.stages.find((s) => s.name === stageName).filterType = undefined;
        } else if (filteredStage && filteredStage.type === "Whitelist") {
          filteredStage.type = "Blacklist";
          this.stages.find((s) => s.name === stageName).filterType = "Blacklist";
        } else {
          this.filter.stages.push({
            stage: stageName,
            type: "Whitelist",
          });
          this.stages.find((s) => s.name === stageName).filterType = "Whitelist";
        }
      }
      this.filterGames();
      this.optionalDataKey++;
    },
    isSelectedPlayerId: function (slippiId) {
      return this.filter?.playerId === slippiId;
    },
    isIgnoredPlayerId: function (slippiId) {
      return this.filter?.playerId && this.filter.playerId !== slippiId;
    },
    isSelectedPlayerChar: function (char) {
      return this.filter?.playerCharacter === char;
    },
    isIgnoredPlayerCharacter: function (char) {
      return this.filter?.playerCharacter && this.filter.playerCharacter !== char;
    },
    resetAfterGameListChanged: function () {
      this.slippiIds = [];
      this.playerCharacterPairs = [];
      this.playerCharacters = [];
      this.opponentIds = [];
      this.opponentCharacters = [];
      this.stages = [];
      this.playerIdSelected = false;
      this.playerCharacterSelected = false;
      this.filter = {};
      this.optionalDataKey++;
      this.mandatoryDataKey++;
    },
    resetAfterPlayerIdChanged: function () {
      this.opponentIds = [];
      this.playerCharacterSelected = false;
      this.filter.opponentChars = undefined;
      this.filter.opponentIds = undefined;
      this.filter.playerCharacter = undefined;
      this.filter.stages = undefined;
    },
    resetAfterPlayerCharacterChanged: function () {
      this.opponentIds = [];
      this.filter.opponentChars = undefined;
      this.filter.opponentIds = undefined;
      this.filter.stages = undefined;
    },
  },
  computed: {},
};
</script>

<style scoped>
#filterForm {
  margin-left: 1em;
}

.button.selected {
  color: #c5c9cc;
  background-color: #5bba83;
}

.button.ignored {
  color: #c5c9cc;
  background-color: #312f2f;
}

.formRow {
  display: flex;
  flex-wrap: wrap;
  padding-left: 1em;
}
</style>