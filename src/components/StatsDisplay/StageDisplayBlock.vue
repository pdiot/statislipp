<template>
  <div class="stage-display-block" :key="displayKey">
    <div class="button" v-for="s of stages" :key="s.stage" v-on:click="emitStage(s.stage)" v-bind:class="{ active: s.active }">
      {{ display(s) }}
    </div>
  </div>
</template>

<script>
export default {
  name: "StageDisplayBlock",
  props: {
    stages: Array,
  },
  data() {
    return {
      displayKey: 0,
    };
  },
  watch: {
    stages: {
      handler: function () {
        this.displayKey++;
      },
      immediate: true,
    },
  },
  methods: {
    emitStage: function (stage) {
      let found = this.stages.find((s) => s.active === true);
      if (found.stage !== stage) {
        found.active = false;
        let newActive = this.stages.find((s) => s.stage === stage);
        if (newActive) {
          newActive.active = true;
          this.displayKey++;
          this.$emit("stage-change", newActive);
        }
      }
    },
    display: function (stage) {
      if (stage.stage === 'allStages') {
        return 'All Stages';
      } else {
        return stage.stage;
      }
    }
  },
};
</script>

<style scoped lang="scss">
.stage-display-block {
  display: flex;
  margin: auto;
  width: 50%;
  justify-content: center;

  .active {
    background: #57e9e95e;
  }
}
</style>
