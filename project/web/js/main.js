// Web Sockets API for communication with the backend
var api = new WSApi();

// More important related to models and animation.
var camera;
var controls;
var scene;
var container = document.querySelector( '#scene-container' );
const clock = new THREE.Clock();
const objloader = new THREE.OBJLoader();
var simSpeed = 1.0;
let drone, ship, starya, aku;

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

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

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
  // scene.background = new THREE.Color( 0x000 );

  // adding matrix theme grid
  const gridSize = 1000;
  const gridDivisions = 500;

  const gridHelper = new THREE.GridHelper( gridSize, gridDivisions, 0xffffff, 0xffffff );
  scene.add( gridHelper );

  const textureLoader = new THREE.TextureLoader();

  // anononymous skybox addition
  {
    const loader = new THREE.CubeTextureLoader();
    const texture = loader.load([
      // 'https://threejsfundamentals.org/threejs/resources/images/cubemaps/computer-history-museum/pos-x.jpg',
      // 'https://threejsfundamentals.org/threejs/resources/images/cubemaps/computer-history-museum/neg-x.jpg',
      // 'https://threejsfundamentals.org/threejs/resources/images/cubemaps/computer-history-museum/pos-y.jpg',
      // 'https://threejsfundamentals.org/threejs/resources/images/cubemaps/computer-history-museum/neg-y.jpg',
      // 'https://threejsfundamentals.org/threejs/resources/images/cubemaps/computer-history-museum/pos-z.jpg',
      // 'https://threejsfundamentals.org/threejs/resources/images/cubemaps/computer-history-museum/neg-z.jpg',
      '../assets/texture/matrixrt.jpg',
      '../assets/texture/matrixlf.jpg',
      '../assets/texture/matrixup.jpg',
      '../assets/texture/matrixdn.jpg',
      '../assets/texture/matrixft.jpg',
      '../assets/texture/matrixbk.jpg',
    ]);
    // scene.background = texture;
  }

  // model loader
  const loadingManager = new THREE.LoadingManager( function () {
      scene.add( drone );
      // need to remove mirror modifiers
      // scene.add( ship );
      scene.add( aku );
      scene.add( starya );
  } );

  let defaultSize = new THREE.Vector3(5, 5, 5);
  const loader = new THREE.GLTFLoader( loadingManager );

  loader.load( "../assets/model/drone_lp.glb" , function ( obj ) {
      drone = obj.scene;
      mixer = new THREE.AnimationMixer( obj.scene );
      const clips = obj.animations;
      clips.forEach( function ( clip ) {
        mixer.clipAction( clip ).play();
      } );
  } );

  // wil need mixer and entity array. May make javascript class to dry up code.

  loader.load( "../assets/model/starya.glb" , function ( obj ) {
      starya = obj.scene;
      // mixer = new THREE.AnimationMixer( obj.scene );
      // const clips = obj.animations;
      // clips.forEach( function ( clip ) {
      //   mixer.clipAction( clip ).play();
      // } );
  } );

  loader.load( "../assets/model/aku.glb" , function ( obj ) {
    aku = obj.scene;
    // mixer = new THREE.AnimationMixer( obj.scene );
    // const clips = obj.animations;
    // clips.forEach( function ( clip ) {
    //   mixer.clipAction( clip ).play();
    // } );
  } );

  loader.load( "../assets/model/ship.glb" , function ( obj ) {
    ship = obj.scene;
    // mixer = new THREE.AnimationMixer( obj.scene );
    // const clips = obj.animations;
    // clips.forEach( function ( clip ) {
    //   mixer.clipAction( clip ).play();
    // } );
  } );

  const ambientLight = new THREE.AmbientLight( 0xffffff, 1 );
  scene.add( ambientLight );
  const light = new THREE.DirectionalLight( 0xffffff, 1 );
  light.position.set( 10, 10, 10 );
  scene.add( ambientLight, light );
  const light2 = new THREE.DirectionalLight( 0xffffff, 1 );
  light2.position.set( 0, 10, -10 );
  scene.add( ambientLight, light2 );

  renderer = new THREE.WebGLRenderer( { container, alpha: true, antialias: true } );
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

  if ( drone !== undefined ) {
    // drone.rotation.y += delta * 0.5;
    drone.scale.x = 0.5;
    drone.scale.y = 0.5;
    drone.scale.z = 0.5;
    if ( mixer ) mixer.update( delta );
  }

  if ( starya !== undefined ) {
    // drone.rotation.y += delta * 0.5;
    starya.position.x = 3.5;
    starya.position.y = 3.5;
    starya.position.z = 0.5;
    // if ( mixer ) mixer.update( delta );
  }

  if ( ship !== undefined ) {
    // drone.rotation.y += delta * 0.5;
    ship.position.x = 2.5;
    ship.position.y = 2.5;
    ship.position.z = 2.5;
    // if ( mixer ) mixer.update( delta );
  }

  if ( aku !== undefined ) {
    // drone.rotation.y += delta * 0.5;
    aku.position.x = 5.5;
    aku.position.y = 0.5;
    aku.position.z = 0.5;
    // if ( mixer ) mixer.update( delta );
  }

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
	raycaster.setFromCamera( mouse, camera );

	// calculate objects intersecting the picking ray
	const intersects = raycaster.intersectObjects( scene.children );

	for ( let i = 0; i < intersects.length; i ++ ) {
		intersects[ i ].object.material.color.set( 0xff0000 );
	}

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

	mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

}

window.addEventListener( 'mousemove', onMouseMove, false );
window.requestAnimationFrame(render);
