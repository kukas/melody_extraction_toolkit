import Vue from 'vue';
import axios from 'axios';

import PianoRoll from './components/PianoRoll';

// I don't know how to export a constant :(
window.app = new Vue({
  el: '#app',
  data: {
    audioSrc: "/datasets/Orchset/audio/mono/Beethoven-S3-I-ex5.wav",
    referenceSrc: "/datasets/Orchset/GT/Beethoven-S3-I-ex5.mel",

    player: new Audio(),
    currentTime: 0,
    audioLoaded: false,

    datasets: [],
    currentDataset: false,
    currentClip: false,

    algorithms: [],
    currentAlgorithm: false
  },
  computed: {
    estimationSrc () {
      if(this.currentAlgorithm && this.currentDataset && this.currentClip)
        return "/getEstimation/"+this.currentAlgorithm+"/"+this.currentDataset.id+"/"+this.currentClip.audio;

      return "";
    }
  },
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

      this.loadDatasets();
      this.loadAlgorithms();
  },
  watch: {
    audioSrc () {
      this.player.src = this.audioSrc;
      this.audioLoaded = false;
    },

    currentClip () {
      this.audioSrc = "datasets/"+this.currentDataset.id+"/"+this.currentClip.audio;
      this.referenceSrc = "datasets/"+this.currentDataset.id+"/"+this.currentClip.ref;
    }
  },
  methods: {
    loadDatasets () {
      axios.get("/getDatasets")
        .then(res => {
          if(res.status === 200){
            this.datasets = res.data;
          }
        })
        .catch(error => {
          // TODO: prettier error catching
          console.error(error);
        });
    },
    loadAlgorithms () {
      axios.get("/getAlgorithms")
        .then(res => {
          if(res.status === 200){
            this.algorithms = res.data;
          }
        })
        .catch(error => {
          // TODO: prettier error catching
          console.error(error);
        });
    },
    updateEstimation () {
      this.$refs.pianoRoll.loadEstimation();
    },
  }
})
