<template>
  <div id="upload">
    <div>
      <DropZone />
    </div>
  </div>
</template>

<script>
import DropZone from "./DropZone";

export default {
  name: "Upload",
  components: {
    DropZone,
  },
};
</script>

<style scoped>

</style>