import Vue from 'vue';
import axios from 'axios';

import PianoRoll from './components/PianoRoll';

// I don't know how to export a constant :(
window.app = new Vue({
  el: '#app',
  data: {
    audioSrc: "/datasets/Orchset/audio/mono/Beethoven-S3-I-ex5.wav",
    referenceSrc: "/datasets/Orchset/GT/Beethoven-S3-I-ex5.mel",
    estimationSrc: "",

    player: new Audio(),
    currentTime: 0,
    audioLoaded: false,

    datasets: [],
    currentDataset: false,
    currentClip: false,
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
  },
  watch: {
    'audioSrc': _.debounce(function () {
      this.player.src = this.audioSrc;
      this.audioLoaded = false;
    }, 150),

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
            console.log(res.data);
            this.datasets = res.data;
            // this.notes = this.parseFreqs(res.data);
            // this.resetRange();
          }
        })
        .catch(error => {
          // TODO: prettier error catching
          console.error(error);
        });
    }
  }
})
