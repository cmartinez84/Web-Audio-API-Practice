// uses audioContextCheck() from scrip3
var audioContext = audioContextCheck();
var audioBuffer;

var getSound = new XMLHttpRequest();
//true sets it to async
// getSound.open("new", "http://soundjax.com/reddo/26239%5ESNARE_3.mp3", true);
getSound.open("get", "sounds/snare.mp3", true);
getSound.responseType = "arraybuffer";
//a general container for binary data;
getSound.onload = function(){
  audioContext.decodeAudioData(getSound.response, function(buffer){
    audioBuffer = buffer;
  })
}

getSound.send();

window.addEventListener("mousedown", playback);

function playback(){
  var playSound = audioContext.createBufferSource();
  playSound.buffer = audioBuffer;
  playSound.connect(audioContext.destination);
  playSound.start(audioContext.currentTime);
}
