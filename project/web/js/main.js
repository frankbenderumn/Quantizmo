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
import { Rain } from './addons/weather/rain.js';
import { Tornado } from './addons/weather/tornado.js';
import { Snow } from './addons/weather/snow.js';
import { Water } from 'https://cdn.skypack.dev/three@0.132.2/examples/jsm/objects/Water.js';


// Web Sockets API for communication with the backend
var api = new WSApi();
// let models = [];
const glbLoader = new GLTFLoader();
let models = [];
let mixers = [];
// var camera;
var controls;
var scene;
var container = document.querySelector( '#scene-container' );
const clock = new THREE.Clock();
const objLoader = new OBJLoader();
const colladaLoader = new ColladaLoader();
var simSpeed = 1.0;
var target = "umn";
let alertCounter = 0;
let bgTexture;
let droneB;
let renderer;
// let mixer;
let umnObj;
let weather = -1;
let rain, tornado, snow;
let sun, water, sky, stats;
let imesh;
let ocean;
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

// notify examples
// $.fn.notify(1, "test failure!");
// $.fn.notify(0, "drone has successfully been instantiated!");
// $.fn.notify(2, "Need to create console logger function!");
// $.fn.notify(3, "This is risky behavior!");

const onProgress = function(xhr) {

  if ( xhr.lengthComputable ) {

    const percentComplete = xhr.loaded / xhr.total * 100;
    console.log( Math.round( percentComplete, 2 ) + '% downloaded' );

    if (percentComplete == 100) {
      $.fn.notify(0, "Model loaded");
    }

  }

};

const onError = function() { console.log("failed to load model"); };

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

      // models.push(object);
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
  constructor(name, path, scene = '') {
    this.name = name;
    this.path = path;
    this.scene = scene;
  }
  scene() {
    return this.scene;
  }
  load() {
    $.fn.load(this.path);
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

$.fn.load = (params, dynamic = true) => {
  let arr = params.path.split('.');
  let ext = arr[arr.length - 1];
  console.log(`loading ${arr[0]} with dynamic set to ${dynamic}`);
  switch (ext) {
    case "glb":
      $.fn.loadGlb(params, dynamic);
      break;
    case "obj":
      $.fn.loadObj(params, dynamic, params.mtl);
      break;
    case "dae":
      $.fn.loadCollada(params, dynamic);
      break;
    default:
      $.fn.notify(1, "Invalid model type");
      break;
  }
};

$.fn.loadGlb = (params, dynamic) => {
  console.log(`${params.name} at ../assets/model/${params.path} attempting to be loaded`);
  glbLoader.load( `../assets/model/${params.path}`, function (obj) {

    let model = obj.scene;

    model.position.copy(new THREE.Vector3(params.position[0], params.position[1], params.position[2]))
    model.scale.copy(new THREE.Vector3(params.scale[0], params.scale[1], params.scale[2])) //*1.41

    let mixer = new THREE.AnimationMixer( obj.scene );
    const clips = obj.animations;
    clips.forEach( function ( clip ) {
      mixer.clipAction( clip ).play();
    } );
    mixers.push(clips);

    if (dynamic) {
      let m = new Model(params.name, params.path, model);
      models.push(m);
    }
    scene.add(model);
  }, onProgress, onError(name));
};

$.fn.loadCollada = (params, dynamic) => {
  console.log(`${params.name} at ../assets/model/${params.path} attempting to be loaded`);
  colladaLoader.load( `../assets/model/${params.path}`, function (obj) {

    let model = obj.scene;

    model.position.copy(new THREE.Vector3(params.position[0], params.position[1], params.position[2]))
    model.scale.copy(new THREE.Vector3(params.scale[0], params.scale[1], params.scale[2])) //*1.41

    // let mixer = new THREE.AnimationMixer( obj.scene );
    // const clips = obj.animations;
    // clips.forEach( function ( clip ) {
    //   mixer.clipAction( clip ).play();
    // } );
    // mixers.push(clips);

    if (dynamic) {
      let m = new Model(params.name, params.path, model);
      models.push(m);
    }
    scene.add(model);
  }, onProgress, onError(name));
};

$.fn.loadObj = (params, dynamic, mtl) => {
  let mtlLoader = new MTLLoader();
  mtlLoader.load( `../assets/model/${mtl}`, function( materials ) {

      materials.preload();

      objLoader.setMaterials( materials );
      objLoader.load( `../assets/model/${params}`, function ( object ) {

          if (dynamic) {
            models.push(object);
          }

          scene.add(object.scene);

      }, onProgress, onError(name) );

  });
};

$.fn.runJson = (file, initialScene = true) => {
  sceneFile = `./js/scenes/${file}`;
  $.getJSON(sceneFile, function (json) {
    console.log(json);
    for (var i = 0; i < json.length; i++) {
      var command = json[i];
      console.log(command);
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
        if (command.params.type != "actor") {
          $.fn.load(command.params, false);
        } else {
          $.fn.load(command.params);
        }
        api.sendCommand("createEntity", command.params);
      }
      if (command.command == "terrain") {
        $.fn.load(command.params, false);
      }
    }
  });
}

const views = [
  {
    name: "main",
    left: 0,
    bottom: 0,
    width: 1.0,
    height: 1.0,
    background: new THREE.Color( 0.5, 0.5, 0.7 ),
    eye: [ 0, 300, 1800 ],
    up: [ 0, 1, 0 ],
    fov: 30,
    updateCamera: function ( camera, scene, mouseX, mouseY ) {
      // camera.position.x += 0.05;
      // camera.position.x = Math.max( Math.min( camera.position.x, 2000 ), - 2000 );
      camera.lookAt( scene.position );
    }
  },
  {
    main: "actor",
    left: 0.66,
    bottom: 0.20,
    width: 0.25,
    height: 0.25,
    background: new THREE.Color( 0.7, 0.5, 0.5 ),
    eye: [ 0, 1800, 0 ],
    up: [ 0, 0, 1 ],
    fov: 45,
    updateCamera: function ( camera, scene, mouseX, mouseY ) {
      // camera.position = new THREE.Vector3(0, 0, 0);
      camera.position.x = Math.max( Math.min( camera.position.x, 2000 ), - 2000 );
      camera.lookAt( scene.position );

    }
  }
];

let aquatic = new Scene("aquatic", "aquatic.jpg", ["drone", "starya", "aku"]);
let mountain = new Scene("mountain", "darkstorm.jpg", ["drone", "starya", "aku"]);
let umn = new Scene("umn", new THREE.Color(0x00dddd), ["drone", "starya", "aku"]);
let space = new Scene("space", "stars.jpeg", []);
let retro = new Scene("retro", "glitch.jpeg", ["drone", "starya", "aku"]);
let ikea = new Scene("ikea", "cyber.jpeg", []);
let pompeii = new Scene("pompeii", new THREE.Color(0x00dddd), ["drone", "starya", "aku"]);

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

function saveAsImage() {
  var imgData, imgNode;
  try {
      var strMime = "image/jpeg";
      imgData = renderer.domElement.toDataURL(strMime);
      api.sendCommand("image", {url: imgData});
      saveFile(imgData.replace(strMime, strDownloadMime), "test.jpg");
  } catch (e) {
      console.log(e);
      return;
  }

}

var saveFile = function(strData, filename) {
  var link = document.createElement('a');
  if (typeof link.download === 'string') {
      document.body.appendChild(link); //Firefox requires the link to be in the body
      link.download = filename;
      link.href = strData;
      link.click();
      document.body.removeChild(link); //remove the link when done
  } else {
      location.replace(uri);
  }
}

function grid() {
  const gridSize = 1000;
  const gridDivisions = 500;
  const gridHelper = new THREE.GridHelper( gridSize, gridDivisions, 0x00EE22, 0x000077);
  if (gridGate == true) {
    scene.add( gridHelper );
  }
}

function base(){
  // ======================================SUN AND OCEAN==============================================
  sun = new THREE.Vector3();
  // Skybox
  sky = new Sky();
  sky.scale.setScalar( 10000 );
  scene.add( sky );

  const skyUniforms = sky.material.uniforms;

  skyUniforms[ 'turbidity' ].value = 10;
  skyUniforms[ 'rayleigh' ].value = 2;
  skyUniforms[ 'mieCoefficient' ].value = 0.005;
  skyUniforms[ 'mieDirectionalG' ].value = 0.8;

  const parameters = {
    elevation: 2,
    azimuth: 180
  };

  const pmremGenerator = new THREE.PMREMGenerator( renderer );

  function updateSun() {

    const phi = THREE.MathUtils.degToRad( 90 - parameters.elevation );
    const theta = THREE.MathUtils.degToRad( parameters.azimuth );

    sun.setFromSphericalCoords( 1, phi, theta );

    sky.material.uniforms[ 'sunPosition' ].value.copy( sun );
    if (target == "pompeii") {
      ocean.water.material.uniforms['sunDirection'].value.copy(sun).normalize();
    }

    scene.environment = pmremGenerator.fromScene( sky ).texture;

  }

  updateSun();

  // rain = new Rain(scene);
  // rain.init();

  // tornado = new Tornado(scene);
  // tornado.init();

  // snow = new Snow(scene);
  // snow.init();

  // define controls
  controls = new OrbitControls( camera, container );
  controls.maxPolarAngle = Math.PI * 0.695;
  controls.target.set( 0, 10, 0 );
  controls.minDistance = 40.0;
  controls.maxDistance = 1000.0;
  controls.update();
  

// ==========================================WEATHER================================================


}

// creates multiple cameras to support render slice
function viewports() {
  for ( let ii = 0; ii < views.length; ++ ii ) {
    const view = views[ ii ];
    // const camera = new THREE.PerspectiveCamera( view.fov, window.innerWidth / window.innerHeight, 1, 10000 );
    const camera = new THREE.PerspectiveCamera( fov, aspect, near, far );
    // camera.position.fromArray( view.eye );
      camera.position.set( -10, 10, 10 );
      // camera.up.fromArray( view.up );
      view.camera = camera;
      // if (view.name == "main") {
      controls = new OrbitControls( view.camera, container );
      // } else {
      //   controls = new OrbitControls( view.camera, container ); 
      // }
  }
};

// This function runs the scene
$.fn.run = () => {
  camera = new THREE.PerspectiveCamera( 55, window.innerWidth / window.innerHeight, 1, 20000 );
  camera.position.set( 30, 30, 100 );
  scene = new THREE.Scene();
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

  // runs the json to send it to the backend for processing

  // const waterGeometry = new THREE.PlaneBufferGeometry(100000, 100000);
  // waterGeometry.renderOrder = 2;
  // water = new Water(
  //     waterGeometry,
  //     {
  //     textureWidth: 512,
  //     textureHeight: 512,
  //     waterNormals: new THREE.TextureLoader().load('../assets/texture/waternormals.jpg', function (texture) {
  //         texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  //     }),
  //     alpha: 1,
  //     sunDirection: new THREE.Vector3(),
  //     sunColor: 0xffffff,
  //     waterColor: 0x001e0f,
  //     distortionScale: 0,
  //     size: 0.1,
  //     // fog: scene.fog !== undefined
  //     }
  // );
  // water.rotation.x = - Math.PI / 2;
  // water.position.y = -10;

  // ============================== SCENE ADD ONS AND ENVIRONMENTS==================================
  switch (target) {
    case "umn":
      weather = -1;
      break;
    case "aquatic":
      grid();
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

      // scene.add(water);
      // const gui = new GUI();
      break;
    case "mountain":
      grid();
      break;
    case "ikea":
      grid();
      break;
    case "retro":
      break;
    default:
      break;
  }

  if (target === "umn") {
    umnScene();
  }

  $.fn.runJson(`${target}.json`);

  //========================================SCENE LIGHTING==========================================
  const ambientLight = new THREE.AmbientLight( 0xffffff, 0.5 );
  scene.add( ambientLight );
  const light = new THREE.DirectionalLight( 0xffffff, 0.5 );
  light.position.set( 10, 10, 10 );
  scene.add( ambientLight, light );
  const light2 = new THREE.DirectionalLight( 0xffffff, 0.5 );
  light2.position.set( 0, 10, -10 );
  scene.add( ambientLight, light2 );
  scene.add(umnObj);

  //====================================SCENE RENDERER==============================================
  // code to allow screenshot
  var saveLink = document.createElement('div');
  saveLink.style.position = 'absolute';
  saveLink.style.top = '60px';
  saveLink.style.width = '100%';
  saveLink.style.color = 'white !important';
  saveLink.style.textAlign = 'center';
  saveLink.innerHTML =
      '<a href="#" id="saveLink">Save Frame</a>';
  document.body.appendChild(saveLink);
  document.getElementById("saveLink").addEventListener('click', saveAsImage);

  // prevents multiple canvases from being generated on scene change
  $('canvas:nth-of-type(1)').remove();
  renderer = new THREE.WebGLRenderer( { container, alpha: true, antialias: true } );
  renderer.setSize( window.innerWidth, window.innerHeight );
  document.body.appendChild( renderer.domElement );

  // screenshot export type
  var strMime = "image/jpeg";
  var imgData = renderer.domElement.toDataURL(strMime);

  // adds extra aesthetic code (may refactor to modules)
  base();

  // start the animation/render loop
  renderer.setAnimationLoop( () => {
    update();
    render();
  });
}

// This is the function that is called once the document is started.
$.fn.run();


$( document ).ready(function() {


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

var strDownloadMime = "image/octet-stream";
var time = 0.0;

// This function updates the scene's animation cycle.
function update() {
  // Get the time since the last animation frame.
  if (models.length >= 1) {
    updateReady = true;
  }

  const delta = clock.getDelta();
  time += delta;

    //temporary work around to force models to be loaded first

  controls.update();

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

  switch (weather) {
    case -1:
      break;
    case 0:
      rain.update();
      break;
    case 1:
      snow.update();
      break;
    case 2:
      tornado.update();
      break;
    default:
      break;
  }

  if (target == "pompeii") {
    ocean.update();
  }

  if (updateReady) {
    console.log("models are: ...");
    console.log(models);
    api.sendCommand("update", {delta: delta, simSpeed: simSpeed}).then(function(updateData) {
      let data = updateData;
      console.log(data);
      // if (data.entity0 != undefined && data.entity1 != undefined && data.entity2 != undefined ) {
        for (let e in data) {
          // console.log(models.length);
          console.log(data[e].entityId);
          if (data[e].type == "Actor") {
            models[0].scene.position.copy(new THREE.Vector3(data[e].position.x, data[e].position.y, data[e].position.z));
            models[0].scene.rotation.x = data[e].direction.x;
            models[0].scene.rotation.y = data[e].direction.y;
            // models[0].scene.rotation.z = data[e].direction.z;
            // models[0].scene.rotation.copy(new THREE.Vector3(data[e].direction.x, data[e].direction.y, data[e].direction.z));
            // console.log(models[data[e].entityId].scene);
            // console.log("updating actor!");
          }
        // }
      }
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

  // code that splits render to multiple viewports
  // for ( let ii = 0; ii < views.length; ++ ii ) {

  //   const view = views[ ii ];
  //   const camera = view.camera;

  //   // console.log(camera);

  //   view.updateCamera( camera, scene, mouseX, mouseY );

  //   const left = Math.floor( window.innerWidth * view.left );
  //   const bottom = Math.floor( window.innerHeight * view.bottom );
  //   const width = Math.floor( window.innerWidth * view.width );
  //   const height = Math.floor( window.innerHeight * view.height );

  //   renderer.setViewport( left, bottom, width, height );
  //   renderer.setScissor( left, bottom, width, height );
  //   renderer.setScissorTest( true );
  //   // renderer.setClearColor( view.background );

  //   camera.aspect = width / height;
  //   camera.updateProjectionMatrix();

  //   renderer.render( scene, camera );

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

    mouseX = ( event.clientX - window.innerWidth / 2 );
    mouseY = ( event.clientY - window.innerHeight / 2 );


}

window.addEventListener( 'mousemove', onMouseMove, false );
