import { Rig } from "./xr/rig.js"

class XR {
    constructor(scene) {
        this._grabbables = undefined;
        this._clickables = undefined;
        this._scene = scene;
        this._rig = undefined;
        this._controls = undefined;
    }

    get grabbables() { return this._grabbables; }
    set grabbables(val) { this._grabbables = val; }
    get clickables() { return this._clickables; }
    set clickables(val) { this._clickables = val; }

    setup() {
        this._controls = new XRControls;
        let isVr = true;
        if (isVr) {

            function onSelectStart( event ) {
                // this.userData.isSelecting = true;
                const controller = event.target;
            
                const intersections = getIntersections( controller );
            
                if ( intersections.length > 0 ) {
                    
                    const intersection = intersections[ 0 ];
                    if (!this._controls.isTeleporting) {
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
                            for (let mesh in this._scene.collections[id]) {
                                controller.attach( this._scene.collections[id][mesh] );
                            }
                            controller.attach(object);                        
                        } else if (object.ancestor == "earth") {
                            // object.lastPos = object.position;
                            // object.lastParent = controller;
                            _target = "flight.json";
                            this._scene.changeScript();
                        } else {
                            controller.attach(object);
                        }
                
                        controller.userData.selected = object;
                        _selected = object;
                    } else {
                        console.error("attempting teleport");
                        console.error(intersection);
                        _dolly.position.copy(intersection.point);
                    }
            
                }
            }
            
            function onSelectEnd( event ) {
                // this.userData.isSelecting = false;
                const controller = event.target;
                console.warn("releasing object");
            
                // const intersections = getIntersections( controller );

				if ( controller.userData.selected !== undefined ) {

                if (!_controls.isTeleporting) {
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
                }
					controller.userData.selected = undefined;
                    _selected = undefined;
				}            
            }
            
            function getIntersections( controller ) {
                _workingMatrix.identity().extractRotation( controller.matrixWorld );
                _raycaster.ray.origin.setFromMatrixPosition( controller.matrixWorld );
                _raycaster.ray.direction.set( 0, 0, - 1 ).applyMatrix4( _workingMatrix );
                console.warn("raycaster direction");
                console.log(_raycaster.ray.origin);
                console.log(_raycaster.ray.direction);
                console.log(_collidables);
                let intersects;
                if (_controls.isTeleporting) {
                    intersects = _raycaster.intersectObjects( _ports, true );
                } else {
                    intersects = _raycaster.intersectObjects( _clickables, true );
                }
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
            _menuController = right;
            _dolly = new THREE.Object3D();
            _dolly.position.z = 5;
            _dolly.add(_camera);
            _scene.add(_dolly);
            _dummyCam = new THREE.Object3D();
            _camera.add(_dummyCam);
            _controllers = [left, right];
            _controls = new XRHandler(_controllers, _dolly, _dummyCam, _raycaster, _scene, _renderer, _camera);
            _dolly.add(left.controller);
            _dolly.add(left.grip);
            _dolly.add(right.controller);
            _dolly.add(right.grip);
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
    }

    init() {

    }

    update() {

    }

} export { XR }