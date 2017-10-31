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

//_______________________________Butter Set up_____________________________________________________
var encodingProcess = 'separate';       // separate | background | direct

// $encodingProcess.click(function(event) {
//   encodingProcess = $(event.target).attr('mode');
// });

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
      url = URL.createObjectURL(blob),
      html = "<p recording='" + url + "'>" +
             "<audio controls src='" + url + "'></audio> " +
             time +
             " <a class='btn btn-default' href='" + url +
                  "' download='recording.wav'>" +
             "Save...</a> " +
             "<button class='btn btn-danger' recording='" +
                      url + "'>Delete</button>" +
             "</p>";

      audio = document.createElement('AUDIO');
      audio.controls = true;
      audio.src=url;

  // $recordingList.prepend($(html));
  var body = document.querySelector('body');
  // console.log(url);
  body.appendChild(audio);
}


// $recordingList.on('click', 'button', function(event) {
//   var url = $(event.target).attr('recording');
//   $("p[recording='" + url + "']").remove();
//   URL.revokeObjectURL(url);
// });

// recording process
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
  // $dateTime.html((new Date).toString());
  // if (startTime != null) {
  //   var sec = Math.floor((Date.now() - startTime) / 1000);
  //   $timeDisplay.html(minSecStr(sec / 60 | 0) + ":" + minSecStr(sec % 60));
  // }
}

window.setInterval(updateDateTime, 200);

// function disableControlsOnRecord(disabled) {
  // if (microphone == null)
  //   $microphone.attr('disabled', disabled);
  // $bufferSize.attr('disabled', disabled);
  // $encodingProcess.attr('disabled', disabled);
// }

function startRecording() {
  startTime = Date.now();
  // $recording.removeClass('hidden');
  // $record.html('STOP');
  // $cancel.removeClass('hidden');
  // disableControlsOnRecord(true);
  startRecordingProcess();
}

function stopRecording(finish) {
  startTime = null;
  // $timeDisplay.html('00:00');
  // $recording.addClass('hidden');
  // $record.html('RECORD');
  // $cancel.addClass('hidden');
  // disableControlsOnRecord(false);
  stopRecordingProcess(true);
}

// $record.click(function() {
//   if (startTime != null)
//     stopRecording(true);
//   else
//     startRecording();
// });
//
// $cancel.click(function() { stopRecording(false); });
