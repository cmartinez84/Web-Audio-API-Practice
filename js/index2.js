d var startButton = document.querySelector('#start');
var stopButton = document.querySelector('#stop');
var frequencyRange = document.querySelector("#frequency");
var oscType = document.querySelector("#oscType");
var filter = audioContext.createBiquadFilter();

//dom controls
startButton.addEventListener('click', ()=>          osc.connect(audioContext.destination));
stopButton.addEventListener('click', ()=> osc.disconnect() )
frequencyRange.addEventListener('change', handleFrequency);
oscType.addEventListener('change', handleOscType);

//osc config
var osc = audioContext.createOscillator();
osc.start(audioContext.currentTime);
filter.type = "lowpass";
filter.Q.value = 800;
filter.frequency.value = 250;


//dom functions
function handleFrequency(){
  osc.frequency.value = this.value;
  console.log(osc.frequency);
}

function handleOscType(){
  osc.type = this.value;
  console.log(osc.type);
}
