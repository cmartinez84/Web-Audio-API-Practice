// play a sound sound ONLY once
function playFrequency(f, t0, t1){
    console.log(f, t0, t1);
    var oscillator = self.audioContext.createOscillator();
    oscillator.type = "square";
    oscillator.frequency.value = f;
    oscillator.connect(self.audioContext.destination);
    oscillator.start(t0);
    oscillator.stop(t1);
}

//reuse a sound by messing with gain. can also be used with osc.connect()
function startOsc(bool) {
    if(bool === undefined) bool = true;

    if(bool === true) {
        g.gain.value = 1;
    } else {
        g.gain.value = 0;
    }
}
