<template>
  <div id="dropzone">
    <div
      class="pretty"
      v-on:click="testOnClick"
      v-on:drop="handleDrop($event)"
      v-on:dragover="handleDragover($event)"
    >
      <input id="uploadInput" type="file" multiple style="display: none" />
      <p>Drag files here or click to upload</p>
    </div>
  </div>
</template>

<script>
import { enrichGameFile } from "../services/slippi-file-handler";
import { store } from "../store/slippiStore";

export default {
  name: "DropZone",
  components: {},
  methods: {
    testOnClick: () => {
      console.log("On upload click");
      if (document) {
        if (document.getElementById("uploadInput")) {
          console.log("document exists");
          //@ts-ignore
          document.getElementById("uploadInput").click();
        }
      }
    },
    handleDrop: (event) => {
      // Prevent default behavior (Prevent file from being opened)
      event.preventDefault();
      const eventFiles = event.dataTransfer.files;
      console.log("Received files", receivedFiles);
      const startTime = new Date().getTime();

      const enrichedGameFiles = [];
      const receivedFiles = [];
      for (let file of eventFiles) {
        receivedFiles.push(file);
      }

      const promises = receivedFiles.map(async (file) => {
        try {
          const game = await enrichGameFile(file);
          enrichedGameFiles.push(game);
          console.log("Enriched Game File generated : ", game);
        } catch (error) {
          console.error(error);
        }
      });
      Promise.all(promises).then(() => {
        const time = new Date().getTime() - startTime;
        console.log(`Finished processing in ${time}ms`);
        console.log("Enriched Game File list : ", enrichedGameFiles);
        store.setGames(enrichedGameFiles);
      });
    },
    handleDragover: (event) => {
      // Prevent default behavior (Prevent file from being opened)
      event.preventDefault();
    },
  },
};
</script>

<style scoped>
.pretty {
  background-color: aquamarine;
  height: 300px;
  width: 500px;
}
</style>