<template>
  <div id="dropzone">
    <div
      class="pretty"
      v-on:click="onClick"
      v-on:drop="handleDrop($event)"
      v-on:dragover="handleDragover($event)"
    >
      <input
        v-on:change="onInputChange($event)"
        id="uploadInput"
        type="file"
        multiple
        style="display: none"
        accept=".slp"
      />
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
    onClick: () => {
      if (document) {
        if (document.getElementById("uploadInput")) {
          //@ts-ignore
          document.getElementById("uploadInput").click();
        }
      }
    },
    onInputChange: function (event) {
      event.preventDefault();
      const fileList = event.target.files;
      this.makeEnrichedGameFiles(fileList);
    },
    handleDrop: function (event) {
      // Prevent default behavior (Prevent file from being opened)
      event.preventDefault();
      const fileList = event.dataTransfer.files;
      this.makeEnrichedGameFiles(fileList);
    },
    makeEnrichedGameFiles: function (fileList) {
      const startTime = new Date().getTime();
      const enrichedGameFiles = [];
      const receivedFiles = [];
      for (let file of fileList) {
        receivedFiles.push(file);
      }

      const promises = receivedFiles.map(async (file) => {
        try {
          const game = await enrichGameFile(file);
          enrichedGameFiles.push(game);
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
  width: 25%;
  height: 50px;
  margin: auto;
  border: #c5c9cc 1px solid;
  cursor: pointer;
}

.pretty p {
  text-align: center;
}
</style>