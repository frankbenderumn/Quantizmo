// could add a local version to support no internet connection
import * as THREE from './three.module.js';
import { ColladaLoader } from 'https://cdn.skypack.dev/three/examples/jsm/loaders/ColladaLoader.js';
import { GLTFLoader } from 'https://cdn.skypack.dev/three/examples/jsm/loaders/GLTFLoader.js';
import { OBJLoader } from 'https://cdn.skypack.dev/three/examples/jsm/loaders/OBJLoader.js';
import { MTLLoader } from 'https://cdn.skypack.dev/three/examples/jsm/loaders/MTLLoader.js';
import { OrbitControls } from 'https://cdn.skypack.dev/three/examples/jsm/controls/OrbitControls.js';
import { load, umn } from './loader.js';

// Web Sockets API for communication with the backend
var api = new WSApi();

// const colladaLoader = new ColladaLoader();
// const glbLoader = new GLTFLoader();
const objLoader = new OBJLoader();

var scene = new THREE.Scene();
let models = [];
let mixers = [];

// var camera;
var controls;
var container = document.querySelector( '#scene-container' );
const clock = new THREE.Clock();
var simSpeed = 1.0;
var target = "umn";
let alertCounter = 0;
let renderer;
// let mixer;
const fov = 55; // fov = Field Of View
const aspect = container.clientWidth / container.clientHeight;
const near = 0.1;
const far = 20000;
let sceneFile;
let gridGate = false;
let updateReady = false;
let mouseX, mouseY;

let camera;

// actor camera vars
// let actor_container = document.querySelector( '#actor-container' );
// let actor_camera, actor_scene, actor_controls, actor_renderer;
// const actor_aspect = actor_container.clientWidth / actor_container.clientHeight;

class Model {
  constructor(name, path, scene = '') {
    this.name = name;
    this.path = path;
    this.scene = scene;
  }
  scene() {
    return this.scene;
  }
  loader() {
    load(this.path);
  }
}

// changing to World
class Scene {
  constructor(name, background, models) {
    this.name = name;
    this.background = background;
    this.models = models;
  }
  background() {
    return this.background;
  }
  models() {
    return this.models;
  }
}

//========================================SCENE SCRIPTING===========================================
$.fn.runJson = (file, initialScene = true) => {
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
      if (command.command == "setScene") {
        console.log(command);
        sceneModel = command.params.mesh;
        sceneTexture = command.params.texture;
        sceneScale = command.params.scale;
        scenePosition = command.params.position;
      }
      if (command.command == "createEntity") {
        // if (command.params.type != "actor" || command.params.type != "battery_actor") {
        if (command.params.type != "actor") {
          // if not an actor, then will not be dynamic (for now)
          load(scene, models, command.params, false);
        } else {
          // if an actor this model will be moving
          load(scene, models, command.params);
        }

        // execites createEntity command in backend
        api.sendCommand("createEntity", command.params);
      }
      // extra conditional to help load static objects, specifically terrain
      if (command.command == "terrain") {
        load(scene, models, command.params, false);
      }
      if (command.command == "rescue") {
        // binds rescue information to assist backend
        api.sendCommand("rescue", command.params);
      }
    }
  });
}

// creates a scene class (will change name to world)
// paramaters are: name, background color/image, preloaded model references
let umnScene = new Scene("umn", new THREE.Color( 'skyblue' ), ["drone", "starya", "aku"]);

// scene object to hold multiple scene information
var scenes = { "umn" : umnScene };

// controls and other shaders. (Ocean and weather patterns were removed)
function base(){
  // define controls
  controls = new OrbitControls( camera, container );
  controls.maxPolarAngle = Math.PI * 0.695;
  controls.target.set( 0, 0, 0 );
  controls.update();
}

//========================================SCENE GENERATION==========================================
// This function runs the scene
$.fn.run = () => {

  // initializes scene and camera
  camera = new THREE.PerspectiveCamera( 55, window.innerWidth / window.innerHeight, 1, 1000 );
  camera.position.set( -10, 10, 10 );//30, 30, 100 );
  scene = new THREE.Scene();
  
  // depth shader material override code
  var uniforms = {
    time: { type: "f", value: 1.0 },
    resolution: { type: "v2", value: new THREE.Vector2() },
    viewMatrixInverse: { type: 'm4', value: new THREE.Matrix4() }
  };

  uniforms.resolution.value.x = window.innerWidth;
  uniforms.resolution.value.y = window.innerHeight;
  uniforms.time.value = 1.0;

  var objmaterial = new THREE.ShaderMaterial({
      uniforms: uniforms,
      vertexShader: document.getElementById('vertexShader').textContent,
      fragmentShader: document.getElementById('fragmentShader').textContent
  });
  //scene.overrideMaterial = new THREE.MeshDepthMaterial();

  // skybox generation and dynamic backgrounds for multiple scenes
  if (target != undefined) {
    let bg = scenes[target].background;
    if (typeof bg === "string") {
      const geometry = new THREE.SphereGeometry( 1000, 60, 40 );
      geometry.scale( - 1, 1, 1 );

      const texture = new THREE.TextureLoader().load( `../assets/texture/hdr/${bg}` );
      const material = new THREE.MeshBasicMaterial( { map: texture } );

      const mesh = new THREE.Mesh( geometry, material );
      scene.add( mesh );

    } else {
      scene.background = scenes[target].background;
    }
  } else {
    console.log(scenes);
    console.log(scenes["retro"].background);
    scene.background = scenes["retro"].background;
  }


  $.fn.runJson(`${target}.json`);

  //========================================SCENE LIGHTING==========================================
  const ambientLight = new THREE.AmbientLight( 0xffffff, 1.0);
  scene.add( ambientLight );
  const light = new THREE.DirectionalLight( 0xffffff, 1.0 );
  light.position.set( 10, 10, 10 );
  scene.add( ambientLight, light );
  const light2 = new THREE.DirectionalLight( 0xffffff, 1.0 );
  light2.position.set( 0, 10, -10 );
  scene.add( ambientLight, light2 );
  
  // adds scene specific information based on selected scene
  if (target === "umn") {
    umn(scene);
  }

  //====================================SCREENSHOT LINK=============================================
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
  renderer = new THREE.WebGLRenderer( { container, alpha: true, antialias: true, preserveDrawingBuffer: true } );
  renderer.setSize( window.innerWidth, window.innerHeight );
  document.body.appendChild( renderer.domElement );

  // adds extra aesthetic code (may refactor to modules)
  base();

  // start the animation/render loop
  renderer.setAnimationLoop( () => {
    update();
    render();
  });
}

// this runs everything
$.fn.run();

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
});

// This function updates the scene's animation cycle.
var time = 0.0;
function update() {
  // Get the time since the last animation frame.
  const delta = clock.getDelta();
  time += delta;

  //temporary work around to force models to be loaded first
  if (models.length >= 1) {
    updateReady = true;
  }

  controls.update();

  if (updateReady) {
    // console.log("models are: ...");
    // console.log(models);
    api.sendCommand("update", {delta: delta, simSpeed: simSpeed}).then(function(updateData) {
      let data = updateData;
      // console.log(data);
      if (data.entity0 != undefined ) {
        for (let e in data) {
          // console.log(models.length);
          // console.log(data[e].entityId);
          if (data[e].type == "Actor") {
            // console.log("SHOULD BE RENDERING");
            models[0].position.copy(new THREE.Vector3(data[e].position.x, data[e].position.y, data[e].position.z));
            models[0].rotation.x = data[e].direction.x;
            models[0].rotation.y = data[e].direction.y;
            // models[0].scene.rotation.z = data[e].direction.z;
            // models[0].scene.rotation.copy(new THREE.Vector3(data[e].direction.x, data[e].direction.y, data[e].direction.z));
            // console.log(models[data[e].entityId].scene);
            // console.log("updating actor!");
          }
        }
      }
      updateReady = true;
    });
    updateReady = false;
  }
}

// saves the image to a base64 encoded jpg file
var strDownloadMime = "image/octet-stream";
function saveAsImage() {
  var imgData, imgNode;
  try {
      var strMime = "image/jpeg";
      imgData = renderer.domElement.toDataURL(strMime);
      console.log(`imgData is ${imgData}`);
      api.sendPostCommand("image", {image: imgData}).then(function(data) {
        console.log(data);
      });
      //saveFile(imgData.replace(strMime, strDownloadMime), "screenshot.jpg");
  } catch (e) {
      console.log(e);
      return;
  }

}

// This function simply renders the scene based on the camera position.
function render() {
  renderer.render( scene, camera );
}

// This function updates the projection matrix and renderer whenever the
// user's application window is resized.
function onWindowResize() {
  // set the aspect ratio to match the new browser window aspect ratio
  camera.aspect = container.clientWidth / container.clientHeight;

  // update the camera's frustum
  camera.updateProjectionMatrix();

  // update the size of the renderer AND the canvas
  renderer.setSize( container.clientWidth, container.clientHeight );
}

function onMouseMove( event ) {
    mouseX = ( event.clientX - window.innerWidth / 2 );
    mouseY = ( event.clientY - window.innerHeight / 2 );


}

window.addEventListener( 'mousemove', onMouseMove, false );
