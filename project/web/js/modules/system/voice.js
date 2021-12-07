let api = new WSApi();
// if (!('webkitSpeechRecognition' in window)) {
// 	upgrade();
// }
var recognizing;
var recognition = new webkitSpeechRecognition();
recognition.continuous = true;
recognition.interimResults = true;
let timeout;

document.addEventListener("DOMContentLoaded", function(){


reset();
recognition.onend = reset;

function sendSpeech(final) {
    console.log("====> sending speech: "+final);
    let o = {
        text: final
    };
    api.sendCommand("speech", o);
}

recognition.onresult = function (event) {
    var final = "";
    var interim = "";
    for (var i = 0; i < event.results.length; ++i) {
    if (event.results[i].isFinal) {
        final += event.results[i][0].transcript;
    } else {
        interim += event.results[i][0].transcript;
    }
    }
    let final_span = document.getElementById("final_span");
    final_span.innerHTML = final;
    let interim_span = document.getElementById("interim_span");
    interim_span.innerHTML = interim;

    if(timeout) {
        clearTimeout(timeout);
        timeout = null;
    }
    timeout = setTimeout(sendSpeech(final), 5000);
}

function reset() {
    recognizing = false;
    let buttonv = document.getElementById("voice-button");
    console.log("refactoring pains --");
    console.log(buttonv);
    buttonv.innerHTML = "Click to Speak";
}

});

function toggleVoice() {
    if (recognizing) {
        recognition.stop();
        reset();
    } else {
        recognition.start();
        console.log("listening");
        recognizing = true;
        let button = document.getElementById("voice-button");
        button.innerHTML = "Click to Stop";
        let final_span = document.getElementById("final_span");
        final_span.innerHTML = "";
        let interim_span = document.getElementById("interim_span");
        interim_span.innerHTML = "";
    }
}