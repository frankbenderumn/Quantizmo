import * as THREE from '../../three.module.js'

class Hand {
    constructor(controller, offController) {
        this._controller = controller;
        this._offController = offController;
        let geometry = new THREE.CylinderGeometry( 5, 5, 20, 32 );
        let material = new THREE.MeshBasicMaterial( {color: 0xffff00} );
        let cylinder = new THREE.Mesh( geometry, material );
        this._menu = cylinder;        
    }

    get menu() { return this._menu; }
    set menu(val) { this._menu = val; }

} export { Hand }