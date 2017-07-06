import axios from 'axios';
import _ from 'lodash'

export default {
  template: '#file-upload',
  props: {
    referenceSrc: String,
    estimationSrc: String,
    audio: HTMLAudioElement
  },

  data () {
    return {
      width: window.innerWidth-16,
      height: window.innerHeight-200,
      freqMin: 27.5000,
      freqMax: 1000,
      timeScale: 100,
      minTimeScale: 0,
      a4pitch: 440,
      reference: [],
      estimation: [],
    }
  },

  computed: {
    noteMin () {
      return this.freqToNote(this.freqMin);
    },
    noteMax () {
      return this.freqToNote(this.freqMax);
    },
  },

  watch: {
    referenceSrc (newFile) {
      this.loadReference();
    }
  },

  methods: {
    onFileChange (e) {
      const files = e.target.files;
      if (!files.length)
        return;

      const file = files[0];
      let reader = new FileReader();

      // load locally
      reader.onload = (e) => {
        // this.player.src = e.target.result;
        this.$emit("player-source-change", e.target.result);
      };
      reader.readAsDataURL(file);

      // send to server (for estimations)
      let data = new FormData();
      data.append("file", file, file.name);
      const config = {
        onUploadProgress: function (progressEvent) {
          console.log(progressEvent);
        }
      };
      axios.post('/upload', data, config)
        .then(res => {
          if(res.status === 200){
            console.log(200, res.data);
            const audioSrc = "upload/"+res.data;
            this.$emit("audio-source-change", audioSrc);
            this.$emit("reference-source-change", "");
            // this.algorithms = res.data;
          }
          else {
            console.log(res);
          }
        })
        .catch(error => {
          // TODO: prettier error catching
          console.error(error);
        });
    }
  }
}