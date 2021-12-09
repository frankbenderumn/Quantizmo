import { Scene,
    Color,
    PerspectiveCamera,
    WebGLRenderer,
    AmbientLight,
    DirectionalLight,
    BoxBufferGeometry,
    MeshBasicMaterial,
    MeshLambertMaterial,
    MeshStandardMaterial,
    Mesh,
    Clock,
    Object3D,
    sRGBEncoding
        } from 'https://cdn.skypack.dev/three@0.134.0';
import * as Loader from './loader.js';
import { Controls } from './controls.js';
import { VRButton } from 'https://cdn.skypack.dev/three/examples/jsm/webxr/VRButton.js';
import { CanvasUI } from './ui/canvas.js';
import { TetrahedronGeometry } from '../three.module.js';

export function createCamera() {
  // const camera = new PerspectiveCamera( 55, window.innerWidth / window.innerHeight, 1, 1000 );
  // camera.position.set( -10, 10, 10 );//30, 30, 100 );
  const camera = new PerspectiveCamera(
    35, // fov = Field Of View
    1, // aspect ratio (dummy value)
    0.1, // near clipping plane
    5000, // far clipping plane
  );

  // move the camera back so we can view the scene
  camera.position.set(0, 0, 10);
  return camera;
}

export async function createModelAsync(path) {
  let m = await Loader.load(path);
  return m;
}

export function createModel(path) {
  let m = Loader.load(path);
  return m;
}

export function createUI() {
  const config = {
      header:{
          type: "text",
          position:{ top:0 },
          paddingTop: 30,
          height: 70
      },
      main:{
          type: "text",
          position:{ top:70 },
          height: 372, // default height is 512 so this is 512 - header height:70 - footer height:70
          backgroundColor: "#bbb",
          fontColor: "#000"
      },
      footer:{
          type: "text",
          position:{ bottom:0 },
          paddingTop: 30,
          height: 70
      },
      panelSize: { width: 3, height: 3 } 
  }
  const content = {
      header: "Uncharted Territory Research Project",
      main: "Welcome to stocket!",
      footer: "Footer"
  }
  return new CanvasUI( content, config );
}

export function createD3(data) {
    const config = {
      header:{
          type: "text",
          position:{ top:0 },
          paddingTop: 30,
          height: 70
      },
      main:{
          type: "text",
          position:{ top:70 },
          height: 372, // default height is 512 so this is 512 - header height:70 - footer height:70
          backgroundColor: "#bbb",
          fontColor: "#000"
      },
      footer:{
          type: "text",
          position:{ bottom:0 },
          paddingTop: 30,
          height: 70
      },
      panelSize: { width: 3, height: 3 } 
  }
  const content = {
      header: data.companyName + "",
      main: data.iexOpen + "",
      footer: data.high + ""
  }

  // let uiElement = document.getElementById('dag');
  // navigator.xr.requestSession('immersive-ar', {
  //     optionalFeatures: ['dom-overlay'],
  //     domOverlay: { root: uiElement } }).then((session) => {
  //     // session.domOverlayState.type is now set if supported,
  //     // or is null if the feature is not supported.
  //   }
  // }

  return new CanvasUI( content, config );
}

export function createSocket() {
  return new WSApi();
}

export function createLights() {
  const lights = [];
  const ambient = new AmbientLight( 0xffffff, 1.0);
  // scene.add( ambientLight );
  const dir1 = new DirectionalLight( 0xffffff, 1.0 );
  dir1.position.set( 10, 10, 10 );
  // scene.add( ambientLight, light );
  const dir2 = new DirectionalLight( 0xffffff, 1.0 );
  dir2.position.set( 0, 10, -10 );
  lights.push(ambient);
  lights.push(dir1);
  lights.push(dir2);
  return lights;
  // scene.add( ambientLight, light2 );
}

export function createScene() {
  let scene = new Scene();
  scene.background = new Color('black');
  return scene;
}

export function createCube() {
  // create a geometry
  const geometry = new BoxBufferGeometry(2, 2, 2);

  // create a default (white) Basic material
  const material = new MeshBasicMaterial();

  // create a Mesh containing the geometry and material
  const cube = new Mesh(geometry, material);

  cube.position.x = 10;

  cube.update = (dt) => {
    cube.rotation.x += 2 * dt;
  }

  return cube;
}

export function createJarvis() {
  let group = new Object3D();
  let num = 4;
  for(let i = -1 * num; i < num + 1; i++) {
    for(let j = -1 * num; j < num + 1; j++) {
      for(let k = -1 * num; k < num + 1; k++) {
        let geometry = new BoxBufferGeometry(0.1, 0.1, 0.1);
        let material = new MeshStandardMaterial({color: 0x007777, roughness: 0.7});
        let cube = new Mesh(geometry, material);
        cube.position.x = j * 0.3 + 0.1;
        cube.position.y = i * 0.3 + 0.1;
        cube.position.z = k * 0.3 + 0.1;
        group.add(cube);
      }
    }
  }

  let counter = 0;

  group.update = (dt) => {
    group.rotation.x += 2 * dt;
    group.rotation.y += 1 * dt;
    let ct = 1;
    let nums = num * num * num;
    let nums2 = num * num;
    for (let e of group.children) {
      e.rotation.z += group.rotation.x * (ct / nums) * dt;
      e.rotation.y += 1 * (ct / nums) * dt;
      ct++;
      e.position.x += 0.1 * Math.cos(0.5 * counter);
      e.position.z += 0.1 * Math.sin(0.5 * counter);
      counter++;
    }
  }

  return group;
}

export function createRenderer(container, vr = false) {
  if (!vr) {
    // const renderer = new WebGLRenderer( {container, alpha: true});
    // return renderer;
  } else {
    const renderer = new WebGLRenderer( { alpha: true, antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.outputEncoding = sRGBEncoding;
    renderer.xr.enabled = true;
    renderer.autoClear = true;
    document.body.appendChild( VRButton.createButton( renderer ) );
    return renderer;
  }
}

export function createControls(camera, canvas) {
  const controls = new Controls(camera, canvas);

  // damping and auto rotation require
  // the controls to be updated each frame

  // this.controls.autoRotate = true;
  // controls.enableDamping = true;

  // controls.tick = () => controls.update();

  return controls;
}