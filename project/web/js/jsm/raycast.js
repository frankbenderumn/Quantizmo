import * as THREE from '../three.module.js'
import * as Selector from './selector.js'

class Raycast {
    constructor(world, camera, clickable) {
        this._raycaster = new THREE.Raycaster();
        this._hit = undefined;
        this._camera = camera;
        this._pointer = new THREE.Vector2(0, 0);
        this._scene = world.scene;
        this._world = world;
        this._system = world.system;
        this._clickable = clickable;
        this._object = undefined;
    }

    get pointer() { return this._pointer; }
    set pointer(val) { this._pointer = val; }

    walkUp(element) {
        let walk = null;
        if (element != null) {
            walk = element;
            console.log("walking up...");
            console.log(walk);
            if (walk.hasOwnProperty("parent")) {
                while(walk.parent !== this._scene) {
                    walk = walk.parent;
                }
            } else {
                walk = element;
            }
        } 
        console.log("return walk is...");
        console.log(walk);
        return walk;
    }

    clear() {
        this._pointer = null;
    }

    get scene() { return this._scene; }
    set scene(val) { this._scene = val; }

    bindMaterial(children) {
        for (let child of children) {
            console.log(child.type);
            if (child.hasOwnProperty("material")) {
                // work around for walk bug on overriding previous material from double iteration probably
                if (child.material.emissive.getHex() != 16116137) {
                    child.prevMaterial = child.material.emissive.getHex();
                }
            } else if (child.children.length != 0) {
                this.walkDown(child.children);
            }  
        }
    }

    walkDown(children) {
        for (let child of children) {
            console.log(child.type);
            if (child.hasOwnProperty("material")) {
                child.material.emissive.setHex( 0xF5E9A9 );
            } else if (child.children.length != 0) {
                this.walkDown(child.children);
            } 
            // else if (child.type == "Mesh") {
            //     child.prevMaterial = child.material.emissive.getHex();
            //     child.material.emissive.setHex( 0x00ffff );
            // }
        }
    }

    resetMaterial(children) {
        console.log("============================================================");
        console.log("resetting material...");
        console.log("the values of children are: ");
        console.log(children);
        console.log("the type of children is: " + typeof children);
        console.log("the explicit type of children is: " + Object.prototype.toString.call(children));
        if(Object.prototype.toString.call(children) === '[object Array]') {
            console.log(`this is a test... ${children[0]}`);
            console.log("the length of children is: " + children.length);
            let ct = 1;
            for (let idx of children) {
                console.log("-----------------------------");
                console.log("iteration "+ct);
                // let child = children[idx];
                console.log(`   child is... ${idx}`);
                console.log(Object.prototype.toString.call(idx));
                if(Object.prototype.toString.call(idx) === '[object Array]') {
                    for (let child of idx) {
                        if (child.hasOwnProperty("material")) {
                            console.log("   resetting material!");
                            console.log(child);
                            child.material.emissive.setHex( child.prevMaterial );
                        } else if (child.children.hasOwnProperty("length")) {
                            this.resetMaterial(child.children);
                        } 
                    }
                } else {
                    if (idx.hasOwnProperty("material")) {
                        console.log("   resetting material!");
                        console.log(idx);
                        idx.material.emissive.setHex( idx.prevMaterial );
                    } else if (idx.children.hasOwnProperty("length")) {
                        this.resetMaterial(idx.children);
                    }      
                }

                // else if (child.type == "Mesh") {
                //     child.prevMaterial = child.material.emissive.getHex();
                //     child.material.emissive.setHex( 0x00ffff );
                // }
                ct ++;
            }
        } else {
            console.warn("children is not an object array");
        }
    }

    setupXR(matrix, controller) {
        controller.children[0].scale.z = 10;
        matrix.identity().extractRotation( controller.matrixWorld );
        this._raycaster.ray.origin.setFromMatrixPosition( controller.matrixWorld );
        this._raycaster.ray.direction.set(0, 0, -1).applyMatrix4( controller.matrixWorld );
        console.warn("raycaster direction");
        console.log(this._raycaster.ray.origin);
        console.log(this._raycaster.ray.direction);
    }

    castXR() {
        console.warn(this._scene.children);
        const hits = this._raycaster.intersectObjects( this._scene.children );

        // console.log(intersects);

        if ( hits.length > 0 ) {
            console.log("### XR HIT DEBUG ----");
            console.log(hits);
            if ( this._hit != hits[ 0 ].object ) {

                // if ( this._hit ) this._hit.material.emissive.setHex( this._hit.currentHex );

                if ( this._hit ) {
                    this.resetMaterial(this._hit);
                }

                this._hit = hits[ 0 ].object;
                this._scene.handle = false;

                console.log("THE HIT IS");
                console.log(this._hit);

                this._hit.material.wireframe = true;

                // let walk = this.walkUp(this._hit);

                // if (walk) {
                //     this.bindMaterial(walk.children);
                //     this.walkDown(walk.children);
                //     this._hit = walk.children;
                //     this._object = walk;
                //     console.log("the hit group is...");
                //     console.log(this._hit);
                //     // this._hit.material.emissive.setHex( 0xff0000 );
                // }
            }

        } else {

            if ( this._hit ) {
                console.log(`********* pres reset Material... ${this._hit}`);
                this.resetMaterial(this._hit);
            }
            this._hit = null;
        }

        return this._object;
    }

    cast() {
        console.log(`environment is ${this._world.mode}`);
        if (this._pointer && this._world.mode == "development") {
            this._raycaster.setFromCamera( this._pointer, this._camera );

            // console.log( scene.children );
            // console.log( raycaster );
            // if (this._system == "development") {
                console.log("clickables are: " + this._clickable);
                for (let e of this._clickable) {
                    console.log(e);
                }
                const hits = this._raycaster.intersectObjects( this._clickable, true );

                // console.log(intersects);

                if ( hits.length > 0 ) {

                    if ( this._hit != hits[ 0 ].object ) {

                        // if ( this._hit ) this._hit.material.emissive.setHex( this._hit.currentHex );

                        if ( this._hit ) {
                            this.resetMaterial(this._hit);
                        }

                        this._hit = hits[ 0 ].object;
                        this._scene.handle = false;

                        console.log("THE HIT IS");
                        console.log(this._hit);

                        let walk = this.walkUp(this._hit);

                        if (walk) {
                            this.bindMaterial(walk.children);
                            this.walkDown(walk.children);
                            this._hit = walk.children;
                            this._object = walk;
                            console.log("the hit group is...");
                            console.log(this._hit);
                            // this._hit.material.emissive.setHex( 0xff0000 );
                        }
                    }

                } else {

                    if ( this._hit ) {
                        console.log(`********* pres reset Material... ${this._hit}`);
                        this.resetMaterial(this._hit);
                    }
                    this._hit = null;
                }
        } else {
            if ( this._hit ) {
                this.resetMaterial(this._hit);
            }
                this._hit = null;
        }

        return this._object;

    }

} export { Raycast }