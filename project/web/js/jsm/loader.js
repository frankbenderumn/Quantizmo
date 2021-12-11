import * as THREE from 'https://cdn.skypack.dev/three@0.134.0'
import { ColladaLoader } from 'https://cdn.skypack.dev/three/examples/jsm/loaders/ColladaLoader.js';
import { GLTFLoader } from 'https://cdn.skypack.dev/three/examples/jsm/loaders/GLTFLoader.js';
import { OBJLoader } from 'https://cdn.skypack.dev/three/examples/jsm/loaders/OBJLoader.js';
import { FBXLoader } from 'https://cdn.skypack.dev/three/examples/jsm/loaders/FBXLoader.js';
import { MTLLoader } from 'https://cdn.skypack.dev/three/examples/jsm/loaders/MTLLoader.js';

// const manager = THREE.LoadingManager();
const colladaLoader = new ColladaLoader();
const glbLoader = new GLTFLoader();
const objLoader = new OBJLoader();
const fbxLoader = new FBXLoader();
const mtlLoader = new MTLLoader();

let dir = "../assets/models/";

export function setDir(d) {
    dir = d;
}

export async function load(params) {
    let arr = params.path.split('.');
    let ext = arr[arr.length - 1];
    let m;
    switch (ext) {
        case "glb":
            m = await loadGlb(params);
            break;
        case "obj":
            m = await loadObj(params);
            break;
        case "dae":
            m = await loadCollada(params);
            break;
        case "fbx":
            m = await loadFbx(params);
            break;
        default:
            console.log("invalid model type in Loader");
            break;
    }
    console.log("m is:");
    console.log(m);
    return m;
}

// could be beneficial to switch to async loader and await models
export async function loadGlb(params, dynamic = true) {
    let data = await glbLoader.loadAsync(`${dir}${params.path}`);
    return format(data, params, dynamic);
}

export async function loadCollada(params, dynamic = true) {
    let data = await colladaLoader.loadAsync(`${dir}${params.path}`);
    return format(data, params, dynamic);
}

export async function loadFbx(params, dynamic = true) {
    let data = await fbxLoader.loadAsync(`${dir}${params.path}`);
    return format(data, params, dynamic);
}


function format(obj, params, dynamic) {
    let model = obj.scene;

    model.position.copy(new THREE.Vector3(params.position.x, params.position.y, params.position.z))
    model.rotation.copy(params.rotation)
    model.scale.copy(new THREE.Vector3(params.scale.x, params.scale.y, params.scale.z)) //*1.41

    let mixer = new THREE.AnimationMixer(model);
    const animations = obj.animations;
    animations.forEach( function ( clip ) {
        mixer.clipAction( clip ).play();
    } );

    let o = {
        entityId: params.entityId,
        name: params.name,
        model: model,
        mixer: mixer,
        type: params.type,
        dynamic: dynamic,
        path: params.path
    }

    return o;
}

let onProgress = function(xhr) {
    if ( xhr.lengthComputable ) {
        const percentComplete = xhr.loaded / xhr.total * 100;
        console.log( Math.round( percentComplete, 2 ) + '% downloaded' );
        if (percentComplete == 100) {
        console.log("Model loaded");
        }
    }
};

let onError = function() { console.log("failed to load model"); };

export function umn(scene) {
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
            //node.material = new THREE.MeshDepthMaterial();
          }
          else if (node.name == "Areas:building") {
            var material = new THREE.MeshStandardMaterial({ color: 0x85868f, map: texture2 });
            node.material = material;
            //node.material = new THREE.MeshDepthMaterial();
          }
          else if (!node.isGroup) {
            node.visible = false;
          }
          console.log(node);
  
        });
  
        // models.push(object);
        scene.add(object);
      }, onProgress, onError);
  }