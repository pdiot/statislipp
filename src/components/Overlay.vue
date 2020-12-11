<template>
  <div class="my-overlay">
    <div class="overlay-label">{{ label }}</div>
    <div class="lds-dual-ring"></div>
  </div>
</template>

<script>
export default {
  name: "Overlay",
  props: {
    label: String,
  },
};
</script>

<style scoped>
.my-overlay {
  display: flex;
  flex-direction: column;
}

.overlay-label {
  margin-bottom: 2em;
}

.lds-dual-ring {
  display: inline-block;
  width: 80px;
  height: 80px;
}
.lds-dual-ring:after {
  content: " ";
  display: block;
  width: 64px;
  height: 64px;
  margin: 8px;
  border-radius: 50%;
  border: 6px solid #fff;
  border-color: #fff transparent #fff transparent;
  animation: lds-dual-ring 1.2s linear infinite;
}
@keyframes lds-dual-ring {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
