import * as Feature from './feature.js'
import * as Script from './script.js'
import * as THREE from 'https://cdn.skypack.dev/three@0.134.0'
import { Entity } from './entity.js'
import * as XRController from './xr/controller.js'
import { XRControls } from './xr/controls.js'
import * as Analyser from './audio/analyser.js'
import * as Scaffolding from './scaffolding.js'

let _scene, _renderer, _camera, lights, mixers, script, controls;
let updatables = [];
let clock = new THREE.Clock();
let _scriptsDir = "./js/scenes/";
let _assetsDir = "../assets/models/";
let _song = "../assets/audio/dune.mp3";
let _target = "umn.json";
let _updateReady = false;
let _entities = [];
// let _controllerGrip;
let _controller;
let _dolly;
let _dummyCam;
let _controls;
let _ui;
let _uniforms;

// scene modes
// production, development

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
    constructor(container, target, test = false, isVr = true) {
        _camera = Feature.createCamera();
        _scene = Feature.createScene();
        // _scene.test = test;
        _scene.system = "development";
        lights = Feature.createLights();
        _renderer = Feature.createRenderer(container, isVr);
        controls = Feature.createControls(_camera, _renderer.domElement);
        _ui = Feature.createUI();
        const texloader = new THREE.TextureLoader();
        texloader.load('https://images.pexels.com/photos/1205301/pexels-photo-1205301.jpeg' , function(texture) {
          _scene.background = texture;  
        });

        Analyser.analyze(_song, _renderer);
        // scene.add(song[0]);
        // _uniforms = song[1];

        this._vr = false;
        if (isVr) {
            let controllers = XRController.create(_renderer);
            _controller = controllers[0];
            // _controllerGrip = controllers[1];
            _scene.add(controllers[0]);
            _scene.add(controllers[1]);

            _dolly = new THREE.Object3D();
            _dolly.position.z = 5;
            _dolly.add(_camera);
            _scene.add(_dolly);
            _dummyCam = new THREE.Object3D();
            _camera.add(_dummyCam);

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
            _scene.add(e);
        }
        
        // loop = new Loop(camera, scene, renderer);
        container.appendChild(_renderer.domElement);

        const cube = Feature.createCube();
        controls.controls.target.copy(cube.position);
        updatables.push(cube);
        updatables.push(controls);
        _scene.add(cube);

        const resizer = new Resizer(container, _camera, _renderer);
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
                    _scene.add(d.model);
                }
                _updateReady = true;
                Scaffolding.dag(_entities);
            });
        });
    }

    save() {
        let items = [];
        for (const e of _entities) {
            items.push(e.serialize());
        }
        console.log("#############");
        console.log(items);
        Script.send("save", items);
    }

    vr(val) {
        this._vr = val;
    }

    start() {
        _renderer.setAnimationLoop(() => {
          // tell every animated object to tick forward one frame
          this.tick();
        //   camera.updateProjectionMatrix();
          // render a frame
          this.render();
        });
    }
      
    stop() {
        _renderer.setAnimationLoop(null);
    }
      
    tick() {
        const delta = clock.getDelta();
        if (_updateReady) {
            // console.log(_entities);
            for(let e of _entities) {
                e.update(delta);
            }
            // _uniforms.tAudioData.value.needsUpdate = true;
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
        _renderer.render(_scene, _camera);
    }

    // getters and setters
    get scene() { return _scene; }
    get camera() { return _camera; }

} export { Scene }