// could add a local version to support no internet connection
import * as THREE from './three.module.js';
import Stats from 'https://cdn.skypack.dev/three/examples/jsm/libs/stats.module.js';
import { ColladaLoader } from 'https://cdn.skypack.dev/three/examples/jsm/loaders/ColladaLoader.js';
import { GLTFLoader } from 'https://cdn.skypack.dev/three/examples/jsm/loaders/GLTFLoader.js';
import { OBJLoader } from 'https://cdn.skypack.dev/three/examples/jsm/loaders/OBJLoader.js';
import { MTLLoader } from 'https://cdn.skypack.dev/three/examples/jsm/loaders/MTLLoader.js';
import { FirstPersonControls } from 'https://cdn.skypack.dev/three/examples/jsm/controls/FirstPersonControls.js';
import { OrbitControls } from 'https://cdn.skypack.dev/three/examples/jsm/controls/OrbitControls.js';
import { GUI } from 'https://cdn.skypack.dev/three@0.132.2/examples/jsm/libs/dat.gui.module.js';
import { Sky } from 'https://cdn.skypack.dev/three@0.132.2/examples/jsm/objects/Sky.js';
import { PMREMGenerator } from 'https://cdn.skypack.dev/three@0.132.2/src/extras/PMREMGenerator.js';
import { Ocean } from './addons/ocean.js';

// Web Sockets API for communication with the backend
var api = new WSApi();
let globalModels = [];
const glbLoader = new GLTFLoader();
const models = [];
const mixers = [];
var camera;
var controls;
var scene;
var container = document.querySelector( '#scene-container' );
const clock = new THREE.Clock();
const objLoader = new OBJLoader();
var simSpeed = 1.0;
var target;
let alertCounter = 0;
let bgTexture;
let droneB;
let renderer;
// let mixer;
let umnObj;
let snow, rain, tornado;
let sun, water, sky, stats;
let imesh;
let ocean;
const fov = 35; // fov = Field Of View
const aspect = container.clientWidth / container.clientHeight;
const near = 0.1;
const far = 1500;
let sceneFile;

$.fn.notify = (type, message) => {
  let wrap = document.getElementById("alert-wrapper");
  let alert = document.createElement("div");
  alert.className = "alert " + alertCounter + " ";
  let icon = document.createElement("div");
  icon.className = "icon ";
  let symbol = document.createElement("i");
  symbol.className = "fas ";
  let content = document.createElement("div");
  content.className = "content ";
  content.innerHTML += message;
  switch(type) {
    case 0:
      symbol.className += "fa-check-circle ";
      symbol.className += "success";
      icon.className += "green-bg";
      content.className += "success-bg green";
      alert.className += "green-border";
      break;
    case 1:
      symbol.className += "fa-skull-crossbones ";
      symbol.className += "danger";
      icon.className += "red-bg";
      content.className += "danger-bg red";
      alert.className += "red-border";
      break;
    case 2:
      symbol.className += "fa-question-circle ";
      symbol.className += "notice";
      icon.className += "blue-bg";
      content.className += "notice-bg blue";
      alert.className += "blue-border";
      break;
    case 3:
      symbol.className += "fa-exclamation-circle ";
      symbol.className += "warning";
      icon.className += "orange-bg";
      content.className += "warning-bg orange";
      alert.className += "orange-border";
      break;
    default: 
      break;
  }
  icon.append(symbol);
  alert.append(icon);
  alert.append(content);
  wrap.append(alert);
  alertCounter++;
  $(".alert").delay(4000).fadeOut(2000);
}

$.fn.notify(1, "test failure!");
$.fn.notify(0, "drone has successfully been instantiated!");
$.fn.notify(2, "Need to create console logger function!");
$.fn.notify(3, "This is risky behavior!");

const onProgress = function(xhr) {

  if ( xhr.lengthComputable ) {

    const percentComplete = xhr.loaded / xhr.total * 100;
    console.log( Math.round( percentComplete, 2 ) + '% downloaded' );

  }

};

const onError = function(name) { $.fn.notify(1, `Failed to load model ${name}`); };

function umnScene() {
  let sceneModel = "../assets/model/umn.obj";
  let sceneTexture = "../assets/texture/umn.png";

  // load a resource
  objLoader.load(
    // resource URL
    sceneModel,
    // called when resource is loaded
    function (object) {
      object.position.copy(new THREE.Vector3(0, -13, 0))
      object.scale.copy(new THREE.Vector3(0.05, 0.05, 0.05));

      const textureLoader = new THREE.TextureLoader();
      const texture = textureLoader.load(sceneTexture + "-ground.png");
      texture.encoding = THREE.sRGBEncoding;
      texture.anisotropy = 16;
      var objmaterial = new THREE.MeshStandardMaterial({ map: texture });

      const texture2 = textureLoader.load(sceneTexture);
      texture.encoding = THREE.sRGBEncoding;
      texture.anisotropy = 16;

      object.traverse(function (node) {
        if (node.name == "EXPORT_GOOGLE_SAT_WM") {
          node.material = objmaterial;
        }
        else if (node.name == "Areas:building") {
          var material = new THREE.MeshStandardMaterial({ color: 0x85868f, map: texture2 });
          node.material = material;
        }
        else if (!node.isGroup) {
          node.visible = false;
        }
        console.log(node);

      });

      models.push(object);
      scene.add(object);
    },
    // called when loading is in progresses
    function (xhr) {
      console.log((xhr.loaded / xhr.total * 100) + '% loaded');
    },
    // called when loading has errors
    function (error) {
      console.log('An error happened', error);
    }
  );
}

class Model {
  constructor(name, path, type="", scale="", position="", rotation="", direction="") {
    this.name = name;
    this.path = path;
    this.type = type;
    this.scale = scale;
    this.position = position;
    this.rotation = rotation;
    this.direction = direction;
    // $.fn.load(`${name}`, `${path}`);
  }
}

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

$.fn.load = (name, path, mtl = "") => {
  let arr = path.split('.');
  let ext = arr[arr.length - 1];
  switch (ext) {
    case "glb":
      $.fn.loadGlb(name, path);
      break;
    case "obj":
      $.fn.loadObj(name, path, mtl);
      break;
    default:
      $.fn.notify(1, "Invalid model type");
      break;
  }
};

$.fn.loadGlb = (name, path) => {
  console.log(`${name} at ../assets/model/${path} attempting to be loaded`);
  glbLoader.load( `../assets/model/${path}`, function (obj) {
    let model = obj.scene;
    let mixer = new THREE.AnimationMixer( obj.scene );
    const clips = obj.animations;
    clips.forEach( function ( clip ) {
      mixer.clipAction( clip ).play();
    } );
    console.log(`model is ${model}`);
    mixers.push(clips);
    // globalModels[name] = model;
    globalModels[name] = model;
    scene.add(model);
    // return model;
  }, onProgress, onError(name));
};

$.fn.loadObj = (name, path, mtl) => {
  let mtlLoader = new MTLLoader();
  mtlLoader.load( `../assets/model/${mtl}`, function( materials ) {

      materials.preload();

      objLoader.setMaterials( materials );
      objLoader.load( `../assets/model/${path}`, function ( object ) {

          globalModels[name] = object;
          // scene.add( object );

      }, onProgress, onError(name) );

  });
};

$.fn.send = (command, params) => { api.sendCommand(command, params); }

$.fn.runJson = (file, initialScene = true) => {
  sceneFile = `./js/scenes/${file}`;
  $.getJSON(sceneFile, function (json) {
    console.log(json);
    for (var i = 0; i < json.length; i++) {
      var command = json[i];
      console.log(command);
      if (command.command == "setScene") {
        console.log(command);
        sceneModel = command.params.mesh;
        sceneTexture = command.params.texture;
        sceneScale = command.params.scale;
        scenePosition = command.params.position;
      }
      if (command.command == "createEntity") {
        // loadMesh(command.params);
        console.log("Mesh params are...");
        console.log(command.params);
        // let obj = JSON.parse(command.params);
        console.log(`obj path is ${command.params.path}`);
        // type="", scale="", position="", rotation="", direction=""
        let obj = command.params;
        $.fn.load(obj.name,
              obj.path,
              obj.group,
              obj.scale,
              obj.position,
              obj.rotation,
              obj.direction);
      }
    }
    loadModels();
  });
}

// More important related to models and animation.
let drone = new Model("drone", "drone_lp.glb");
let ship = new Model("ship", "ship.glb");
let starya = new Model("starya", "starya.glb");
let aku = new Model("aku", "aku.glb"); 

// console.log("global models is...");
// console.log(globalModels);

const textureLoader = new THREE.TextureLoader();
const cubeTextureLoader = new THREE.CubeTextureLoader();

const matrixSkybox = cubeTextureLoader.load([
  '../assets/texture/cubemap/matrix/matrixrt.jpg',
  '../assets/texture/cubemap/matrix/matrixlf.jpg',
  '../assets/texture/cubemap/matrix/matrixup.jpg',
  '../assets/texture/cubemap/matrix/matrixdn.jpg',
  '../assets/texture/cubemap/matrix/matrixft.jpg',
  '../assets/texture/cubemap/matrix/matrixbk.jpg',
]);

const cloudSkybox = cubeTextureLoader.load([
  '../assets/texture/cubemap/orange_sky/gloomy_rt.png',
  '../assets/texture/cubemap/orange_sky/gloomy_lf.png',
  '../assets/texture/cubemap/orange_sky/gloomy_up.png',
  '../assets/texture/cubemap/orange_sky/gloomy_dn.png',
  '../assets/texture/cubemap/orange_sky/gloomy_ft.png',
  '../assets/texture/cubemap/orange_sky/gloomy_bk.png',
]);

let aquatic = new Scene("aquatic", "aquatic.jpg", ["drone", "starya", "aku"]);
let mountain = new Scene("mountain", "darkstorm.jpg", ["drone", "starya", "aku"]);
let umn = new Scene("umn", new THREE.Color(0x00dddd), ["drone", "starya", "aku"]);
let space = new Scene("space", "stars.jpeg", []);
let retro = new Scene("retro", "glitch.jpeg", ["drone", "starya", "aku"]);
let ikea = new Scene("ikea", "cyber.jpeg", []);
let pompeii = new Scene("pompeii", "darkstorm.jpg", []);

var scenes = {
  "aquatic" : aquatic,
  "mountain" : mountain, 
  "umn" : umn, 
  "space" : space, 
  "retro" : retro, 
  "ikea" : ikea, 
  "pompeii" : pompeii
};

$("[data-role='scene-trigger']").on('click', function() {
  target = $(this).attr('href');
  console.log(target);
  scene = undefined;
  $("div#loading-background").show();
  $.fn.run();
  setTimeout(function() { $("div#loading-background").hide(); }, 2000);
});








// This is the function that is called once the document is started.
$( document ).ready(function() {

  // Init() starts up the scene and its update loop.
  init();

  // Start checking for when the user resizes their application window.
  window.addEventListener( 'resize', onWindowResize );

  var keyAction = function(e) {
    console.log(e);
    api.sendCommand(e.type, {key: e.key, keyCode: e.keyCode});
  }

  document.onkeydown = keyAction;
  document.onkeyup = keyAction;
});

// const raycaster = new THREE.Raycaster();
// const mouse = new THREE.Vector2();

// This function resets the scene
$.fn.run = () => {
  scene = new THREE.Scene();
  if (target != undefined) {
    let bg = scenes[target].background;
    if (typeof bg === "string") {

      // code to load static image for background
      // bgTexture = textureLoader.load(`../assets/image/${bg}`);
      // scene.background = bgTexture;

      // code for spherical background hdri
      const geometry = new THREE.SphereGeometry( 1000, 60, 40 );
      // invert the geometry on the x-axis so that all of the faces point inward
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

  // ==================================== SCENE ENVIRONMENT ========================================

    $.fn.runJson(`${target}.json`);

  // ==================================== SCENE ADD ONS ============================================

  switch (target) {
    case "umn":
      // $.fn.runJson("umn.json");
      break;
    case "aquatic":
      // adding fog
      {
        const color = 0x1f556e;
        const density = 0.01;
        // scene.fog = new THREE.FogExp2(color, density);

        const near = 900;
        const far = 1100;
        scene.fog = new THREE.Fog(color, near, far);
      }
      break;
    case "pompeii":
      ocean = new Ocean(scene);
      ocean.render();

      // const gui = new GUI();

      // const waterUniforms = ocean.water.material.uniforms;

      // const folderWater = gui.addFolder('Water');
      // folderWater.add(waterUniforms.distortionScale, 'value', 0, 8, 0.1).name('distortionScale');
      // folderWater.add(waterUniforms.size, 'value', 0.1, 10, 0.1).name('size');
      // folderWater.add(waterUniforms.alpha, 'value', 0.9, 1, .001).name('alpha');
      // folderWater.open();
      break;
    case "mountain":
      break;
    case "ikea":
      break;
    case "retro":
      break;
    case "umn":
      break;
    default:
      break;
  }
  if (target === "umn") {
    umnScene();
  }
  
  // ======================================SCENE MODELS ============================================
  
  // let sceneModels = scenes[target].models;
  // console.log("sceneModels is...");
  // console.log(sceneModels);
  // console.log(`global models is ${globalModels}`);
  // for(let e in sceneModels) {
  //   console.log(`e is ${globalModels[e]}`);
  //   scene.add(sceneModels[e]);
  // }


  //========================================SCENE LIGHTING==========================================
  const ambientLight = new THREE.AmbientLight( 0xffffff, 0.5 );
  scene.add( ambientLight );
  const light = new THREE.DirectionalLight( 0xffffff, 0.5 );
  light.position.set( 10, 10, 10 );
  scene.add( ambientLight, light );
  const light2 = new THREE.DirectionalLight( 0xffffff, 0.5 );
  light2.position.set( 0, 10, -10 );
  scene.add( ambientLight, light2 );

  base();

  scene.add(umnObj);

  //====================================SCENE TERRAIN===============================================

  $('canvas:nth-of-type(1)').remove();
  renderer = new THREE.WebGLRenderer( { container, alpha: true, antialias: true } );
  renderer.setSize( window.innerWidth, window.innerHeight );
  renderer.setClearColor(0x000000);
  renderer.outputEncoding = THREE.sRGBEncoding;
  document.body.appendChild( renderer.domElement );

  // start the animation/render loop
  renderer.setAnimationLoop( () => {
    update();
    render();
  });
}

function grid() {
  const gridSize = 1000;
  const gridDivisions = 500;
  const gridHelper = new THREE.GridHelper( gridSize, gridDivisions, 0x00EE22, 0x000077);
  scene.add( gridHelper );
}

function base(){
  grid();

  // ======================================SUN AND OCEAN==============================================
  sun = new THREE.Vector3();

  // Skybox
  sky = new Sky();
  sky.scale.setScalar(10000);
  scene.add(sky);
  const skyUniforms = sky.material.uniforms;
  skyUniforms['turbidity'].value = 10;
  skyUniforms['rayleigh'].value = 2;
  skyUniforms['mieCoefficient'].value = 0.005;
  skyUniforms['mieDirectionalG'].value = 0.8;
  const parameters = {
    inclination: 0.49,
    azimuth: 0.205
  };
  const pmremGenerator = new THREE.PMREMGenerator(renderer);

  function updateSun() {
    const theta = Math.PI * (parameters.inclination - 0.5);
    const phi = 2 * Math.PI * (parameters.azimuth - 0.5);
    sun.x = Math.cos(phi);
    sun.y = Math.sin(phi) * Math.sin(theta);
    sun.z = Math.sin(phi) * Math.cos(theta);
    sky.material.uniforms['sunPosition'].value.copy(sun);
    if (target == "pompeii") {
    ocean.water.material.uniforms['sunDirection'].value.copy(sun).normalize();
    }
    scene.environment = pmremGenerator.fromScene(sky).texture;
  }
  updateSun();

  // scene.background = new THREE.Color(0xffffff);
  // scene.remove(sky);

  //
  stats = new Stats();
  container.appendChild(stats.dom);

  const igeometry = new THREE.BoxBufferGeometry(30, 30, 30);
  const imaterial = new THREE.MeshStandardMaterial({ roughness: 0 });

  imesh = new THREE.Mesh(igeometry, imaterial);

  // $.fn.load("drone", "drone_lp.glb");
  // $.fn.load("ship", "ship.glb");
  // $.fn.load("aku", "aku.glb");
  // $.fn.load("starya", "starya.glb");
  // $.fn.load("pompeii", "pompeii.glb");
  // $.fn.load("submarine", "submarine.glb");
  
  
  console.log("global models is...");
  console.log(globalModels);

  // scene.add(drone);
  // const gui = new GUI();

  // const folderSky = gui.addFolder('Sky');
  // folderSky.add(parameters, 'inclination', 0, 0.5, 0.0001).onChange(updateSun);
  // folderSky.add(parameters, 'azimuth', 0, 1, 0.0001).onChange(updateSun);
  // folderSky.open();

}

function init() {

  camera = new THREE.PerspectiveCamera( fov, aspect, near, far );
  camera.position.set( -10, 10, 10 );
  controls = new OrbitControls( camera, container );

  scene = new THREE.Scene();

  grid();
// ==================================== SCENE ENVIRONMENTS =========================================
// if (target != undefined) {
//   let bg = scenes[target].background;
//   if (typeof bg === "string") {
//     document.body.style.backgroundImage = `url('../assets/image/${bg}')`;
//   } else {
//     scene.background = bg;
//   }
// } else {
//   console.log("background is..."); 
//   console.log(scenes);
//   console.log(scenes["retro"].background);
//   scene.background = scenes["retro"].background;
// }

// ======================================SCENE MODELS ==============================================

// if (target != undefined) {
//   scene.background = scenes[target].background;
// } else {
//   console.log("background is..."); 
//   console.log(scenes);
//   console.log(scenes["retro"].background);
//   scene.background = scenes["retro"].background;
// }

  // const textureLoader = new THREE.TextureLoader();

  // // model loader
  // const loadingManager = new THREE.LoadingManager( function () {
  //   let sceneModels = scene.models();
  //   for (let e in sceneModels) {
  //     scene.add( e );
  //   }
  //     // need to remove mirror modifiers
  //     // scene.add( ship );
  //     // scene.add( aku );
  //     // scene.add( starya );
  // } );
  // console.log(`global models is ${globalModels}`);

  // glbLoader.load( "../assets/model/drone_lp.glb" , function ( obj ) {
  //     droneB = obj.scene;
  //     mixer = new THREE.AnimationMixer( obj.scene );
  //     const clips = obj.animations;
  //     clips.forEach( function ( clip ) {
  //       mixer.clipAction( clip ).play();
  //     } );
  //     mixers.push(clips);
  //     models.push(droneB);
  //     scene.add(droneB);
  // } );

  umnScene();
  $.fn.load("drone", "drone_lp.glb");

  // wil need mixer and entity array. May make javascript class to dry up code.

  // glbLoader.load( "../assets/model/starya.glb" , function ( obj ) {
  //     starya = obj.scene;
  //     // mixer = new THREE.AnimationMixer( obj.scene );
  //     // const clips = obj.animations;
  //     // clips.forEach( function ( clip ) {
  //     //   mixer.clipAction( clip ).play();
  //     // } );
  // } );

  // glbLoader.load( "../assets/model/aku.glb" , function ( obj ) {
  //   aku = obj.scene;
  //   // mixer = new THREE.AnimationMixer( obj.scene );
  //   // const clips = obj.animations;
  //   // clips.forEach( function ( clip ) {
  //   //   mixer.clipAction( clip ).play();
  //   // } );
  // } );

  // glbLoader.load( "../assets/model/ship.glb" , function ( obj ) {
  //   ship = obj.scene;
  //   // mixer = new THREE.AnimationMixer( obj.scene );
  //   // const clips = obj.animations;
  //   // clips.forEach( function ( clip ) {
  //   //   mixer.clipAction( clip ).play();
  //   // } );
  // } );

  const ambientLight = new THREE.AmbientLight( 0xffffff, 1 );
  scene.add( ambientLight );
  const light = new THREE.DirectionalLight( 0xffffff, 1 );
  light.position.set( 10, 10, 10 );
  scene.add( ambientLight, light );
  const light2 = new THREE.DirectionalLight( 0xffffff, 1 );
  light2.position.set( 0, 10, -10 );
  scene.add( ambientLight, light2 );

  // const gridHelper = new THREE.GridHelper( gridSize, gridDivisions, 0x00EE22, 0x000077);
  // scene.add( gridHelper );

  // random sphere test code
  // {
  //   const geometry = new THREE.SphereGeometry( 15, 32, 16 );
  //   const material = new THREE.MeshBasicMaterial( { color: 0x004421 } );
  //   const sphere = new THREE.Mesh( geometry, material );
  //   scene.add( sphere );
  // }

  // loadObj("umn/umn.obj", "umn/umn.mtl");
    // scene.background = new THREE.Color(0x000);

  renderer = new THREE.WebGLRenderer( { container, alpha: true, antialias: true } );
  renderer.setSize( window.innerWidth, window.innerHeight );
  // renderer.outputEncoding = THREE.sRGBEncoding;
  document.body.appendChild( renderer.domElement );
  // renderer.setClearColor(0xffffff);

  // start the animation/render loop
  renderer.setAnimationLoop( () => {
    update();
    render();
  });
}

var time = 0.0;
var updateReady = true;

// This function updates the scene's animation cycle.
function update() {
  // Get the time since the last animation frame.
  const delta = clock.getDelta();
  time += delta;

  // for (const m of globalModels) {
  //   globalModels[m].scale.x = 0.5;
  //   globalModels[m].scale.y = 0.5;
  //   globalModels[m].scale.z = 0.5;
  // }

  if ( droneB !== undefined ) {
    // drone.rotation.y += delta * 0.5;
    // droneB.scale.x = 0.5;
    // droneB.scale.y = 0.5;
    // droneB.scale.z = 0.5;
    // if ( mixer ) mixer.update( delta );
  }

  // let i = $.fn.getWeather();

  // Iterate through and update the animation mixers for each object in the
  // scene.
  // for (const clips of mixers) {
  //   clips.forEach( function ( clip ) {
  //     mixer.clipAction( clip ).play();
  //   } );
  //   // if (mixer.start == undefined || mixer.duration == undefined) {
  //   //   mixer.mixer.update(delta);
  //   // }
  //   // else {
  //   //   var newTime = time - mixer.start;
  //   //   var iterations = Math.floor(newTime / mixer.duration);
  //   //   newTime = newTime - iterations * mixer.duration + mixer.start;
  //   //   mixer.mixer.setTime(newTime);
  //   // }
  // }

  // if (weatherType[i] == "snow") {
  //   snow.geometry.vertices.forEach(particle => {
  //     //BLIZZARD
  //     particle.y -= 0.6;
  //     particle.x += .6;
  //     if (particle.y < 0) {
  //       particle.x = Math.random() * 500 + -250;
  //       particle.y = Math.random() * 500 + -250;
  //       particle.z = Math.random() * 500 + -250;
  //     }
  //     //LIGHT SNOW
  //     // particle.y -= 0.05;
  //     // particle.x += Math.random() * .05 + -0.025;
  //     // particle.x += Math.random() * .05 + -0.025;
  //     // if (particle.y >40) {
  //     //   particle.y = -10
  //     //   }
  //   });
  //   snow.geometry.verticesNeedUpdate = true;
  // } else if (weatherType[i] == "rain") {
  //   rain.geometry.vertices.forEach(p => {
  //     p.y -= 0.8;
  //     p.x -= 0.8;
  //     // p.x += Math.random() * .05 + -0.025;
  //     // p.x += Math.random() * .05 + -0.025;
  //     if (p.y < 0) {
  //       p.x = Math.random() * 500 + -250;
  //       p.y = Math.random() * 500 + -250;
  //       p.z = Math.random() * 500 + -250;
  //     }
  //   });
  //   rain.geometry.verticesNeedUpdate = true;
  // } else if (weatherType[i] == "tornado") {
  //   let tct = 0;
  //   tornado.forEach(t => {
  //     if (tct % 2 == 0) {
  //       t.rotation.y += (0.15 * (1 - tct / 70));
  //     } else {
  //       t.rotation.y -= (0.15 * (1 - tct / 70));
  //     }
  //     t.x += 0.1;
  //     t.geometry.verticesNeedUpdate = true;
  //     tct++;
  //   });
  // }


  // Send the update command to the socket.
  // if (connected) {
  //   //socket.send(JSON.stringify({command: "update", delta: delta}));
  //   socket.send(JSON.stringify({ command: "update", delta: delta, simSpeed: simSpeed }));
  // }


  if (updateReady) {
    api.sendCommand("update", {delta: delta, simSpeed: simSpeed}).then(function(updateData) {
      updateReady = true;
    });
    updateReady = false;
  }

}

// This function simply renders the scene based on the camera position.
function render() {

  // update the picking ray with the camera and mouse position
	// raycaster.setFromCamera( mouse, camera );

	// // calculate objects intersecting the picking ray
	// const intersects = raycaster.intersectObjects( scene.children );

	// for ( let i = 0; i < intersects.length; i ++ ) {
	// 	intersects[ i ].object.material.color.set( 0xff0000 );
	// }

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

	// calculate mouse position in normalized device coordinates
	// (-1 to +1) for both components

	// mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	// mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

}

window.addEventListener( 'mousemove', onMouseMove, false );
window.requestAnimationFrame(render);
