"user strict";
var isPlaying = false;

var kick = audioFileLoader('sounds/kick.mp3');
var tempo = 120;
var current16thNote = 1;
var futureTickTime = 0.0;
var timerID = 0;
var playButton = document.querySelector('#startDrum');
playButton.addEventListener('click', play);
//_______________________________________________________________
var track =[1, 3, 9];
//

//_______________________________________________________________
function futureTick(){
  var secondsPerBeat = 60/ tempo;
  futureTickTime += 0.25 * secondsPerBeat;
  current16thNote ++;
  current16thNote  > 16  ? current16thNote = 1: '';
}

//_______________________________________________________________
function scheduleNote(beatDivisionNumber, time){
  track.includes(beatDivisionNumber) ? kick.play(): '';
}

function scheduler(){
  while(futureTickTime < audioContext.currentTime + 0.1){
    scheduleNote(current16thNote, futureTickTime);
    futureTick();
  }
  timerID = window.setTimeout(scheduler, 50);
}

function play(){
  isPlaying = !isPlaying;

  if(isPlaying){
    current16thNote = 1;
    futureTickTime = audioContext.currentTime;
    scheduler();
    return "stop";
  }
  else{
    window.clearTimeout(timerID);
    return   "play";
  }
}
