// Equalizer Demo
// osc -> gain -> filter
//filter keeps playing after you disconnect osc....?


const startButton = document.querySelector('#start');
const stopButton = document.querySelector('#stop');

var osc;

startButton.addEventListener('click', ()=>{
  osc.connect(gainOsc);
});


stopButton.addEventListener('click', ()=>{
  osc.disconnect();
});


function audioContextContext(){
  if(typeof AudioContext !== "undefined"){
    return new AudioContext();
  }
  else if(typeof webAudioContext !=="undefined"){
    return new mozAudioContext();
  }
  else if (typeof mozAudioContext() !=="undefined"){
    return new mozAudioContext;
  }
  else{
    return new Error('Bummer. Update your shit');
  }
}

var audioContext = audioContextContext();
osc = audioContext.createOscillator();
var filter = audioContext.createBiquadFilter();

osc.type = "sawtooth";
osc.frequency.value = 300;
// Q is bandwidth
filter.type="lowpass";
filter.Q.value = 800;
filter.frequency.value = 250;

console.log(filter);

var gainOsc = audioContext.createGain();
gainOsc.gain.value = 1;
gainOsc.connect(filter);
// osc.connect(gainOsc);
console.log(audioContext);
// gainOsc.connect(audioContext.destination);
filter.connect(audioContext.destination);
osc.start(audioContext.currentTime);
