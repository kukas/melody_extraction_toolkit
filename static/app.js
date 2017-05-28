import Vue from 'vue';
import PianoRoll from './components/PianoRoll';

// I don't know how to export a constant :(
window.app = new Vue({
  el: '#app',
  components: {
    'piano-roll': PianoRoll,
  },
  mounted () {
      this.player.addEventListener("canplaythrough", (e) => {
        this.audioLoaded = true;
      });

      this.player.addEventListener("timeupdate", (e) => {
        this.currentTime = this.player.currentTime;
      });

      this.player.src = this.audioSrc;
  },
  watch: {
    'audioSrc': _.debounce(function () {
      this.player.src = this.audioSrc;
      this.audioLoaded = false;
    }, 150),
  },
  data: {
    audioSrc: "/datasets/Orchset/audio/mono/Beethoven-S3-I-ex5.wav",
    referenceSrc: "/datasets/Orchset/GT/Beethoven-S3-I-ex5.mel",
    estimationSrc: "",

    player: new Audio(),
    currentTime: 0,
    audioLoaded: false,
  }
})
