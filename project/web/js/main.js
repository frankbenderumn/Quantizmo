// could add a local version to support no internet connection
import * as THREE from './three.module.js';
import { OrbitControls } from 'https://cdn.skypack.dev/three/examples/jsm/controls/OrbitControls.js';
import { load, umn } from './loader.js';

// Web Sockets API for communication with the backend
let api = new WSApi();

let scene = new THREE.Scene();
let scene2, scene3;
let models = [];
let mixers = [];
let models2 = [];
let mixers2 = [];
let size = 10;

let controls;
var container = document.querySelector( '#scene-container' );
var container2 = document.querySelector( '#depth-container' );
const clock = new THREE.Clock();
let simSpeed = 1.0;
let target = "umn-ec";
let renderer, renderer2, renderer3;

// unused for right now
const fov = 55; // fov = Field Of View
const aspect = container.clientWidth / container.clientHeight;
const near = 0.1;
const far = 20000;

let sceneFile;
let gridGate = false;
let updateReady = false;
let mouseX, mouseY;
let objMaterial;

let camera;
let actorCamera;
let imageStall = false;
let miniMapShow = true;

let cam1, cam2;

class Scene {
  constructor(name, background) {
    this.name = name;
    this.background = background;
  }
  background() {
    return this.background;
  }
}

$.fn.buildBatteryDisplay = () => {
  let wrap = document.getElementById("battery-wrapper");
  let barEmpty = document.createElement("div");
  barEmpty.className = "battery-bar-empty";
  let bar = document.createElement("div");
  bar.id = "battery-bar-fill";
  bar.style.width = "1%";
  barEmpty.append(bar);
  wrap.append(barEmpty);
}


//========================================SCENE SCRIPTING===========================================
$.fn.runJson = (s, file, initialScene = true) => {
  sceneFile = `./js/scenes/${file}`;
  $.getJSON(sceneFile, function (json) {
    console.log(json);
    for (var i = 0; i < json.length; i++) {
      var command = json[i];
      console.log(command);
      // resets the scene and deletes entities in backend. called before every script
      // to allow dynamic scene changes without browser refresh
      if (command.command == "reset") {
        api.sendCommand("reset", command.params);
        models = [];
      }

      // creates entity in front and backend
      if (command.command == "createEntity") {
        if (command.params.type != "actor") {

          // if not an actor, then will not be dynamic (for now)
          load(s, models, mixers, command.params, false);

        } else {
          if (command.params.decorator != undefined) {
          $.fn.buildBatteryDisplay();
          }
          // if an actor this model will be moving
          load(s, models, mixers, command.params);

        }

        // execites createEntity command in backend
        api.sendCommand("createEntity", command.params);
      }
      // extra conditional to help load static objects, specifically terrain
      if (command.command == "terrain") {
        load(s, models, mixers, command.params, false);
      }
      if (command.command == "rescue") {
        // binds rescue information to assist backend
        api.sendCommand("rescue", command.params);
      }
      if (command.command == "size") {
        size = command.size;
      }
    }
  });
}


// creates a scene class
// paramaters are: name, background color/image, preloaded model references
let umnScene = new Scene(target, new THREE.Color( 'skyblue' ));

// scene object to hold multiple scene information
let scenes = { target : umnScene };

// saves the image to a base64 encoded jpg file
var strDownloadMime = "image/octet-stream";
function saveAsImage() {
  var imgData, imgNode;
  try {
      imageStall = true;
      var strMime = "image/jpeg";
      imgData = renderer2.domElement.toDataURL(strMime);
      console.log(`imgData is ${imgData}`);
      api.sendPostCommand("image", {image: imgData}).then(function(data) {
        console.log(data);
        imageStall = false;
      });
      //saveFile(imgData.replace(strMime, strDownloadMime), "screenshot.jpg");
  } catch (e) {
      console.log(e);
      return;
      imageStall = false;
  }

}

//========================================SCENE GENERATION==========================================
// This function runs the scene
function main(){

  // initializes scene and camera
  camera = new THREE.PerspectiveCamera( 55, window.innerWidth / window.innerHeight, 1, 1000 );
  camera.position.set( -10, 10, 10 );//30, 30, 100 );
  scene = new THREE.Scene();
  
  actorCamera = new THREE.PerspectiveCamera( 55, window.innerWidth / window.innerHeight, 1, 1000 );

  // depth shader material override code
  var uniforms = {
    time: { type: "f", value: 1.0 },
    resolution: { type: "v2", value: new THREE.Vector2() },
    viewMatrixInverse: { type: 'm4', value: new THREE.Matrix4() }
  };

  uniforms.resolution.value.x = window.innerWidth;
  uniforms.resolution.value.y = window.innerHeight;
  uniforms.time.value = 1.0;

  objMaterial = new THREE.ShaderMaterial({
      uniforms: uniforms,
      vertexShader: document.getElementById('vertexShader').textContent,
      fragmentShader: document.getElementById('fragmentShader').textContent
  });

  // skybox generation and dynamic backgrounds for multiple scenes
  if (target != undefined) {
    let bg = scenes.target.background;
    if (typeof bg === "string") {

      // uses a skybox (sphere) by rendering a texture on the inside of sphere
      const geometry = new THREE.SphereGeometry( 1000, 60, 40 );
      geometry.scale( - 1, 1, 1 );

      const texture = new THREE.TextureLoader().load( `../assets/texture/hdr/${bg}` );
      const material = new THREE.MeshBasicMaterial( { map: texture } );

      const mesh = new THREE.Mesh( geometry, material );
      scene.add( mesh );

    } else {
      scene.background = scenes.target.background;
    }
  } else {
    console.log(scenes);
    console.log(scenes.retro.background);
    scene.background = scenes.retro.background;
  }

  // runs json script
  $.fn.runJson(scene,`${target}.json`);

  // adds lighting to the scene
  const ambientLight = new THREE.AmbientLight( 0xffffff, 1.0);
  scene.add( ambientLight );
  const light = new THREE.DirectionalLight( 0xffffff, 1.0 );
  light.position.set( 10, 10, 10 );
  scene.add( ambientLight, light );
  const light2 = new THREE.DirectionalLight( 0xffffff, 1.0 );
  light2.position.set( 0, 10, -10 );
  scene.add( ambientLight, light2 );
  
  // adds scene specific information based on selected scene
  if (target === "umn" || target === "umn-ec") { umn(scene); }

  // screenshot link generation
  var saveLink = document.createElement('div');
  saveLink.style.position = 'absolute';
  saveLink.style.top = '60px';
  saveLink.style.width = '100%';
  saveLink.style.color = 'white !important';
  saveLink.style.textAlign = 'center';
  saveLink.innerHTML = '<a href="#" id="saveLink">Save Frame</a>';
  document.body.appendChild(saveLink);
  document.getElementById("saveLink").addEventListener('click', saveAsImage);

  //====================================SCENE RENDERER==============================================

  // prevents multiple canvases from being generated on scene change
  $('canvas:nth-of-type(1)').remove();

  // standard renderer
  renderer = new THREE.WebGLRenderer( { container, alpha: true, antialias: true, preserveDrawingBuffer: true } );
  renderer.setSize( window.innerWidth, window.innerHeight);
  container.appendChild( renderer.domElement );

  // duplicates scene, unfortunately this has to be done manually ?
  scene2 = new THREE.Scene();
  umn(scene2);
  scene2.add( ambientLight, light2 );
  scene2.overrideMaterial = objMaterial;
  scene2.background = new THREE.Color('black');

  // depth renderer for taking images
  renderer2 = new THREE.WebGLRenderer( { container2, alpha: true, antialias: true, preserveDrawingBuffer: true });
  renderer2.setPixelRatio( window.devicePixelRatio );
  renderer2.setSize( window.innerWidth, window.innerHeight);
  document.body.appendChild( renderer2.domElement );

  // copies depth renderer to mini display
  scene3 = scene2;
  renderer3 = new THREE.WebGLRenderer( { container2, alpha: true, antialias: true, preserveDrawingBuffer: true });
  renderer3.setPixelRatio( window.devicePixelRatio );
  renderer3.setSize( window.innerWidth / 4, window.innerHeight / 4);
  container2.appendChild( renderer3.domElement );

  // adds extra aesthetic code (may refactor to modules)
  // controls and other shaders. (Ocean and weather patterns were removed)
  // define controls
  controls = new OrbitControls( camera, container );
  controls.maxPolarAngle = Math.PI * 0.695;
  controls.target.set( 0, 0, 0 );
  controls.update();

  cam1 = camera;
  cam2 = actorCamera;

  // start the animation/render loop
  renderer.setAnimationLoop( () => {
    update();
    render();
  });
}

// this runs everything
main();

// takes an image every 5 seconds
window.setInterval( saveAsImage, 5000);

// This is the function that is called once the document is started.
$( document ).ready(function() {

  // Start checking for when the user resizes their application window.
  window.addEventListener( 'resize', onWindowResize );

  // interprets key press or release and sends information to backend
  var keyAction = function(e) {
    console.log(e);
    api.sendCommand(e.type, {key: e.key, keyCode: e.keyCode});
  }

  document.onkeydown = keyAction;
  document.onkeyup = keyAction;

  $("#camera-trigger").on('click', function(){
    miniMapShow = !miniMapShow;
  });

});

// This function updates the scene's animation cycle.
var time = 0.0;

function update() {
  // Get the time since the last animation frame.
  const delta = clock.getDelta();
  time += delta;

  //temporary work around to force models to be loaded first
  if (models.length >= size) {
    updateReady = true;
  }

  if (!miniMapShow) {
    container2.style.display = "none";
  } else {
    container2.style.display = "block";
  }

  controls.update();

  if (updateReady) {

    // iterates through the models and updates those with animations
    for (let e of models) {
      if (e != undefined) {
        if (e.mixer) {
          e.mixer.update(delta);
        }
      }
    }

    // console.log(models);
    // copies models from standard scene to depth scene
    // there should be an easier way to do this
    if (models2.length == 0 && models.length >= size) {
      if (models[1] != undefined) {
        scene2.add(models[1].model.clone());
        models2.push("wow");
      } 
    }

    api.sendCommand("update", {delta: delta, simSpeed: simSpeed}).then(function(updateData) {
      let data = updateData;
      console.log(data);
      if (data.entity0 != undefined ) {
        for (let e in data) {
          if (e !== "id") {
            let idx = data[e].entityId;
            models[idx].model.position.copy(new THREE.Vector3(data[e].position.x, data[e].position.y, data[e].position.z));
            // models[idx].model.rotation.x = data[e].direction.x;
            // models[idx].model.rotation.y = data[e].direction.y;

            // sets the actor camera to position of actor
            if (data[e].type == "Actor") {
              cam2.position.copy(models[idx].model.position);
              cam2.lookAt(new THREE.Vector3(0, 0, 0));  
            }
          }
        }
      }
      updateReady = true;
    });
    updateReady = false;
  }
}

// ===================================MULTIPLE RENDERERS============================================

let miniMap = {
    left: 0.6,
    bottom: 0.05,
    width: 0.3,
    height: 0.4
};

// renders all renderers to support depth images
function render() {

  renderer2.render( scene2, actorCamera );
  renderer.render( scene, camera );

  const left = Math.floor( container2.clientWidth * miniMap.left );
  const bottom = Math.floor( container2.clientHeight * miniMap.bottom );
  const width = Math.floor( container2.clientWidth * miniMap.width );
  const height = Math.floor( container2.clientHeight * miniMap.height );

  // allows minimap through split render
    renderer3.setViewport( left, bottom, width, height );
    renderer3.setScissor( left, bottom, width, height );
    renderer3.setScissorTest(true);
    renderer3.render(scene2, actorCamera ); 

}

// This function updates the projection matrix and renderer whenever the
// user's application window is resized.
function onWindowResize() {

  // set the aspect ratio to match the new browser window aspect ratio
  camera.aspect = container.clientWidth / container.clientHeight;

  // update the camera's frustum
  camera.updateProjectionMatrix();

  // update the size of the renderer AND the canvas
  // need to add resize support for minimap
  renderer.setSize( container.clientWidth, container.clientHeight );
  // renderer2.setSize( );

}

// returns mouse data in device pixels (not out of -1 and 1)
function onMouseMove( event ) {
    mouseX = ( event.clientX - window.innerWidth / 2 );
    mouseY = ( event.clientY - window.innerHeight / 2 );
}

// this functions allows depth camera and normal scene to swap on minimap click
window.addEventListener( 'click', function(e) {
  let x = mouseX / this.window.innerWidth;
  let y = mouseY / this.window.innerHeight;
  if (x <= -0.25 && y <= -0.25) {
    let temp = scene;
    scene = scene2;
    scene2 = temp;
    let tempC = cam1;
    cam1 = cam2;
    cam2 = tempC;
    controls.target.set( 0, 0, 0 );
  }
  console.log(`MouseX is ${x}`);
  console.log(`MouseY is ${y}`);
});

window.addEventListener( 'mousemove', onMouseMove, false );
