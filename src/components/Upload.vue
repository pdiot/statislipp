<template>
  <div id="upload">
    <div>
      We're in upload.
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