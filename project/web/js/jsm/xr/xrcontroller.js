import { XRControllerModelFactory } from 'https://unpkg.com/three@0.138.0/examples/jsm/webxr/XRControllerModelFactory.js';
import * as THREE from 'https://unpkg.com/three@0.138.0';

let _leftController;
let _leftControllerGrip;
let _rightController;
let _rightControllerGrip;
let _xScene;

function onSelectStart( event ) {
    this.userData.isSelecting = true;
    const controller = event.target;

    const intersections = getIntersections( controller );

    if ( intersections.length > 0 ) {

        const intersection = intersections[ 0 ];

        const object = intersection.object;
        object.material.emissive.b = 1;
        controller.attach( object );

        controller.userData.selected = object;

    }
}

function onSelectEnd( event ) {
    this.userData.isSelecting = false;
    const controller = event.target;

    const intersections = getIntersections( controller );

    if ( intersections.length > 0 ) {

        const intersection = intersections[ 0 ];

        const object = intersection.object;
        object.material.emissive.b = 1;
        controller.attach( object );

        controller.userData.selected = object;

    }

}

function getIntersections( controller ) {
                // this._raycaster.setupXR(this._workingMatrix, this._controller);
                // this._raycaster.castXR();
                _xScene.workingMatrix.identity().extractRotation( controller.matrixWorld );
                // this._raycaster.near = 0;
                // this._raycaster.far = 20;
                // this._dummyC
                // console.log(this._dummyCam.quaternion);
                // this._raycaster.ray.origin = this._dolly.position;
                // _xScene.raycaster.ray.direction.set(0, 0, -1).applyMatrix4( controller.matrixWorld );

                _xScene.raycaster.ray.origin.setFromMatrixPosition( controller.matrixWorld );
                _xScene.raycaster.ray.direction.set( 0, 0, - 1 ).applyMatrix4( _xScene.workingMatrix );

                // raycaster.intersectObjects( group.children, false );

                console.warn("raycaster direction");
                console.log
                console.log(_xScene.raycaster.ray.origin);
                console.log(_xScene.raycaster.ray.direction);
                console.log(_xScene.collidables);

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

    const intersects = this._raycaster.intersectObjects( _xScene.collidables, false );

    // return cube;

    if ( intersects.length > 0) {
        console.log(intersects);
        console.log(intersects.length);
        console.log(intersects[0]);
        intersects[ 0 ].object.material.wireframe = true;
        console.warn("intersecting");
    }
}



// function getIntersections( controller ) {

//     tempMatrix.identity().extractRotation( controller.matrixWorld );

//     raycaster.ray.origin.setFromMatrixPosition( controller.matrixWorld );
//     raycaster.ray.direction.set( 0, 0, - 1 ).applyMatrix4( tempMatrix );

//     return raycaster.intersectObjects( group.children, false );

// }

// function intersectObjects( controller ) {

//     // Do not highlight when already selected

//     if ( controller.userData.selected !== undefined ) return;

//     const line = controller.getObjectByName( 'line' );
//     const intersections = getIntersections( controller );

//     if ( intersections.length > 0 ) {

//         const intersection = intersections[ 0 ];

//         const object = intersection.object;
//         object.material.emissive.r = 1;
//         intersected.push( object );

//         line.scale.z = intersection.distance;

//     } else {

//         line.scale.z = 5;

//     }

// }

function cleanIntersected() {

    while ( intersected.length ) {

        const object = intersected.pop();
        object.material.emissive.r = 0;

    }

}

function buildController( data ) {

	let geometry, material;

	switch ( data.targetRayMode ) {

		case 'tracked-pointer':

			geometry = new THREE.BufferGeometry();
			geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( [ 0, 0, 0, 0, 0, - 1 ], 3 ) );
			geometry.setAttribute( 'color', new THREE.Float32BufferAttribute( [ 0.5, 0.5, 0.5, 0, 0, 0 ], 3 ) );

			material = new THREE.LineBasicMaterial( { vertexColors: true, blending: THREE.AdditiveBlending } );

			return new THREE.Line( geometry, material );

		case 'gaze':

			geometry = new THREE.RingGeometry( 0.02, 0.04, 32 ).translate( 0, 0, - 1 );
			material = new THREE.MeshBasicMaterial( { opacity: 0.5, transparent: true } );
			return new THREE.Mesh( geometry, material );

	}

}

export function create(renderer, scene) {
    _xScene = scene;
    _leftController = renderer.xr.getController( 0 );
    _rightController = renderer.xr.getController( 1 );
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

    scene.add( _leftController, _rightController );
    
    const controllerModelFactory = new XRControllerModelFactory();
    
    _leftControllerGrip = renderer.xr.getControllerGrip( 0 );
    _leftControllerGrip.add( controllerModelFactory.createControllerModel( _leftControllerGrip ) );

    _rightControllerGrip = renderer.xr.getControllerGrip( 1 );
    _rightControllerGrip.add( controllerModelFactory.createControllerModel( _rightControllerGrip ) );

    scene.add( _leftControllerGrip, _rightControllerGrip );

    let left = {
        controller: _leftController,
        grip: _leftControllerGrip
    };

    let right = {
        controller: _rightController,
        grip: _rightControllerGrip
    };

    return [left, right];
}
