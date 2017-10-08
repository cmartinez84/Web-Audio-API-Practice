// "use strict"
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

var osc1 = audioContext.createOscillator();
osc1.type = "sawtooth";
osc1.frequency.value = 300;
osc1.detune = 39;

var osc2 = audioContext.createOscillator();
osc2.type = "sawtooth";
osc2.frequency.value = 299.9;

var gainOsc1 = audioContext.createGain();
var gainOsc2 = audioContext.createGain();
var gainMix = audioContext.createGain();

gainOsc1.gain.value = .3;
gainOsc2.gain.value = .3;
gainMix.gain.value = .7

// gainOsc3.gain.value = .5;

osc1.connect(gainOsc1);
osc2.connect(gainOsc2)
gainOsc1.connect(gainMix);
gainOsc2.connect(gainMix);
gainMix.connect(audioContext.destination);
osc1.start(audioContext.currentTime);
osc2.start(audioContext.currentTime);

console.log(audioContext);
