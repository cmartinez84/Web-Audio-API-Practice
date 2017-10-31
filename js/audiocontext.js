function audioContextCheck(){
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
var audioContext = audioContextCheck();
