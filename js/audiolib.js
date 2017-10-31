function audioFileLoader(fileDirectory) {
    var soundObj = {};
    soundObj.fileDirectory = fileDirectory;

    var getSound = new XMLHttpRequest();
    getSound.open("GET", soundObj.fileDirectory, true);
    getSound.responseType = "arraybuffer";
    getSound.onload = function() {
        audioContext.decodeAudioData(getSound.response, function(buffer) {
            soundObj.soundToPlay = buffer;
        });
    }

    getSound.send();

    soundObj.play = function(timeVal) {
        var playSound = audioContext.createBufferSource();
        playSound.buffer = soundObj.soundToPlay;
        playSound.connect(audioContext.destination)
        playSound.start(timeVal)
    }

    return soundObj;

}


// exampels usingi other nodes with buffer
// function audioFileLoader(fileDirectory){
//   var soundObj = {};
//   soundObj.fileDirectory = fileDirectory;
//
//   var getSound = new XMLHttpRequest();
//   getSound.open("get", soundObj.fileDirectory, true);
//   getSound.responseType = "arraybuffer";
//   //a general container for binary data;
//   getSound.onload = function(){
//     audioContext.decodeAudioData(getSound.response, function(buffer){
//       soundObj.soundToPlay = buffer;
//     })
//   }
//   getSound.send();
//   soundObj.play = function(volumeVal, pitchVal){
//     var volume = audioContext.createGain();
//     volume.gain.value = volumeVal;
//     var playSound = audioContext.createBufferSource();
//     playSound.playbackRate.value = pitchVal;
//     playSound.buffer = soundObj.soundToPlay;
//     playSound.connect(volume);
//     volume.connect(audioContext.destination);
//     playSound.start(audioContext.currentTime);
//   }
//   return soundObj;
// }
//
// var snare = audioFileLoader("snare.mp3");
// window.addEventListener("mousedown", ()=>{snare.play(1, 1)}, false);
//
//
//
