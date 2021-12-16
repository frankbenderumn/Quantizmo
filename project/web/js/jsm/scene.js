import * as Feature from './feature.js'
import * as Script from './script.js'
import * as THREE from 'https://cdn.skypack.dev/three@0.134.0'
import { Entity } from './entity.js'
import * as XRController from './xr/xrcontroller.js'
import { XRHandler } from './xr/xrhandler.js'
import * as Analyser from './audio/analyser.js'
import * as Scaffolding from './scaffolding.js'
import * as System from './system.js'
import { Rig } from './rig.js'
import { Hand } from "./xr/hand.js";
import * as Component from "./component.js"
import { Matrix4, MeshBasicMaterial, Raycaster, SphereBufferGeometry } from '../three.module.js'
import { XRControllerModelFactory } from 'https://cdn.skypack.dev/three@0.134.0/examples/jsm/webxr/XRControllerModelFactory.js';


// import { WSApi } from './system/socket.js'

let _scene, _renderer, _camera, lights, mixers, script, controls;
let updatables = [];
let clock = new THREE.Clock();
let _scriptsDir = "./js/scenes/";
let _assetsDir = "../assets/models/";
let _song = "../assets/audio/heist.wav";
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
let _rig;
let _jarvis;
let _jarvisActive = false;
let _skybox;
let _clickables = [];
let _collidables = [];
let _sceneInfo;
let _menuController;
let _vr = false;
let _raycaster;
let _workingMatrix;
let _controllers;
let _intersected = [];
let _clean;
let _selected = false;
let _collections = [];
let _intersector = [];
let _mode = "production";
let _tronDiscs = [];
let _shield;
let _ironManHands = [];
let _grabbables = [];

// scene modes
// production, development

const setSize = (container, camera, renderer) => {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
  
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
};

class Cache {
    constructor() {
        this._session = undefined;
        this._cache;
    }

    store(target, scene) {
        let models = [];
        for (let e of scene.children) {
            models.push(e);
        }
        this._cache[target] = models;
    }

    isCached(target) {
        return (this._cache[target] != undefined);
    }

    getCache(target) {
        if(this.isCached(target)) {
            return this._cache[target];
        }
    }

    loadCache(target, scene) {
        for (let e in this._cache[target]) {
            scene.add(e);
        }
    }
};

function onSessionStart(){
    _mode = "production";
    _ui.mesh.position.set( 0, 0, -3 );
    _camera.attach( _ui.mesh );
    _ui.scene = _scene;
    _vr = true;
}

function onSessionEnd(){
    _camera.remove( _ui.mesh );
    _vr = false;
}

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
        _raycaster = new Raycaster();
        _workingMatrix = new Matrix4();
        _container = container;
        lights = Feature.createLights();
        _renderer = Feature.createRenderer(container, isVr, onSessionStart, onSessionEnd);
        controls = Feature.createControls(_camera, _renderer.domElement);
        _ui = Feature.createUI();
        _jarvis = Feature.createJarvis();
        const texloader = new THREE.TextureLoader();
        _scene.add(_skybox);
        // texloader.load('https://images.pexels.com/photos/1205301/pexels-photo-1205301.jpeg' , function(texture) {
        //   _scene.background = texture;  
        // });

        Analyser.analyze(_song, _renderer);
        // scene.add(song[0]);
        // _uniforms = song[1];

        _vr = true;
        if (isVr) {

            function onSelectStart( event ) {
                // this.userData.isSelecting = true;
                const controller = event.target;
            
                const intersections = getIntersections( controller );
            
                if ( intersections.length > 0 ) {
            
                    const intersection = intersections[ 0 ];
                    // if (intersection.obect.name == "line") {
                    //     intersection = intersections[1];
                    // }
                    const object = intersection.object;
                    object.material.wireframe = true;
                    // console.log(object);
                    let id = object.entityId;
                    console.warn(`entityId id ${id}`);
                    console.warn(object);
                    if (object.ancestor != "vr-menu") {
                        for (let mesh in _collections[id]) {
                            controller.attach( _collections[id][mesh] );
                        }
                        controller.attach(object);                        
                    } else {
                        // object.lastPos = object.position;
                        // object.lastParent = controller;
                        controller.attach(object);
                    }
            
                    controller.userData.selected = object;
                    _selected = object;
            
                }
            }
            
            function onSelectEnd( event ) {
                // this.userData.isSelecting = false;
                const controller = event.target;
                console.warn("releasing object");
            
                // const intersections = getIntersections( controller );
            
				if ( controller.userData.selected !== undefined ) {

					const object = controller.userData.selected;
					object.material.wireframe = false;
                    let id = object.entityId;
                    if (object.ancestor != "vr-menu") {
                        for (let mesh in _collections[id]) {
                            _scene.attach( _collections[id][mesh] );
                        }
                        _scene.attach( object );
                    } else {
                        // let lastParent = object.lastParent;

                        _scene.attach(object);
                        // lastParent.attach( object );
                    }

					controller.userData.selected = undefined;
                    _selected = undefined;

				}
            
            }
            
            function getIntersections( controller ) {
                // this._raycaster.setupXR(this._workingMatrix, this._controller);
                // this._raycaster.castXR();
                _workingMatrix.identity().extractRotation( controller.matrixWorld );
                // this._raycaster.near = 0;
                // this._raycaster.far = 20;
                // this._dummyC
                // console.log(this._dummyCam.quaternion);
                // this._raycaster.ray.origin = this._dolly.position;
                // _xScene.raycaster.ray.direction.set(0, 0, -1).applyMatrix4( controller.matrixWorld );

                _raycaster.ray.origin.setFromMatrixPosition( controller.matrixWorld );
                _raycaster.ray.direction.set( 0, 0, - 1 ).applyMatrix4( _workingMatrix );

                // raycaster.intersectObjects( group.children, false );

                console.warn("raycaster direction");
                // console.log
                console.log(_raycaster.ray.origin);
                console.log(_raycaster.ray.direction);
                console.log(_collidables);

                // let geometry = new THREE.BoxBufferGeometry(2, 2, 2);

                // // create a default (white) Basic material
                // const material = new THREE.MeshBasicMaterial();
                
                // // create a Mesh containing the geometry and material
                // const cube = new THREE.Mesh(geometry, material);
                
                // cube.position.x = 0;
                
                // // cube.update = (dt) => {
                // //   cube.rotation.x += 2 * dt;
                // // }
                // this._scene.add(cube);
            
                const intersects = _raycaster.intersectObjects( _clickables, true );
            
                // return cube;
            
                // if ( intersects.length > 0) {
                //     console.log(intersects);
                //     console.log(intersects.length);
                //     console.log(intersects[0]);
                //     intersects[ 0 ].object.material.wireframe = true;
                //     console.warn("intersecting");
                // }

                return intersects;
            }
            
            function buildController( data ) {
                let geometry, material;
                switch ( data.targetRayMode ) {
            
                    case 'tracked-pointer':
                        geometry = new THREE.BufferGeometry();
                        geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( [ 0, 0, 0, 0, 0, - 10 ], 3 ) );
                        geometry.setAttribute( 'color', new THREE.Float32BufferAttribute( [ 0.0, 0.0, 0.5, 0, 0, 0 ], 3 ) );
                        material = new THREE.LineBasicMaterial( { vertexColors: true, blending: THREE.AdditiveBlending, lineWidth: 5 } );
                        return new THREE.Line( geometry, material );
            
                    case 'gaze':
                        geometry = new THREE.RingGeometry( 0.02, 0.04, 32 ).translate( 0, 0, - 1 );
                        material = new THREE.MeshBasicMaterial( { opacity: 0.5, transparent: true } );
                        return new THREE.Mesh( geometry, material );
            
                }
            
            }
            
        // create(renderer, scene) {
            // _xScene = scene;
            let _leftController = _renderer.xr.getController( 0 );
            let _rightController = _renderer.xr.getController( 1 );
            _leftController.userData.selected = false;
            _leftController.userData.selected = false;
            _leftController.addEventListener( 'selectstart', onSelectStart );
            _leftController.addEventListener( 'selectend', onSelectEnd );
            _leftController.addEventListener( 'connected', function ( e ) {
                this.add( buildController( e.data ) );
                this.gamepad = e.data.gamepad;
            } );
        
            _leftController.addEventListener( 'disconnected', function () {
                this.remove( this.children[ 0 ] );
            } );
        
            _rightController.addEventListener( 'selectstart', onSelectStart );
            _rightController.addEventListener( 'selectend', onSelectEnd );
            _rightController.addEventListener( 'connected', function ( e ) {
                this.add( buildController( e.data ) );
                this.gamepad = e.data.gamepad;
            } );
        
            _rightController.addEventListener( 'disconnected', function () {
                this.remove( this.children[ 0 ] );
            } );
        
            _scene.add( _leftController, _rightController );
            
            const controllerModelFactory = new XRControllerModelFactory();
            
            let _leftControllerGrip = _renderer.xr.getControllerGrip( 0 );
            _leftControllerGrip.add( controllerModelFactory.createControllerModel( _leftControllerGrip ) );
        
            let _rightControllerGrip = _renderer.xr.getControllerGrip( 1 );
            _rightControllerGrip.add( controllerModelFactory.createControllerModel( _rightControllerGrip ) );
        
            _scene.add( _leftControllerGrip, _rightControllerGrip );
        
            let left = {
                controller: _leftController,
                grip: _leftControllerGrip
            };
        
            let right = {
                controller: _rightController,
                grip: _rightControllerGrip
            };
        // }

            _controller = left.controller;
            let _controllerGrip = left.grip;

            // let geometr = new THREE.CylinderGeometry( 0.1, 0.1, 0.1, 32 );
            // let materia = new THREE.MeshBasicMaterial( {color: 0xffff00} );
            // let cylinder = new THREE.Mesh( geometr, materia );
            _menuController = right;
            // _scene.add(cylinder);
            // _menuController.controller.add(cylinder);

            _dolly = new THREE.Object3D();
            _dolly.position.z = 5;
            _dolly.add(_camera);
            _scene.add(_dolly);
            _dummyCam = new THREE.Object3D();
            _camera.add(_dummyCam);
            _controllers = [left, right];
            _controls = new XRHandler(_controllers, _dolly, _dummyCam, _raycaster, _scene, _renderer, _camera);
            // let hand = new Hand(controllers[0], controllers[1]);
            _dolly.add(left.controller);
            _dolly.add(left.grip);
            _dolly.add(right.controller);
            _dolly.add(right.grip);

            // let geometry = new THREE.BoxBufferGeometry(4, 4, 4);

            // // create a default (white) Basic material
            // const material = new THREE.MeshBasicMaterial();
          
            // // create a Mesh containing the geometry and material
            // const cube = new THREE.Mesh(geometry, material);
          
            // cube.position.x = 0;
          
            // cube.update = (dt) => {
            //   cube.rotation.x += 2 * dt;
            // }
            // _scene.add(cube);

            // this._menu = cylinder;        

            // _scene.add(cylinder);
            _rig = new Rig(_camera, _dolly, _controllers);

            // _rig.automate([
            //     [2, 2, 2],
            //     [13, 13, 13],
            //     [2, 0, 2],
            //     [2, 0, 3],
            // ]);



            // const btn = new VRButton( this.renderer, { onSessionStart, onSessionEnd } );
            // this.renderer.setAnimationLoop( this.render.bind(this) );


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

        if (_mode != "production") {
        // dev environment additions
        let els = Feature.createDevGrid();
        for (let e in els) {
            _scene.add(els[e]);
        }

        }

        const cube = Feature.createCube();
        // controls.controls.target.copy(cube.position);
        // updatables.push(cube);
        updatables.push(controls);
        _grabbables.push(cube);
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
                _entities = [];
                for (let e of entities[0]) {
                    let d = new Entity(e);
                    console.log(d);
                    _entities.push(d);
                    if (d.type !== "skybox" && d.type != "undefined") {
                        // _clickables.push(d.model);
                        let id = 0;
                        for (let mesh of d.meshes) {
                            if (d.interact == 1 || d.interact == 3) {
                                _clickables.push(mesh);
                            }

                            if (d.interact == 2 || d.interact == 3) {
                                _grabbables.push(mesh);
                            }
                            id = mesh.entityId;
                        }
                        _collections[id] = d.meshes;
                        // console.warn(_collections);
                        // walkDown(d.model);
                    }
                    console.warn("PRE CONTROLLER");
                    console.log(d);
                    if (d.name.includes("tron")) {
                        let i;
                        (d.hand != "left") ? i = 0 : i = 1;
                        _tronDiscs.push(d.model);
                    }

                    if (d.name.includes("iron")) {
                        (d.hand != "left") ? i = 0 : i = 1;
                        _ironManHands.push(d.model);
                    }

                    if (d.name.includes("shield")) {
                        _shield = d.model;
                    }

                    // console.log(d.name);
                    _scene.add(d.model);
                    if(d.name == "vr-menu") {
                        _menuController.controller.add(d.model);
                        // d.model.position.copy(_menuController.grip.position);
                        console.log("DOF-MENU");
                        console.warn(d.model);
                        d.update = function() {
                            // let c = _menuController.grip.position;
                            // d.model.position.set(0, 0, 0);
                        };
                    }
                }
                _sceneInfo = entities[1];
                // if (_vr == true) {
                //    this.initXR(_menuController);
                // } else {
                _controls.scene = _scene;
                _updateReady = true;
                console.error(_grabbables);
                _controls.collidables = _clickables;
                _controls.grabbables = _grabbables;
                _collidables = _clickables;
                // }
                Scaffolding.dag(_entities);
                // console.warn("scene is: ");
                // console.log(_scene);
                // console.log(_clickables);
                // console.log(_clickables.length);
            });
        });
    }
s
    swapControllerModels(name) {

    }

    debug(string) {
        let content = {
            header: "Debugger",
            main: string,
            footer: "Footer"
        }
        let ui = Feature.createShell(content);
        ui.mesh.position.set( 0, 0, 0 );
        _camera.attach( ui.mesh );
        ui.scene = _scene;
    }

    graph(data) {
        console.log("data making it to the scene!");
        _shell = Feature.createD3(data);
        _shell.mesh.position.copy(_dolly.position);
        _scene.add( _shell.mesh );
        _collections["stock-chart"] = _shell.mesh;
        _shell.scene = _scene;

        // _ui.mesh.position.set( 0, 0, -10 );
        // _camera.attach( _ui.mesh );
        // _ui.scene = _scene;

        // let circ = document.createElement("svg");
        // let circC = document.createElement("circle");
        // circC.className = "target";
        // circC.style="fill: #69b3a2; position:absolute;top:100px;left:1000px;";
        // circC.setAttribute("stroke","black");
        // circC.setAttribute("cx","50");
        // circC.setAttribute("cy","50");
        // circC.setAttribute("r","40");
        // circ.append(circC);
        // _container.append(circ);
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
        items.push(_sceneInfo);
        for (const e of _entities) {
            items.push(e.serialize());
        }
        console.log("#############");
        console.log(items);
        Script.send("save", items);
    }

    launchJarvis() {
        if (!_jarvisActive) {
            if (this._vr) {
                _jarvis.position.set(0, 1, -10);
                _dolly.add(_jarvis);
            } else {
                _scene.add(_jarvis);
            }
            updatables.push(_jarvis);
            _jarvisActive = true;
        }
    }

    killJarvis() {
        updatables = updatables.filter(item => item !== _jarvis);
        if (this._vr) {
            _dolly.remove(_jarvis);
        } else {
            _scene.remove(_jarvis);
        }
        _jarvisActive = false;
    }

    get UI() { return _ui; }
    set UI(val) { _ui = val; }
    get clickables() { return _clickables; }
    // getters and setters
    get scene() { return _scene; }
    get camera() { return _camera; }
    get mode() { return _mode; }
    get workingMatrix() { return _workingMatrix; }
    get raycaster() { return _raycaster; }
    get collidables() { return _collidables; }

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
          this.render();
          this.tick();
        });
    }
      
    stop() {
        _renderer.setAnimationLoop(null);
    }

    cleanUp() {
        Scaffolding.cleanDag();
        for (let e in _clickables) {
            _clickables[e].geometry.dispose();
            _clickables[e].material.dispose();
        }
        _clickables = [];
        for (let e in _grabbables) {
            _grabbables[e].geometry.dispose();
            _grabbables[e].material.dispose();
        }
        _grabbables = [];

    }
      
    tick() {
        const delta = clock.getDelta();
        if (_updateReady) {
            for(let e of _entities) {
                e.update(delta);
            }

            for(let e of updatables) {
                e.update(delta);
            }
        }

        if (_vr) {
            if (_controls) {
                console.log("&&&&&&&&&&&&&");
                console.log(_controllers[0]);
                _controls.update(delta);
                cleanIntersected();
                intersectObjects(_controllers[0]);
                intersectObjects(_controllers[1]);
                _ui.update();
            }

            _rig.update();
        }

    }

    changeScript(target) {
        this.cleanUp();
        _target = target;
        for (let e of _entities) {
            _scene.remove(e.model);
        }

        this.init();
    }

    render() {
        _renderer.render(_scene, _camera);
    }

} export { Scene }

function intersectObjects( controller ) {

    // Do not highlight when already selected

    if ( _selected !== undefined ) return;

    // console.warn("******************");
    // console.warn(_controller);

    const line = controller.controller.getObjectByName( 'line' );
    const intersections = getIntersectionsx( controller.controller );

    if ( intersections.length > 0 ) {
        // console.log("here");
        const intersection = intersections[ 0 ];
        let pos = intersection.point;
        // console.log(pos);
        let sphere = new THREE.SphereBufferGeometry(0.05, 32, 32);
        let mat = new THREE.MeshBasicMaterial({color: 0x0000ff, opacity: 0.5});
        let mesh = new THREE.Mesh(sphere, mat);
        mesh.position.copy(pos);
        _scene.add(mesh);
        // console.log("here 2");
        _intersector.push(mesh);
        const object = intersection.object;
        // object.material.emissive.r = 1;
        _intersected.push( object );

        // line.scale.z = intersection.distance;

    } else {

        // line.scale.z = 5;

    }

}

function cleanIntersected() {

    while ( _intersected.length ) {
        const object = _intersected.pop();
        // object.material.emissive.r = 0;
        if (_intersector.length > 0) {
            let toRemove = _intersector.pop();
            _scene.remove(toRemove);    
        }
    }

}

function getIntersectionsx( controller ) {
    _workingMatrix.identity().extractRotation( controller.matrixWorld );
    _raycaster.ray.origin.setFromMatrixPosition( controller.matrixWorld );
    _raycaster.ray.direction.set( 0, 0, - 1 ).applyMatrix4( _workingMatrix );

    // console.warn("raycaster direction");
    // console.log(_raycaster.ray.origin);
    // console.log(_raycaster.ray.direction);
    // console.log(_collidables);

    const intersects = _raycaster.intersectObjects( _clickables, true );

    return intersects;
}