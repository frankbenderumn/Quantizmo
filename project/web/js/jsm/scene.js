import * as Feature from './feature.js'
import * as Script from './script.js'
import * as THREE from 'https://cdn.skypack.dev/three@0.134.0'
import { Entity } from './entity.js'
import * as XRController from './xr/controller.js'
import { XRControls } from './xr/controls.js'
import * as Analyser from './audio/analyser.js'
import * as Scaffolding from './scaffolding.js'
import * as System from './system.js'
// import { WSApi } from './system/socket.js'

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
let _container;
let _controls;
let _ui;
let _uniforms;
let _socket;
let _shell = null;

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
        _container = container;
        // _scene.test = test;
        _scene.system = "development";
        // _socket = new WSApi();
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
            function onSessionStart(){
                _ui.mesh.position.set( 0, 0, 10 );
                _camera.attach( _ui.mesh );
                _ui.scene = _scene;
            }
            
            // function onSessionEnd(){
                // camera.remove( _ui.mesh );
            // }
        }

        // _ui.mesh.position.set( 0, 0, -10 );
        // _camera.attach( _ui.mesh );
        // _ui.scene = _scene;

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

    graph(data) {
        console.log("data making it to the scene!");
        _shell = Feature.createD3(data);
        _shell.mesh.position.set( 0, 0, -10 );
        _camera.attach( _shell.mesh );
        _shell.scene = _scene;
        let circ = document.createElement("svg");
        let circC = document.createElement("circle");
        circC.className = "target";
        circC.style="fill: #69b3a2; position:absolute;top:100px;left:1000px;";
        circC.setAttribute("stroke","black");
        circC.setAttribute("cx","50");
        circC.setAttribute("cy","50");
        circC.setAttribute("r","40");
        circ.append(circC);
        _container.append(circ);
        // const floader = new FontLoader();

        // floader.load( 'fonts/helvetiker_regular.typeface.json', function ( font ) {

        //     const geometry = new TextGeometry( 'Hello three.js!', {
        //         font: font,
        //         size: 80,
        //         height: 5,
        //         curveSegments: 12,
        //         bevelEnabled: true,
        //         bevelThickness: 10,
        //         bevelSize: 8,
        //         bevelOffset: 0,
        //         bevelSegments: 5
        //     } );
        // } );
        let set = [];
        let createGeometry = function()
        {
            set.push(new THREE.Vector3(5,5) );
            set.push(new THREE.Vector3(10,1));
            set.push(new THREE.Vector3(15,2));
            set.push(new THREE.Vector3(20,1));
            set.push(new THREE.Vector3(17,9));
            set.push(new THREE.Vector3(23,2));

            let setgeometry = new THREE.BufferGeometry().setFromPoints(set);
            let setmaterial = new THREE.PointsMaterial({ color : 0xff0000 , size : 10 ,sizeAttenuation : false});
            let plot = new THREE.Line( setgeometry , setmaterial );

            _scene.add(plot);

        }   
        createGeometry();

        var canvas1 = document.createElement('canvas');
        var context1 = canvas1.getContext('2d');
        context1.font = "10px Arial";
        context1.fillStyle = "rgba(255,0,0,1)";
        context1.fillText('Hello, world!', 10, 10, 50);

        // canvas contents will be used for a texture
        var texture1 = new THREE.Texture(canvas1)
        texture1.needsUpdate = true;

        var material1 = new THREE.MeshBasicMaterial({ map: texture1, side: THREE.DoubleSide, color: 0x000 });

        var mesh1 = new THREE.Mesh(
            new THREE.PlaneGeometry(10, 10),
            material1
          );
        mesh1.position.set(0, 5, 10);
        // mesh1.rotation.x = -0.9;
        _scene.add(mesh1);
        // Note that mesh1 gets added to the shape and not to the scene

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

    get UI() { return _ui; }
    set UI(val) { _ui = val; }

    stock() {
        let o = {
            ticker: "AAPL",
            data: "20211201"
        };
        Script.send("stock", o);
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