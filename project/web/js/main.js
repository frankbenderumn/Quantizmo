import * as THREE from 'https://cdn.skypack.dev/three@0.119.0';
import { BoxLineGeometry } from 'https://cdn.skypack.dev/three/examples/jsm/geometries/BoxLineGeometry.js';
import { XRControllerModelFactory } from 'https://cdn.skypack.dev/three/examples/jsm/webxr/XRControllerModelFactory.js';
import { Scene } from './modules/scene.js'
import { Raycast } from './modules/raycast.js'

let container = document.getElementById( 'scene-container' );
let world;
let selector;
let focus;
let raycast;
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
    world = new Scene(container, "umn.json", false);
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

// $(document).ready(function(){
    document.onkeyup = release;

    document.onkeydown = press;

    document.onmouseup = function(e) {
        // raycast.clear();
        // raycast.cast();
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
    }

    $("#VRButton").click(function(){
        world.vr(true);
    });

// });