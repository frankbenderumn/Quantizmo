import * as THREE from '../three.module.js'
import * as Selector from './selector.js'

class Raycast {
    constructor(scene, camera, clickable = []) {
        this._raycaster = new THREE.Raycaster();
        this._hit = undefined;
        this._camera = camera;
        this._pointer = new THREE.Vector2(0, 0);
        this._scene = scene;
        this._system = scene.system;
        this._clickable = clickable;
    }

    get pointer() { return this._pointer; }
    set pointer(val) { this._pointer = val; }

    walker(element) {
        let walk = element;
        while(walk.parent !== this._scene) {
            walk = walk.parent;
        }
        return walk;
    }

    clear() {
        this._pointer = null;
    }

    cast() {

        if (this._pointer) {
            this._raycaster.setFromCamera( this._pointer, this._camera );

            // console.log( scene.children );
            // console.log( raycaster );
            if (this._system == "development") {

                const hits = this._raycaster.intersectObjects( this._clickable.children, true );

                // console.log(intersects);

                if ( hits.length > 0 ) {

                    if ( this._hit != hits[ 0 ].object ) {

                        if ( this._hit ) this._hit.material.emissive.setHex( this._hit.currentHex );

                        this._hit = hits[ 0 ].object;

                        // console.log(INTERSECTED);
                        console.log("intersecting");
                        this._scene.handle = false;

                        let walk = this.walker(this._hit);

                        if (walk) {
                            this._hit.currentHex = this._hit.material.emissive.getHex();
                            this._hit.material.emissive.setHex( 0xff0000 );
                        }
                            // link = true;
                            // touched.push(walk);
                        // } else {
                        //     // link = false;
                        // }
                    }

                } else {

                    if ( this._hit ) this._hit.material.emissive.setHex( this._hit.currentHex );
                    this._hit = null;
                }

            }
        } else {
            if ( this._hit ) this._hit.material.emissive.setHex( this._hit.currentHex );
            this._hit = null;
        }

        return this.walker(this._hit);

    }

} export { Raycast }