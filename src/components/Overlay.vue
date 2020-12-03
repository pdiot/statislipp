<template>
<div class='my-overlay'>
  <div class='meter'>
    <p>{{current}} %</p>
    <span v-bind:style="{'width': current +'%'}"></span>
  </div>
</div>
  
</template>

<script>
export default {
  name: 'Overlay',
  props: {
    current: Number
  },
}
</script>