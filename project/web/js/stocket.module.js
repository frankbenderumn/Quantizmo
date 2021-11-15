import * as THREE from 'https://cdn.skypack.dev/three@0.119.0';
import { BoxLineGeometry } from 'https://cdn.skypack.dev/three/examples/jsm/geometries/BoxLineGeometry.js';
import { XRControllerModelFactory } from 'https://cdn.skypack.dev/three/examples/jsm/webxr/XRControllerModelFactory.js';
import { Scene } from './modules/scene.js'

let container = document.getElementById( 'scene-container' );
let world;

async function main() {
    world = new Scene(container, "umn.json", true);
    world.init().then(function(e){
        world.start();
    });
}

// https://cdn.glitch.com/c308c431-814f-4930-8098-89fb892cc473%2Fjellyfish2_animated.glb?v=1574277583974

main();

$(document).ready(function(){
    document.onkeyup = function(e) {
        console.log(e.keyCode);
    }
    document.onkeydown = function(e) {
        console.log(e.keyCode);
    }
    $("#VRButton").click(function(){
        world.vr(true);
    });

});