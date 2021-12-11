import * as THREE from './three.module.js.js';
import { ColladaLoader } from 'https://cdn.skypack.dev/three/examples/jsm/loaders/ColladaLoader.js';
import { GLTFLoader } from 'https://cdn.skypack.dev/three/examples/jsm/loaders/GLTFLoader.js';
import { OBJLoader } from 'https://cdn.skypack.dev/three/examples/jsm/loaders/OBJLoader.js';
import { MTLLoader } from 'https://cdn.skypack.dev/three/examples/jsm/loaders/MTLLoader.js';

const colladaLoader = new ColladaLoader();
const glbLoader = new GLTFLoader();
const objLoader = new OBJLoader();

export async function load(params) {
    let arr = params.path.split('.');
    let ext = arr[arr.length - 1];
    // console.log(`loading ${arr[0]} with dynamic set to ${dynamic}`);
    let model;
    switch (ext) {
        case "glb":
            model = await loadGlb(params);
            break;
        case "obj":
            model = await loadObj(params, params.mtl);
            break;
        case "dae":
            model = await loadCollada(params);
            break;
        default:
            console.log("invalid model type in Loader");
            break;
    }
    return model;
}

async function loadGlb(params) {
    console.log(`${params.name} at ../assets/model/${params.path} attempting to be loaded`);
    const data = await glbLoader.loadAsync( `../assets/model/${params.path}`);
    let model = data.scene;
    //, function (obj) {
    
    //     let model = obj.scene;

    //     console.log(`YIPPPPPPEEEE KI YAE ITS A`);
    
        model.position.copy(new THREE.Vector3(params.position[0], params.position[1], params.position[2]))
        model.scale.copy(new THREE.Vector3(params.scale[0], params.scale[1], params.scale[2])) //*1.41
    
    // //   let mixer = new THREE.AnimationMixer( obj.scene );
    // //   const clips = obj.animations;
    // //   clips.forEach( function ( clip ) {
    // //     mixer.clipAction( clip ).play();
    // //   } );
    // //   this.mixers.push(clips);
    
    //     // if (dynamic) {
    //     // let m = new Model(params.name, params.path, model);
    //         // models.push(model);
    //     // }
    //     // scene.add(model);
    return model;
    // }, onProgress, onError);
}

function loadCollada(params) {
    console.log(`${params.name} at ../assets/model/${params.path} attempting to be loaded`);
    colladaLoader.load( `../assets/model/${params.path}`, function (obj) {
    
        let model = obj.scene;
    
        model.position.copy(new THREE.Vector3(params.position[0], params.position[1], params.position[2]))
        model.scale.copy(new THREE.Vector3(params.scale[0], params.scale[1], params.scale[2])) //*1.41
    
        let mixer = new THREE.AnimationMixer( obj.scene );
        const clips = obj.animations;
        clips.forEach( function ( clip ) {
          mixer.clipAction( clip ).play();
        } );
        mixers.push(clips);
    
        // if (dynamic) {
        // let m = new Model(params.name, params.path, model);
        // models.push(model);
        // }
        return model;
    }, onProgress, onError);
}

function loadObj(params) {
    let mtlLoader = new MTLLoader();
    mtlLoader.load( `../assets/model/${mtl}`, function( materials ) {
    
        materials.preload();
    
        objLoader.setMaterials( materials );
        objLoader.load( `../assets/model/${params}`, function ( object ) {
    
            // if (dynamic) {
            //     models.push(object);
            // }
    
            // scene.add(object.scene);
        return object.scene;
    
        }, onProgress, onError );
    
    });
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