import * as Feature from './feature.js'
import * as Script from './script.js'
import * as THREE from 'https://cdn.skypack.dev/three@0.134.0'
import { Entity } from './entity.js'
import * as XRController from './xr/controller.js'
import { XRControls } from './xr/controls.js'

let scene, renderer, camera, lights, mixers, script, controls;
let updatables = [];
let clock = new THREE.Clock();
let _scriptsDir = "./js/scenes/";
let _assetsDir = "../assets/models/";
let _target = "umn.json";
let _updateReady = false;
let _entities = [];
// let _controllerGrip;
let _controller;
let _dolly;
let _dummyCam;
let _controls;
let _ui;

const setSize = (container, camera, renderer) => {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
  
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
};

class Resizer {
    constructor(container, camera, renderer) {

        setSize(container, camera, renderer);
    
        window.addEventListener('resize', () => {
          setSize(container, camera, renderer);
          this.onResize();
        });

    }
}

class Scene {
    constructor(container, target, isVr = true) {
        
        camera = Feature.createCamera();
        scene = Feature.createScene();
        lights = Feature.createLights();
        renderer = Feature.createRenderer(container, isVr);
        controls = Feature.createControls(camera, renderer.domElement);
        _ui = Feature.createUI();
        const texloader = new THREE.TextureLoader();
        texloader.load('https://images.pexels.com/photos/1205301/pexels-photo-1205301.jpeg' , function(texture) {
          scene.background = texture;  
        });

        this._vr = false;
        if (isVr) {
            let controllers = XRController.create(renderer);
            _controller = controllers[0];
            // _controllerGrip = controllers[1];
            scene.add(controllers[0]);
            scene.add(controllers[1]);

            _dolly = new THREE.Object3D();
            _dolly.position.z = 5;
            _dolly.add(camera);
            scene.add(_dolly);
            _dummyCam = new THREE.Object3D();
            camera.add(_dummyCam);

            _controls = new XRControls(_controller, _dolly, _dummyCam);

            // const btn = new VRButton( this.renderer, { onSessionStart, onSessionEnd } );
            // this.renderer.setAnimationLoop( this.render.bind(this) );
            // function onSessionStart(){
                // _ui.mesh.position.set( 0, 0, 10 );
                // camera.attach( _ui.mesh );
                // _ui.scene = scene;
            // }
            
            // function onSessionEnd(){
                // camera.remove( _ui.mesh );
            // }
        }

        _target = target;
        for (const e of lights) {
            scene.add(e);
        }
        
        // loop = new Loop(camera, scene, renderer);
        container.appendChild(renderer.domElement);

        const cube = Feature.createCube();
        controls.controls.target.copy(cube.position);
        updatables.push(cube);
        updatables.push(controls);
        // scene.add(cube);

        const resizer = new Resizer(container, camera, renderer);
        resizer.onResize = () => {
            this.render();
        };
    }

    async init() {
        await Script.run(`${_scriptsDir}${_target}`, _assetsDir).then(function(data) {  
            Promise.all(data).then(function(entities) {
                console.log("###########################");
                for (let e of entities) {
                    let d = new Entity(e);
                    console.log(d);
                    _entities.push(d);
                    scene.add(d.model);
                }
                _updateReady = true;
            });
        });
    }

    vr(val) {
        this._vr = val;
    }

    start() {
        renderer.setAnimationLoop(() => {
          // tell every animated object to tick forward one frame
          this.tick();
          camera.updateProjectionMatrix();
          // render a frame
          renderer.render(scene, camera);
        });
    }
      
    stop() {
        renderer.setAnimationLoop(null);
    }
      
    tick() {
        const delta = clock.getDelta();
        if (_updateReady) {
            // console.log(_entities);
            for(let e of _entities) {
                e.update(delta);
            }
        }

        if (this._vr) {
            if (_controls) {
                // console.log(_controls);
                _controls.update(delta);
                // _ui.update();
            }
        }
    }

    render() {
        renderer.render(scene, camera);
    }

} export { Scene }