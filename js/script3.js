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





var audioContext = audioContextCheck();
osc = audioContext.createOscillator();
var filter = audioContext.createBiquadFilter();

osc.type = "sawtooth";
osc.frequency.value = 300;
// Q is bandwidth
filter.type="lowpass";
filter.Q.value = 800;
filter.frequency.value = 250;


var gainOsc = audioContext.createGain();
gainOsc.gain.value = 1;
gainOsc.connect(filter);
// osc.connect(gainOsc);
// gainOsc.connect(audioContext.destination);
filter.connect(audioContext.destination);
osc.start(audioContext.currentTime);
