// include * as Nebula from './modules/scene.js';


import * as THREE from 'https://cdn.skypack.dev/three@0.119.0';
import { BoxLineGeometry } from 'https://cdn.skypack.dev/three/examples/jsm/geometries/BoxLineGeometry.js';
import { VRButton } from 'https://cdn.skypack.dev/three/examples/jsm/webxr/VRButton.js';
import { XRControllerModelFactory } from 'https://cdn.skypack.dev/three/examples/jsm/webxr/XRControllerModelFactory.js';
import { CSS3DRenderer, CSS3DObject } from 'https://cdn.skypack.dev/three/examples/jsm/renderers/CSS3DRenderer.js';
import { TWEEN } from 'https://cdn.skypack.dev/three/examples/jsm/libs/tween.module.min.js';
import { TrackballControls } from 'https://cdn.skypack.dev/three/examples/jsm/controls/TrackballControls.js';
import { OrbitControls } from 'https://cdn.skypack.dev/three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'https://cdn.skypack.dev/three/examples/jsm/loaders/GLTFLoader.js';
let scrollEvent = function(e) {
    // e.preventDefault();
    // scale += e.deltaY * -0.01;
    // // Restrict scale
    // scale = Math.min(Math.max(.125, scale), 4);
    console.log("zoom scale is: ");
    // zoomScale = scale;
    
    // Apply scale transform
    // el.style.transform = `scale(${scale})`;
}

document.body.addEventListener('scroll', scrollEvent);
let onProgress = function(xhr) {
    if ( xhr.lengthComputable ) {
        const percentComplete = xhr.loaded / xhr.total * 100;
        console.log( Math.round( percentComplete, 2 ) + '% downloaded' );
        if (percentComplete == 100) {
        console.log("Model loaded");
        }
    }
};

// encrypt for security
let modelsDir = "../assets/models2/";

let link = false;
let touched = [];
let negMove = [0, 0, 0];
let posMove = [0, 0, 0];
let negTurn = [0, 0];
let posTurn = [0, 0];
let container = document.getElementById( 'scene-container' );
let camera, scene, raycaster, renderer, cssRenderer, controls;
let num = 10;
let rows = 5;
let cols = 7;
let models = [];
let mixers = [];
let INTERSECTED;
const pointer = new THREE.Vector2(0, 0);

let onError = function() { console.log("failed to load model"); };

let glbLoader = new GLTFLoader();
// could be beneficial to switch to async loader and await models
function load(scene, models, mixers, params) {
    console.log(`${params.name} at ${modelsDir}${params.path} attempting to be loaded`);
    glbLoader.load( `${modelsDir}${params.path}`, function (obj) {
    
        let model = obj.scene;
    
        model.position.copy(new THREE.Vector3(params.position[0], params.position[1], params.position[2]))
        model.scale.copy(new THREE.Vector3(params.scale[0], params.scale[1], params.scale[2])) //*1.41
    
        let mixer = new THREE.AnimationMixer(model);
        const animations = obj.animations;
        animations.forEach( function ( clip ) {
            mixer.clipAction( clip ).play();
        } );
    
        let o = {
            name: params.name,
            model: model,
            mixer: mixer,
        }

        models[params.id] = o;

        obj.scene.tag = params.name;

        console.log(model);

        scene.add(model);
    }, onProgress, onError);
}

const clock = new THREE.Clock();



let params = {
    // newyork: { path: "newyork.glb",
    // 		name: "newyork",
    // 		id: 0,
    // 		position: [0, 0, 0],
    // 		scale: [0.1, 0.1, 0.1]
    // 		},
    user: { path: "cortex.glb",
            name: "user",
            id: 1,
            position: [0, 2, -10],
            scale: [2.5, 2.5, 2.5],
            direction: [0, 0, 0],
            speed: [1.2, 1.2, 1.2]
            },
    miami: { path: "vox_miami.glb",
            name: "miami",
            id: 2,
            position: [0, 0, 0],
            scale: [7, 7, 7]
    },
    icon: { path: "house_icon.glb",
            name: "house_icon",
            id: 3,
            position: [-100, 7, -60],
            scale: [4, 4, 4]
    }
};

function main() {
    camera = new THREE.PerspectiveCamera( 55, window.innerWidth / window.innerHeight, 1, 1000 );
    camera.position.set( 0, 0, 20 );//30, 30, 100 );
    scene = new THREE.Scene();

    // scene.backgroundColor = new THREE.Color('red');

    const texloader = new THREE.TextureLoader();
    texloader.load('https://images.pexels.com/photos/1205301/pexels-photo-1205301.jpeg' , function(texture) {
      scene.background = texture;  
    });

    for (let e in params) {
        console.log("params are:");
        console.log(params[e]);
        load(scene, models, mixers, params[e]);
    }

    // adds lighting to the scene
    const ambientLight = new THREE.AmbientLight( 0xffffff, 1.0);
    scene.add( ambientLight );
    const light = new THREE.DirectionalLight( 0xffffff, 1.0 );
    light.position.set( 10, 10, 10 );
    scene.add( ambientLight, light );
    const light2 = new THREE.DirectionalLight( 0xffffff, 1.0 );
    light2.position.set( 0, 10, -10 );
    scene.add( ambientLight, light2 );

    raycaster = new THREE.Raycaster();

    // standard renderer
    renderer = new THREE.WebGLRenderer( { container, alpha: true, antialias: true, preserveDrawingBuffer: true } );
    renderer.setSize( window.innerWidth, window.innerHeight);
    container.appendChild( renderer.domElement );

    // css renderer
    // cssRenderer = new CSS3DRenderer();
    // cssRenderer.setSize( window.innerWidth, window.innerHeight );
    // renderer = cssRenderer;
    // container.appendChild( renderer.domElement );

    controls = new OrbitControls( camera, renderer.domElement );

    // avatars();
    // stars();
    // grid();

    // grid();

    // models[1].model.add( camera );

    renderer.setAnimationLoop( () => {
        update();
        render();
    });
}

function stars() {
    for (let i = 0; i < num; i++) {
        let geometry = new THREE.SphereGeometry( 0.1, 16, 32);
        let sphere = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial( { color: 0xffffff } ) );
        // const geometry = new THREE.SphereGeometry( 1000, 60, 40 );
        // geometry.scale( - 1, 1, 1 );
        console.log(sphere);
        sphere.position.x = i*2, 
        sphere.position.y = 0; 
        sphere.position.z = 0;

        // const texture = new THREE.TextureLoader().load( `../assets/texture/hdr/${bg}` );
        // const material = new THREE.MeshBasicMaterial( { map: texture } );

        // const mesh = new THREE.Mesh( geometry, material );
        scene.add( sphere );

    }
}

function grid() {
    let uv = new THREE.Vector3(-50, 50, 0);
    let pad = 1;
    let cell = {
        width: 1.2,
        height: 1
    };
    let scale = 20;

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            // WebGl implementation
            const geometry = new THREE.PlaneGeometry( cell.width, cell.height );
            const material = new THREE.MeshBasicMaterial( {color: 0xffffff, side: THREE.DoubleSide} );
            const plane = new THREE.Mesh( geometry, material );
            plane.position.x = uv.x + j * cell.width + pad * j;
            plane.position.y = uv.y - i * cell.height - pad * i;
            plane.position.z = 0;
            plane.rotation.x = Math.PI;
            scene.add( plane );
        }
    }

}

function avatars() {
    for (let i = 0; i < num; i++) {
        let geometry = new THREE.SphereGeometry( 1, 16, 32);
        let sphere = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial( { color: Math.random() * 0xffffff } ) );
        // const geometry = new THREE.SphereGeometry( 1000, 60, 40 );
        // geometry.scale( - 1, 1, 1 );
        console.log(sphere);
        sphere.position.x = 0, 
        sphere.position.y = i*2; 
        sphere.position.z = 0;

        // const texture = new THREE.TextureLoader().load( `../assets/texture/hdr/${bg}` );
        // const material = new THREE.MeshBasicMaterial( { map: texture } );

        // const mesh = new THREE.Mesh( geometry, material );
        scene.add( sphere );

    }
}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}

//
var time = 0;
let theta = 2;
let phi = 0;
let turnSpeed = 5;
let initTurnSpeed = 5;
let axle = 100;
let mouseMove = false;
let turnDragSpeed = turnSpeed;

function cameraAngle() {
    if (drag) {
        theta += 0.2 * xMove;
        phi += 0.2 * yMove;
    } else if (mouseMove) {
        turnSpeed = turnDragSpeed;
    } else {
        initTurnSpeed = turnSpeed;
    }
    // axle *= zoomScale;
}

let jumpTime = 0;
let jumpCusp = 0;

function jump(time) {
    jumpTime = time;
    jumpCusp = time / 2;
}

function update() {
    const dt = clock.getDelta();
    time += dt;
    // console.log("updating");

    for (let e in models) {
        // console.log(models[e]);
        let m = models[e];

        if (m.name == "user") {
            // input list: {focus, theta, phi, turnSpeed, speed, posTurn/Move, negTurn/Move, axle, camPos}
            // intrinsic params: {theta, phi, turnSpeed, axle}
            // output list: {}
            cameraAngle();
            let focus = m.model;
            theta += turnSpeed * (posTurn[0] + negTurn[0]) * dt;
            phi += turnSpeed * (posTurn[1] + negTurn[1]) * dt;
            let maxAng = 89 * Math.PI / 180;
            phi = Math.min( maxAng, Math.max( 0.1 , phi ));
            // if (phi == 85) {
            //     theta += 0.1 * dt;
            // }
            let sinPhi = Math.sin(phi);
            let cosPhi = Math.cos(phi);
            let cosTheta = Math.cos(theta);
            let sinTheta = Math.sin(theta);
            // let depthY = (1 - Math.cos(phi) * axle);
            // console.log(maxAng);
            let depthX = (1 - Math.cos(theta) * axle);


            // let offset2 
            let camPos;
            if (!drag) {
                camPos = new THREE.Vector3(focus.position.x + sinTheta*sinPhi*axle, focus.position.y + cosPhi*axle, focus.position.z - sinPhi*cosTheta*axle);
                let temp = new THREE.Vector3(focus.position.x, focus.position.y, focus.position.z);

                // basis
                let forwardDir = new THREE.Vector3(sinTheta * axle, sinPhi * axle,  depthX).normalize();
                // let forwardDir = (new THREE.Vector3(camPos.x, camPos.y, camPos.z + focus.position.z)).normalize();
                let upDir = new THREE.Vector3(0, 1, 0);
                let rightDir = new THREE.Vector3(forwardDir.x, forwardDir.y, forwardDir.z);
                rightDir.cross(upDir).negate();
                let speed = params.user.speed;

                let x = focus.position.x;
                let y = focus.position.y;
                let z = focus.position.z;

                x += speed[0] * (posMove[0] + negMove[0]) * rightDir.x;
                y += speed[0] * (posMove[0] + negMove[0]) * rightDir.y;
                z += speed[0] * (posMove[0] + negMove[0]) * rightDir.z;
            
                x += speed[1] * (posMove[1] + negMove[1]) * upDir.x;
                y += speed[1] * (posMove[1] + negMove[1]) * upDir.y;
                z += speed[1] * (posMove[1] + negMove[1]) * upDir.z;

                x += speed[2] * (posMove[2] + negMove[2]) * forwardDir.x;
                y += speed[2] * (posMove[2] + negMove[2]) * 0;
                z += speed[2] * (posMove[2] + negMove[2]) * forwardDir.z;

                focus.rotation.y = -theta;

                m.model.position.set(x, y, z);
            } else {
                camPos = new THREE.Vector3(focus.position.x + sinTheta*sinPhi*axle, focus.position.y + cosPhi*axle, focus.position.z - sinPhi*cosTheta*axle);
            }

            // jump code
            if (jumpTime > 0) {

                if (jumpTime > jumpCusp) {
                    m.model.position.y += 10 * dt;
                } else {
                    m.model.position.y -= 10 * dt;
                    if (m.model.position.y <= 2) {
                        m.model.position.y = 2;
                    }
                }

                if (jumpTime > 0) {
                    jumpTime -= dt;
                    if (jumpTime < 0) { jumpTime = 0; }
                }
            }

            if (jumpTime == 0 && m.model.position.y > 2) {
                m.model.position.y -= 9.8 * dt;
                if (m.model.position.y <= 2) { m.model.position.y = 2; }
            }

            camera.position.copy(camPos);
            camera.lookAt(m.model.position);
        }

        if (m.name == "house_icon") {
            let rot = m.model.rotation;
            rot.y += 2 * dt;
            let val =  Math.sin(3 * time) * dt;
            m.model.position.y += val;
            m.model.rotation.copy(rot);
        }
    }
    // console.log(pointer);
    camera.updateProjectionMatrix();
    raycaster.setFromCamera( pointer, camera );

    // console.log( scene.children );
    // console.log( raycaster );
    const intersects = raycaster.intersectObjects( scene.children, true );

    // console.log(intersects);

    if ( intersects.length > 0 ) {

        if ( INTERSECTED != intersects[ 0 ].object ) {

            if ( INTERSECTED ) INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex );

            INTERSECTED = intersects[ 0 ].object;

            // console.log(INTERSECTED);

            let walk = walker(INTERSECTED);

            if (walk.tag === "house_icon") {
                INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex();
                INTERSECTED.material.emissive.setHex( 0x00ffff );
                link = true;
                touched.push(walk);
            } else {
                link = false;
            }
        }

    } else {

        if ( INTERSECTED ) INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex );
        link = false;
        INTERSECTED = null;

    }
}

function walker(element) {
    let walk = element;
    while(walk.parent !== scene) {
        walk = walk.parent;
    }
    return walk;
}


function render() {
    renderer.render( scene, camera );
}

main();

let press = function(e) {
    let keyCode = e.keyCode;
    if (keyCode == 65) { // KeyA
        negMove[0] = -1;
    } else if (keyCode == 83) { // KeyS
        posMove[2] = 1;
    } else if (keyCode == 68) { // KeyD
        posMove[0] = 1;
    } else if (keyCode == 87) { // KeyW
        negMove[2] = -1;
    } else if (keyCode == 37) { // ArrowLeft
        negTurn[0] = -1;
    } else if (keyCode == 39) { // ArrowRight
        posTurn[0] = 1;
    } else if (keyCode == 38) { // ArrowUp
        negTurn[1] = -1;
    } else if (keyCode == 40) { // ArrowDown
        posTurn[1] = 1;
    } else if (keyCode == 32) {
        jump(1);
    }
}

let release = function(e) {
    let keyCode = e.keyCode;
    if (keyCode == 65) { // KeyA
        negMove[0] = 0;
    } else if (keyCode == 83) { // KeyS
        posMove[2] = 0;
    } else if (keyCode == 68) { // KeyD
        posMove[0] = 0;
    } else if (keyCode == 87) { // KeyW
        negMove[2] = 0;
    } else if (keyCode == 37) { // ArrowLeft
        negTurn[0] = 0;
    } else if (keyCode == 39) { // ArrowRight
        posTurn[0] = 0;
    } else if (keyCode == 38) { // ArrowUp
        negTurn[1] = 0;
    } else if (keyCode == 40) { // ArrowDown
        posTurn[1] = 0;
    }
}

let drag = false;
let rClick = false;
let lClick = false;
// let scroll = false;
let cClick = false;
let dClick = false;
let zoomScale = 1;
let lastPoint = new THREE.Vector2(0, 0);
let xMove = 0;
let yMove = 0;
let frame = 0;
let lastDist = 0; 

let mouseMoveEvent = function(e) {
    frame += 1;
    pointer.x = ( e.clientX / window.innerWidth );
    pointer.y = ( e.clientY / window.innerHeight );
    let newPoint = new THREE.Vector2(pointer.x, pointer.y);
    let newDist = lastPoint.distanceTo(newPoint);

    if (lClick) {
        xMove = (pointer.x - lastPoint.x) / lastPoint.x;
        yMove = (pointer.y - lastPoint.y) / lastPoint.y;
        // console.log("dragging");
        // console.log("x move is: "+ xMove);
        // console.log("y move is: "+ yMove);
        drag = true;
        // lastPoint = newPoint;
    } else if (rClick) {
        mouseMove = true; 
        console.log("dragging");
        console.log("y prev move is: "+ lastPoint.y);
        console.log("y move is: "+ pointer.y);
        let scaleFactor;
        if (lastDist != 0) {
            scaleFactor = (newDist - lastDist) / lastDist;
        } else {
            scaleFactor = 0;
        }
        console.log("scale factor is: "+scaleFactor);
        turnDragSpeed += scaleFactor;
        // turnDragSpeed = 5;

        if (newPoint.x < lastPoint.x) {
            negTurn[0] = -1;
            posTurn[0] = 0;
        } else {
            posTurn[0] = 1;
            negTurn[0] = 0;
        }

        if (newPoint.y < lastPoint.y) {
            negTurn[1] = -1;
            posTurn[1] = 0;
        } else {
            posTurn[1] = 1;
            negTurn[1] = 0;
        }

        console.log("frame is: "+frame);

    } else {
        xMove = 0;
        yMove = 0;
    }

    if (frame > 100) {
        lastPoint = new THREE.Vector2(pointer.x, pointer.y);
        frame = 0;
        lastDist = newDist; 
        lastPoint = newPoint;
    }
}

// for raycaster
// let a = ( e.clientX / window.innerWidth ) * 2 - 1;
// let b = - ( e.clientY / window.innerHeight ) * 2 + 1;

let mouseDownEvent = function(e) {
    if (e.which === 3 && !lClick) { // right mouse (l = 1, c = 2, r = 3)
        rClick = true;
        let a = ( e.clientX / window.innerWidth );
        let b = ( e.clientY / window.innerHeight );
        lastPoint = new THREE.Vector2(a, b);
    } else if (e.which === 1 && rClick || e.which === 3 && lClick) {
        dClick = true;
        negMove[2] = -1;
    } else if (e.which === 1 && !rClick) {
        lClick = true;
        console.log("client x is: "+e.clientX);
        console.log("client y is: "+e.clientY);
        let a = ( e.clientX / window.innerWidth );
        let b = ( e.clientY / window.innerHeight );
        lastPoint = new THREE.Vector2(a, b);
        frame = 0;
    }
}

let mouseUpEvent = function(e) {
    if (dClick) {
        dClick = false;
        negMove[2] = 0;
    }
    if (rClick) {
        rClick = false;
        negTurn[0] = 0;
        posTurn[0] = 0;
        negTurn[1] = 0;
        posTurn[1] = 0;
    }

    drag = false;
    lClick = false;
}



$(document).ready(function(){
    document.onkeydown = press;
    document.onkeyup = release;
    document.onmousemove = mouseMoveEvent;
    document.onmousedown = mouseDownEvent;
    document.onmouseup = mouseUpEvent;
    document.body.addEventListener('scroll', scrollEvent);
});