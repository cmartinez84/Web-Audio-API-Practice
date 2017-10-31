navigator.getUserMedia =
  navigator.getUserMedia ||
  navigator.webkitGetUserMedia ||
  navigator.mozGetUserMedia ||
  navigator.msGetUserMedia;

// URL shim
window.URL = window.URL || window.webkitURL;

// audio context + .createScriptProcessor shim

var audioContext = new AudioContext;
if (audioContext.createScriptProcessor == null)
  audioContext.createScriptProcessor = audioContext.createJavaScriptNode;


var processor = undefined;

var microphone = null;
var microphoneLevel = audioContext.createGain();
microphoneLevel.gain.value = 1;

function start(){
  console.log("boom");
  if (microphone == null)
    navigator.getUserMedia({ audio: true },
      function(stream) {
        microphone = audioContext.createMediaStreamSource(stream);
        microphone.connect(microphoneLevel);
      },
      function(error) {
        // $microphone[0].checked = false;
        window.alert("Could not get audio input.");
      });
}

//_______________________________Buffer Set up_____________________________________________________
var encodingProcess = 'separate';       // separate | background | direct


// processor buffer size
var BUFFER_SIZE = [256, 512, 1024, 2048, 4096, 8192, 16384];

var defaultBufSz = (function() {
  processor = audioContext.createScriptProcessor(undefined, 2, 2);
  return processor.bufferSize;
})();

var iDefBufSz = BUFFER_SIZE.indexOf(defaultBufSz);

// $bufferSize[0].valueAsNumber = iDefBufSz;   // initialize with browser default
// var bufferSize = iDefBufSz;

//......convert to vanilla JS
// function updateBufferSizeText() {
//   var iBufSz = $bufferSize[0].valueAsNumber,
//       text = "" + BUFFER_SIZE[iBufSz];
//   if (iBufSz === iDefBufSz)
//     text += ' (browser default)';
//   $('#buffer-size-text').html(text);
// }

// updateBufferSizeText();         // initialize text

// $bufferSize.on('input', function() { updateBufferSizeText(); });


//_______________________________save/delete recording_____________________________________________________

function saveRecording(blob) {
  var time = new Date(),
      url = URL.createObjectURL(blob);

  var audio = document.createElement('AUDIO');
      audio.controls = true;
      audio.src=url;

  var link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', "recording");
      link.innerHTML="download";

  var recordingDiv = document.querySelector('#recording');
  recordingDiv.appendChild(link);
  recordingDiv.appendChild(audio);
}

//_______________________________Recording Process____________________________________________________

var worker = new Worker('js/wavencoder/EncoderWorker.js'),
    encoder = undefined;        // used on encodingProcess == direct

worker.onmessage = function(event) { saveRecording(event.data.blob); };

function getBuffers(event) {
  var buffers = [];
  for (var ch = 0; ch < 2; ++ch)
    buffers[ch] = event.inputBuffer.getChannelData(ch);
  return buffers;
}

function startRecordingProcess() {
  var bufSz = BUFFER_SIZE[iDefBufSz];
  processor = audioContext.createScriptProcessor(bufSz, 2, 2);
  microphoneLevel.connect(processor);
  processor.connect(audioContext.destination);
  if (encodingProcess === 'direct') {
    encoder = new WavAudioEncoder(audioContext.sampleRate, 2);
    processor.onaudioprocess = function(event) {
      encoder.encode(getBuffers(event));
    };
  } else {
    worker.postMessage({
      command: 'start',
      process: encodingProcess,
      sampleRate: audioContext.sampleRate,
      numChannels: 2
    });
    processor.onaudioprocess = function(event) {
      worker.postMessage({ command: 'record', buffers: getBuffers(event) });
    };
  }
}

function stopRecordingProcess(finish) {
  microphoneLevel.disconnect();
  processor.disconnect();
  // console.log(finish);
  if (encodingProcess === 'direct')
    if (finish)
      saveRecording(encoder.finish());
    else
      encoder.cancel();
  else
    worker.postMessage({ command: finish ? 'finish' : 'cancel' });
}

// recording buttons interface
var startTime = null    // null indicates recording is stopped

function minSecStr(n) { return (n < 10 ? "0" : "") + n; }

function updateDateTime() {
}

window.setInterval(updateDateTime, 200);

function startRecording() {
  startTime = Date.now();
  startRecordingProcess();
}

function stopRecording(finish) {
  startTime = null;
  stopRecordingProcess(true);
}
