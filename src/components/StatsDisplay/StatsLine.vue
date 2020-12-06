<template>
  <div class="stats-line">
    <template v-if="separator">
      <div class="separator"></div>
    </template>
    <template v-else>
      <div class="stat-line" v-bind:class="{'highlight': highlight}">
        <div class="value-left">{{ value1 }}{{ unit1 ? unit1 : "" }}</div>
        <div v-bind:class="{'highlight': highlight, 'label': label}">{{ label }}</div>
        <div class="value-right">{{ value2 }}{{ unit2 ? unit2 : "" }}</div>
      </div>
    </template>
  </div>
</template>

<script>
export default {
  name: "StatsLine",
  props: {
    value1: String,
    unit1: String,
    value2: String,
    unit2: String,
    separator: Boolean,
    highlight: Boolean,
    label: String,
  },
};
</script>

<style scoped>

.stat-line {
  display: grid;
  grid-template-columns: 25% 50% 25%;
  width: 100%;
  -moz-box-align: center;
  align-items: center;
  position: relative;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
}

.stat-line.highlight {
  padding-top: 1rem;
  padding-bottom: 1rem;
}

.stat-line::before {
  z-index: -1;
  content: "";
  display: block;
  height: 0.1rem;
  position: absolute;
  width: 80%;
  margin-left: 50%;
  transform: translate(-50%, -50%);
  background-image: linear-gradient(to right, transparent, rgba(255, 255, 255, 0.4), transparent);
}

.value-left {
  width: 100%;
  text-align: left;
  font-weight: 800;
  font-size: 1.4em;
}

.value-right {
  width: 100%;
  text-align: right;
  font-weight: 800;
  font-size: 1.4em;
}

.label {    
  color: #212529;
  background-color: #c5c9cc;
  text-align: center;
  box-shadow:  #212529 0.2em 0.2em 0.2em;
  padding: 0.3em 2.5em;
  font-weight: 700;
  font-size: 1.2em;
  justify-self: center;
}

.label.highlight {
  background-color: rgb(40, 97, 99);
  color: #c5c9cc;
}

.separator {
  display: block;
  height: 0.1rem;
  width: 100%;
  margin-top: 0.7rem;
  background-color: rgba(255, 255, 255, 0.05);
  margin-top: 1rem;
  margin-bottom: 1rem;
}
</style>