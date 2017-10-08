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
//when using gain Osc, must create gain node as intermediary between .connect and destination
var gainOsc = audioContext.createGain();
gainOsc.gain.value = .3;
console.log(gainOsc);
//oscillators are intended to be thrown away affter each use
var osc = audioContext.createOscillator();
osc.type = "triangle";
//frequeny changes pitch
osc.frequency.value = 500;
//mediatr
// osc.detune.value = 3
// connect method allows us to connect to different audio input and outputs in the web audio API. These in puts and outputs are called ndoes
// osc.connect(audioContext.destination);
osc.start(audioContext.currentTime);
osc.connect(gainOsc);
gainOsc.connect(audioContext.destination);


//keep this around fo r awhile. replaced with new oscillators
// osc.disconnect();
//stop and restart later on
// osc.stop()

console.log(audioContext);
