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
import {store } from "../store/slippiStore";
//eslint-disable-next-line
let sub;

export default {
  name: "Upload",
  components: {
    DropZone,
  },
  created: function () {
    sub = store.getStore().subscribe((value) => {
      console.log("Got value : ", value);
    });
  },
};
</script>