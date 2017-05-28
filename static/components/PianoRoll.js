import axios from 'axios';
import _ from 'lodash'

export default {
  template: '#piano-roll',
  props: {
    referenceSrc: String,
    audio: HTMLAudioElement
  },

  data () {
    return {
      width: window.innerWidth-16,
      height: window.innerHeight-200,
      freqMin: 27.5000,
      freqMax: 1000,
      timeScale: 100,
      a4pitch: 440,
      notes: []
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
      this.getNotesDebounced();
    }
  },

  mounted () {
    this.ctx = this.$refs.canvas.getContext("2d");

    this.audio.addEventListener("canplaythrough", (e) => {
      this.fitScale();
    });

    // load default files
    this.getNotesDebounced();

    this.render();
  },

  methods: {
    // debounce the function to prevent unnecessary queries on server
    getNotesDebounced: _.debounce(function () {
      axios.get(this.referenceSrc)
        .then(res => {
          if(res.status === 200){
            this.notes = this.parseFreqs(res.data);
            this.resetRange();
          }
        })
        .catch(error => {
          // TODO: prettier error catching
          console.error(error);
        });
    }, 150),

    parseFreqs(plaintext){
      let notes = [];
      const lines = plaintext.split("\n");

      lines.forEach((line) => {
        if(!line)
          return true;
        line = line.split(/\s+/, 2);
        line[0] = parseFloat(line[0]);
        line[1] = parseFloat(line[1]);
        if(line[1] == 0)
          return true;

        notes.push(line);
      });

      return notes;
    },

    resetRange(){
      // takes the second value in time-frequency tuples
      var freqs = _.map(this.notes, 1);
      this.freqMin = _.min(freqs);
      this.freqMax = _.max(freqs);
    },

    fitScale(){
      this.timeScale = this.width/this.audio.duration;
    },

    freqToNote(freq){
      return 12*Math.log(freq/this.a4pitch)/Math.log(2)+49;
    },

    render () {
      window.requestAnimationFrame(this.render)

      const ctx = this.ctx;

      ctx.clearRect(0, 0, this.width, this.height);

      const pianoKeysWidth = 20;

      const noteMin = Math.max(0, this.noteMin-2);
      const noteMax = this.noteMax+1;

      const noteRange = noteMax-noteMin;
      const noteHeight = this.height/noteRange;

      const blackKeys = [2, 5, 7, 10, 12];
      var noteNames = ["A", "A#", "H", "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#"];

      let noteY = i => this.height-(i+1)*noteHeight

      // white and gray rows
      ctx.save();
      ctx.translate(0, (noteMin-Math.floor(noteMin))*noteHeight);
      for (let i = 0; i < Math.ceil(noteRange); i++) {
        ctx.fillStyle = (Math.floor(noteMin)+i)%2==0 ? "#fff" : "#eee";
        ctx.fillRect(0, noteY(i), this.width, noteHeight);
      }
      ctx.restore();

      ctx.save();
      ctx.translate(pianoKeysWidth, 0);

      const currentTimeScaled = this.audio.currentTime*this.timeScale;
      if(currentTimeScaled > this.width/2){
        ctx.translate(Math.round(-currentTimeScaled+this.width/2), 0);
      }

      let noteWidth = 1;
      if(this.notes.length >= 2){
        noteWidth = Math.ceil((this.notes[1][0]-this.notes[0][0])*this.timeScale);
      }

      this.notes.forEach(([time, freq]) => {
        time *= this.timeScale;
        time = Math.floor(time);
        ctx.fillStyle = "#00dd5c";
        let noteY = this.height-(this.freqToNote(freq)-noteMin)*noteHeight;
        ctx.fillRect(time, noteY, noteWidth, noteHeight);


        if(noteY > this.height || noteY < 0){
          ctx.fillStyle = "#800";
          ctx.fillRect(time, Math.max(0, Math.min(this.noteY, this.height))-2, noteWidth, 5);
        }
      });

      ctx.fillStyle = "#ff0000";
      ctx.fillRect(currentTimeScaled, 0, 3, this.height);

      ctx.restore();

      // piano keyboard
      ctx.save();
      ctx.translate(0, (noteMin-Math.floor(noteMin))*noteHeight);
      for (let i = 0; i < Math.ceil(noteRange); i++) {
        const note = Math.floor(noteMin)+i-1;
        const octave = note/12;
        const noteInOctave = note%12;
        const isBlackKey = blackKeys.indexOf(noteInOctave+1)===-1;

        ctx.fillStyle = isBlackKey ? "#fff" : "#000";
        ctx.fillRect(0, noteY(i), pianoKeysWidth, noteHeight);

        ctx.fillStyle = isBlackKey ? "#000" : "#fff";
        if(noteInOctave == 0)
          ctx.fillText(noteNames[noteInOctave]+octave, 2, noteY(i)+noteHeight-2);
      }
      ctx.restore();
    }

  }
}