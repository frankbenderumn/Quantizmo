import * as THREE from 'https://cdn.skypack.dev/three@0.119.0';
import { BoxLineGeometry } from 'https://cdn.skypack.dev/three/examples/jsm/geometries/BoxLineGeometry.js';
import { XRControllerModelFactory } from 'https://cdn.skypack.dev/three/examples/jsm/webxr/XRControllerModelFactory.js';
import { Scene } from './jsm/scene.js'
import { Raycast } from './jsm/raycast.js'
import * as Script from './jsm/script.js'

let container = document.getElementById( 'scene-container' );
let world;
let selector;
let focus;
let raycast;
let pointer = new THREE.Vector2(0, 0);
let mouseState = {
    left: false,
    middle: false,
    right: false
};
let modifier = {
    shift: false, // 16
    control: false, // 17
    alt: false // 18
};
let binaryCommand = {

};
let systemState = "default";
let stateCommand = {
    translate: false,
    rotate: false,
    scale: false,
    duplicate: false
};

async function main() {
    world = new Scene(container, "scene.json", false);
    await world.init();
    world.start();
    raycast = new Raycast(world.scene, world.camera);
}

// https://cdn.glitch.com/c308c431-814f-4930-8098-89fb892cc473%2Fjellyfish2_animated.glb?v=1574277583974

main();

function clearBinary() {
    for (const c in binaryCommand) {
        binaryCommand[c] = false;
    }
}

function clearManipulation() {
    for(const c in stateCommand) {
        stateCommand[c] = false;
    }
}
 
function changeManipulation(type) {
    clearManipulation();
    switch(type) {
        case "translate":
            stateCommand.translate = true;
            break;
        case "rotate":
            stateCommand.rotate = true;
            break;
        case "scale":
            stateCommand.scale = true;
            break;
    }
    console.log(stateCommand);
}

let press = function(e) {
    // api.sendCommand(e.type, {key: e.key, keyCode: e.keyCode});
    let keyCode = e.keyCode;
    if (focus) {

        switch(keyCode) {
            case 37: // left
                if (stateCommand.translate == true) {
                    focus.position.x -= 1;
                } else if (stateCommand.rotate == true) {
                    focus.rotation.y -= 0.11;
                }
                break;
            case 40: // back
                if (stateCommand.translate && !modifier.shift) {
                    focus.position.z += 1;
                } else if (stateCommand.rotate) {
                    focus.rotation.x -= 0.1;
                } else if (stateCommand.scale) {
                    focus.scale.x -= 0.1;
                    focus.scale.y -= 0.1;
                    focus.scale.z -= 0.1;
                } else if (modifier.shift && stateCommand.translate) {
                    focus.position.y -= 1;
                }
                break;
            case 39: // right
                if (stateCommand.translate) {
                    focus.position.x += 1;
                } else if (stateCommand.rotate) {
                    focus.rotation.y += 0.1;
                }
                break;
            case 38: // forward
                if (stateCommand.translate && !modifier.shift) {
                    focus.position.z -= 1;
                } else if (stateCommand.rotate) {
                    focus.rotation.x += 0.11;
                } else if (stateCommand.scale) {
                    focus.scale.x += 0.1;
                    focus.scale.y += 0.1;
                    focus.scale.z += 0.1;
                } else if (modifier.shift == true && stateCommand.translate == true) {
                    focus.position.y += 1;
                }
                break;
            case 71: // g
                console.log("grabbing");
                changeManipulation("translate");
                break;
            case 82: // r
                changeManipulation("rotate");
                break;
            case 83: // s
                changeManipulation("scale");
                break;
            case 16:
                console.log("SHIFT PRESSED");
                modifier.shift = true;
                break;
            case 17:
                modifier.control = true;
                break;
            case 18:
                modifier.alt = true;
                break;
            case 32:
                clearManipulation();
                break;
            case 80:
                world.changeScript();
                break;
            default: 
                break;
        }
    }
    // if (keyCode == 65) { // KeyA
    //     controls.move(0, -1);
    // } else if (keyCode == 83) { // KeyS
    //     controls.move(2, 1);
    // } else if (keyCode == 68) { // KeyD
    //     controls.move(0, 1);
    // } else if (keyCode == 87) { // KeyW
    //     controls.move(2, -1);
    // } else if (keyCode == 37) { // ArrowLeft
    //     controls.turn(0, -1);
    // } else if (keyCode == 39) { // ArrowRight
    //     controls.turn(0, 1);
    // } else if (keyCode == 38) { // ArrowUp
    //     controls.turn(1, -1);
    // } else if (keyCode == 40) { // ArrowDown
    //     controls.turn(1, 1);
    // }
  }
  
  let release = function(e) {
    // api.sendCommand(e.type, {key: e.key, keyCode: e.keyCode});
    let keyCode = e.keyCode;
    if (focus) { clearBinary(); 
        switch(keyCode) {
            case 16:
                modifier.shift = false;
                break;
            case 17:
                modifier.control = false;
                break;
            case 18:
                modifier.alt = false;
                break;
        }
    }
    // if (keyCode == 65) { // KeyA
    //     controls.clearMove(0, -1);
    // } else if (keyCode == 83) { // KeyS
    //     controls.clearMove(2, 1);
    // } else if (keyCode == 68) { // KeyD
    //     controls.clearMove(0, 1);
    // } else if (keyCode == 87) { // KeyW
    //     controls.clearMove(2, -1);
    // } else if (keyCode == 37) { // ArrowLeft
    //     controls.clearTurn(0, -2);
    // } else if (keyCode == 39) { // ArrowRight
    //     controls.clearTurn(0, 1);
    // } else if (keyCode == 38) { // ArrowUp
    //     controls.clearTurn(1, -1);
    // } else if (keyCode == 40) { // ArrowDown
    //     controls.clearTurn(1, 1);
    // }
  }

  $("#command-save").click(function(){
    world.save();
  });



  $("#command-stock").click(function(){
    world.stock();
  });

  // MOUSE HANDLER INPUT --------------------------------------------------------------------------

    document.onkeyup = release;

    document.onkeydown = press;

    let xMove = 0;
    let yMove = 0;
    let lastMove = new THREE.Vector2(0, 0);

    document.onmousemove = function(e) {
        // frame += 1;
        pointer.x = ( e.clientX / window.innerWidth );
        pointer.y = ( e.clientY / window.innerHeight );
        let newPoint = new THREE.Vector2(pointer.x, pointer.y);
        // let newDist = lastPoint.distanceTo(newPoint);
    
        if (mouseState.left) {
            xMove = 0;
            yMove = 0;
            // xMove = (pointer.x - lastPoint.x) / lastPoint.x;
            // yMove = (pointer.y - lastPoint.y) / lastPoint.y;
            // drag = true;
        } else if (mouseState.right) {
            // mouseMove = true; 
            // console.log("dragging");
            // console.log("y prev move is: "+ lastPoint.y);
            // console.log("y move is: "+ pointer.y);
            // let scaleFactor;
            // if (lastDist != 0) {
            //     scaleFactor = (newDist - lastDist) / lastDist;
            // } else {
            //     scaleFactor = 0;
            // }
            console.log("scale factor is: "+scaleFactor);
            controls.turnDragSpeed = controls.turnDragSpeed + scaleFactor;
    
            if (newPoint.x < lastPoint.x) {
                // controls.turn(0, -1);
                // controls.clearTurn(0, 1);
            } else {
                // controls.turn(0, -1);
                // controls.clearTurn(0, -1);
            }
    
            if (newPoint.y < lastPoint.y) {
                // controls.turn(1, -1);
                // controls.clearTurn(1, 1);
            } else {
                // controls.turn(1, 1);
                // controls.clearTurn(1, -1);
            }
    
            console.log("frame is: "+frame);
    
        } else {
            xMove = 0;
            yMove = 0;
        }
    
        // if (frame > 100) {
        //     lastPoint = new THREE.Vector2(pointer.x, pointer.y);
        //     frame = 0;
        //     lastDist = newDist; 
        //     lastPoint = newPoint;
        // }
    }

    document.onmouseup = function(e) {
        // raycast.clear();
        // raycast.cast();
        // if (dClick) {
        //     dClick = false;
        //     negMove[2] = 0;
        //     controls.clearMove(2, 0);
        // }
        if (mouseState.right) {
            mouseState.right = false;
            // controls.clearTurn(0, 1);
            // controls.clearTurn(0, -1);
            // controls.clearTurn(1, -1);
            // controls.clearTurn(1, 1);
        }
    
        // drag = false;
        mouseState.left = false;
    }
    document.onmousedown = function(e) {
        // if (e.which === 3 && !lClick) { // right mouse (l = 1, c = 2, r = 3)
        raycast.clear();
        console.log("mouse pressed");
        switch(e.which) {
            case 1:
                mouseState.left = true;
                console.log("CASTING");
                let x = ( e.clientX / window.innerWidth ) * 2 - 1;
                let y = - ( e.clientY / window.innerHeight ) * 2 + 1;
                raycast.pointer = new THREE.Vector2(x, y);
                let hit = raycast.cast();
                console.log(hit);
                focus = hit;
                break;
            case 2:
                mouseState.middle = true;
                break;
            case 3:
                mouseState.right = true;
                break;
            default:
                break;
        }

        // if (e.which === 3 && !mouseState.left) { // right mouse (l = 1, c = 2, r = 3)
        //     mouseState.right = true;
        //     let a = ( e.clientX / window.innerWidth );
        //     let b = ( e.clientY / window.innerHeight );
        //     lastPoint = new THREE.Vector2(a, b);
        // // } else if (e.which === 1 && rClick || e.which === 3 && lClick) {
        // //     dClick = true;
        // //     controls.move(2, -1);
        // } else if (e.which === 1 && !rClick) {
        //     mouseState.left = true;
        //     console.log("client x is: "+e.clientX);
        //     console.log("client y is: "+e.clientY);
        //     let a = ( e.clientX / window.innerWidth );
        //     let b = ( e.clientY / window.innerHeight );
        //     lastPoint = new THREE.Vector2(a, b);
        //     frame = 0;
        // }

    }

    $("#VRButton").click(function(){
        world.vr(true);
    });

// });

// let turnDragSpeed;
// let initTurnSpeed;
// let drag = false;
// let rClick = false;
// let lClick = false;
// // let scroll = false;
// let cClick = false;
// let dClick = false;
// let zoomScale = 1;
// let lastPoint = new THREE.Vector2(0, 0);
// let xMove = 0;
// let yMove = 0;
// let frame = 0;
// let lastDist = 0; 
// let mouseMove = false; 

// function cameraAngle() {
//     if (drag) {
//         controls.theta = controls.theta + 0.2 * xMove;
//         controls.phi = controls.phi + 0.2 * yMove;
//     } else if (mouseMove) {
//         controls.turnSpeed = turnDragSpeed;
//     } else {
//         initTurnSpeed = controls.turnSpeed;
//     }
//     // axle *= zoomScale;
//   }
  
//   let press = function(e) {
//     api.sendCommand(e.type, {key: e.key, keyCode: e.keyCode});
//     let keyCode = e.keyCode;
//     if (keyCode == 65) { // KeyA
//         controls.move(0, -1);
//     } else if (keyCode == 83) { // KeyS
//         controls.move(2, 1);
//     } else if (keyCode == 68) { // KeyD
//         controls.move(0, 1);
//     } else if (keyCode == 87) { // KeyW
//         controls.move(2, -1);
//     } else if (keyCode == 37) { // ArrowLeft
//         controls.turn(0, -1);
//     } else if (keyCode == 39) { // ArrowRight
//         controls.turn(0, 1);
//     } else if (keyCode == 38) { // ArrowUp
//         controls.turn(1, -1);
//     } else if (keyCode == 40) { // ArrowDown
//         controls.turn(1, 1);
//     }
//   }
  
//   let release = function(e) {
//     api.sendCommand(e.type, {key: e.key, keyCode: e.keyCode});
//     let keyCode = e.keyCode;
//     if (keyCode == 65) { // KeyA
//         controls.clearMove(0, -1);
//     } else if (keyCode == 83) { // KeyS
//         controls.clearMove(2, 1);
//     } else if (keyCode == 68) { // KeyD
//         controls.clearMove(0, 1);
//     } else if (keyCode == 87) { // KeyW
//         controls.clearMove(2, -1);
//     } else if (keyCode == 37) { // ArrowLeft
//         controls.clearTurn(0, -2);
//     } else if (keyCode == 39) { // ArrowRight
//         controls.clearTurn(0, 1);
//     } else if (keyCode == 38) { // ArrowUp
//         controls.clearTurn(1, -1);
//     } else if (keyCode == 40) { // ArrowDown
//         controls.clearTurn(1, 1);
//     }
//   }

// VOICE FUNCTIONALITY --------------------------------------------------------------------------

let api = new WSApi();
// if (!('webkitSpeechRecognition' in window)) {
// 	upgrade();
// }
var recognizing;
var recognition = new webkitSpeechRecognition();
recognition.continuous = true;
recognition.interimResults = true;
let timeout = null;

document.addEventListener("DOMContentLoaded", function(){


reset();
recognition.onend = reset;

function sendSpeech(final) {
    console.log("====> sending speech: "+final);
    let o = {
        text: final
    };
    api.setScene(world);
    api.sendCommand("speech", o).then(function(data){
        console.log("87678787878787");
        console.log(data);
    });
    world.killJarvis();
}

recognition.onresult = function (event) {
    var final = "";
    var interim = "";
    for (var i = 0; i < event.results.length; ++i) {
    if (event.results[i].isFinal) {
        final += event.results[i][0].transcript;
    } else {
        console.warn(event.results[i][0].transcipt);
        if (event.results[i][0].transcript.includes("Jarvis")) {
            world.launchJarvis();
            console.log("calling jarvis < --------");
        }
        interim += event.results[i][0].transcript;
    }
    }
    let final_span = document.getElementById("final_span");
    final_span.innerHTML = final;
    let interim_span = document.getElementById("interim_span");
    interim_span.innerHTML = interim;

    clearTimeout(timeout);

    timeout = setTimeout(function(){sendSpeech(final)}, 1000);
}

function reset() {
    recognizing = false;
    let buttonv = document.getElementById("voice-button");
    console.log("refactoring pains --");
    console.log(buttonv);
    buttonv.innerHTML = "Click to Speak";
}

$("#voice-button").click(function(){
    toggleVoice();
});

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

$.fn.display = (msg) => {
    // console.log(msg);
    switch (msg.notification.type) {
      case "alert":
        $.fn.notify(2, msg.notification.data);
        break;
      case "battery":
        $.fn.batteryPanel(msg.notification.data);
        break;
      case "statistics":
        break;
      case "stock":
        console.log("====> STOCK IN FRONTO <====");
        console.log(msg.notification.data);
        $.fn.notify(2, msg.notification.data.companyName);
        $.fn.notify(2, msg.notification.data.iexOpen);
        stockModal(msg.notification.data);
        world.graph(msg.notification.data);
        break;
    }
  }

  function stockModal(data) {
    let modal = document.createElement("div");
    modal.className = "slim modal";
    let shell = document.createElement("div");
    // change to modal-shell naming convention
    shell.className = "slim modal-box";
    shell.style.padding = "0px";
    let header = document.createElement("div");
    header.className = "header";
    header.style.padding = "5px";
    header.innerHTML = data.companyName;
    let content = document.createElement("div");
    content.style.padding = "5px";
    content.innerHTML = data.iexOpen + "<br>";
    content.innerHTML += data.change + "<br>";
    content.innerHTML += data.averageTotalVolume + "<br>";
    shell.append(header);
    shell.append(content);
    modal.append(shell);
    document.body.append(modal);
    modal.style.display = 'block';
  }

$("li[data-role=scene-trigger]").click(function(){
    let target = $(this).attr('href');
    console.log(`target clicked is ${target}`);
    $("#current-scene").attr('data-value', target);
    world.changeScript(`${target}.json`);
});