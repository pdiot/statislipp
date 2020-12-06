<template>
  <div class=""></div>
</template>

<script>
export default {
  name: "OverallTab",
  props: {
    playerOverall: Object,
    opponentOverall: Object,
  },
};
</script>

<style scoped>
.content {
  width: 90%;
  margin: auto;
}

.content .app-stats-line {
  margin-top: 0.5rem;
}

.content .app-stats-line:last-child {
  margin-bottom: 4rem;
}
</style>