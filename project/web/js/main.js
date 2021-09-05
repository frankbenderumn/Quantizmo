// Web Sockets API for communication with the backend
var api = new WSApi();

// More important related to models and animation.
var camera;
var controls;
var scene;
var container = document.querySelector( '#scene-container' );
const clock = new THREE.Clock();
const loader = new THREE.GLTFLoader();
const objloader = new THREE.OBJLoader();
var simSpeed = 1.0;

// This is the function that is called once the document is started.
$( document ).ready(function() {

  // Init() starts up the scene and its update loop.
  init();

  // Start checking for when the user resizes their application window.
  window.addEventListener( 'resize', onWindowResize );

  var keyAction = function(e) {
    console.log(e);
    api.sendCommand(e.type,{key: e.key, keyCode: e.keyCode});
  }

  document.onkeydown = keyAction;
  document.onkeyup = keyAction;
});

// This function defines the properties of the scene as well as starts the
// update loop.
function init() {
  const fov = 35; // fov = Field Of View
  const aspect = container.clientWidth / container.clientHeight;
  const near = 0.1;
  const far = 1000;

  camera = new THREE.PerspectiveCamera( fov, aspect, near, far );
  camera.position.set( -10, 10, 10 );
  controls = new THREE.OrbitControls( camera, container );

  scene = new THREE.Scene();
  scene.background = new THREE.Color( 'skyblue' );

  const textureLoader = new THREE.TextureLoader();

  const ambientLight = new THREE.AmbientLight( 0xffffff, 1 );
  scene.add( ambientLight );
  const light = new THREE.DirectionalLight( 0xffffff, 1 );
  light.position.set( 10, 10, 10 );
  scene.add( ambientLight, light );
  const light2 = new THREE.DirectionalLight( 0xffffff, 1 );
  light2.position.set( 0, 10, -10 );
  scene.add( ambientLight, light2 );

  renderer = new THREE.WebGLRenderer( { antialias: true } );
  renderer.setSize( window.innerWidth, window.innerHeight );
  document.body.appendChild( renderer.domElement );

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

  if (updateReady) {
    api.sendCommand("update", {delta: delta, simSpeed: simSpeed}).then(function(updateData) {
      updateReady = true;
    });
    updateReady = false;
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
