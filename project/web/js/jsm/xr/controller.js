import { XRControllerModelFactory } from 'https://cdn.skypack.dev/three@0.134.0/examples/jsm/webxr/XRControllerModelFactory.js';
import * as THREE from 'https://cdn.skypack.dev/three@0.134.0';

let _controller;
let _controllerGrip;

function onSelectStart() {
    this.userData.isSelecting = true;
}

function onSelectEnd() {
    this.userData.isSelecting = false;
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
    _controller = renderer.xr.getController( 0 );
    _controller.addEventListener( 'selectstart', onSelectStart );
    _controller.addEventListener( 'selectend', onSelectEnd );

    _controller.addEventListener( 'connected', function ( e ) {
        this.add( buildController( e.data ) );
        this.gamepad = e.data.gamepad;
    } );

    _controller.addEventListener( 'disconnected', function () {
        this.remove( this.children[ 0 ] );
    } );

    scene.add( _controller );
    
    const controllerModelFactory = new XRControllerModelFactory();
    
    _controllerGrip = renderer.xr.getControllerGrip( 0 );
    _controllerGrip.add( controllerModelFactory.createControllerModel( _controllerGrip ) );
    scene.add( _controllerGrip );

    return [_controller, _controllerGrip];
}
