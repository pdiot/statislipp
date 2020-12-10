<template>
  <div v-bind:class="portraitClass()" :key="displayKey">
    <div class="char-versus-picture" v-bind:style="{ backgroundImage: 'url(' + backgroundPicture() + ')' }"></div>
    <template v-if="side === 'left'">
      <div class="player-label-block left-side">
        <div class="info" v-if="writeFeedbackMessage">
          {{ writeFeedbackMessage }}
        </div>
        <div class="highlight fake-button">Stats for {{ characterToDisplay() }}</div>
        <div class="action fake-button" v-on:click="writeStatsSend()">Save stats</div>
      </div>
    </template>
    <template v-else>
      <div class="player-label-block right-side">
        <div class="action fake-button" v-on:click="back()">Back to filter</div>
        <div class="highlight fake-button">Stats against {{ characterToDisplay() }}</div>
        <div class="action fake-button" v-on:click="changeCharacterSend()">Change character</div>
      </div>
    </template>
  </div>
</template>

<script>
import { getCharacterVersus } from "../../services/icons.service";
export default {
  name: "PlayerDisplayBlock",
  props: {
    playerId: String,
    characters: Array,
    canChange: Boolean,
    side: String,
  },
  data() {
    return {
      displayKey: 0,
      writeFeedbackMessage: undefined,
    };
  },
  watch: {
    playerId: {
      handler: function () {
        this.displayKey++;
      },
      immediate: true,
    },
    characters: {
      handler: function () {
        this.displayKey++;
      },
      immediate: true,
    },
    side: {
      handler: function () {
        this.displayKey++;
      },
      immediate: true,
    },
  },
  methods: {
    characterToDisplay: function () {
      if (this.characters && this.characters.length >= 1) {
        let found = this.characters.find((char) => char.active === true);
        if (found) {
          return found.shortName;
        } else {
          return "Erreur";
        }
      }
      return "Erreur";
    },
    buttonLabel: function () {
      if (this.playerId) {
        return this.playerId;
      } else {
        return `Change character`;
      }
    },
    portraitClass: function () {
      return `portrait-${this.side}`;
    },
    backgroundPicture: function () {
      const path = getCharacterVersus(this.characterToDisplay(), this.side);
      return require(`@/${path}`);
    },
    writeStatsSend: function () {
      console.log("Clicked on write stats");
    },
    changeCharacterSend: function () {
      console.log("Clicked on change character");
    },
    back: function () {
      console.log("Clicked on back to filter");
    },
  },
};
</script>

<style scoped lang="scss">
.player-label-block {
  width: 100%;
  position: absolute;

  @media (min-width: 2000px) {
    bottom: 4%;
  }
  @media (max-width: 1999px) {
    bottom: 10%;
  }
  font-size: 1.6em;
  color: #c5c9cc;

  .highlight {
    font-size: 150%;
    font-weight: 800;
    color: #c5c9cc;
    background-color: rgb(40, 97, 99);
    text-align: center;
    font-size: 1.2em;
  }
  .action {
    margin-top: -0.3rem;
    width: 80%;
    font-weight: 600;
    color: #212529;
    background-color: #c5c9cc;
    font-size: 1.2em;
    cursor: pointer;
  }
  .info {
    margin-top: 0;
    width: 100%;
    font-weight: 100;
    color: #212529;
    background-color: #c5c9cc;
    font-size: 0.6em;
  }

  .fake-button {
    width: max-content;
    margin-left: auto;
    margin-right: auto;
    padding: 0.3em 0px;
    text-align: center;
    box-shadow: #212529 0.2em 0.2em 0.2em;
    opacity: 1;
    transition: opacity 0.1s ease-in-out 0s;
    position: relative;
    padding-left: 0.5em;
    padding-right: 0.5em;
  }
}
.left-side {
  left: 0px;
  margin-left: 2rem;
}
.right-side {
  right: 0px;
  margin-right: 2rem;
}

.portrait-left {
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0) radial-gradient(circle at center -30%, rgb(245, 46, 46), transparent) repeat scroll 0% 0%;
  .char-versus-picture {
    background-position: 75% 50%;
  }
}

.portrait-right {
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0) radial-gradient(circle at center -30%, rgb(84, 99, 255), transparent) repeat scroll 0% 0%;
  .char-versus-picture {
    background-position: 25% 50%;
  }
}

.char-versus-picture {
  content: " ";
  position: absolute;
  height: 100%;
  width: 100%;
  background-repeat: no-repeat;
  background-size: 100%;
}

</style>
