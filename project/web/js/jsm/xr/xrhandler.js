import * as THREE from '../../three.module.js'
import { Raycast } from '../raycast.js'

let _voiceTimeout = false;

class XRHandler {
    constructor(controllers, dolly, dummyCam, raycaster, scene, renderer, camera) {
        this._lController = controllers[0];
        this._rController = controllers[1];
        this._dummyCam = dummyCam;
        this._dolly = dolly;
        this._raycaster = raycaster;
        this._raycaster.scene = scene;
        this._workingMatrix = new THREE.Matrix4();
        this._workingVector = new THREE.Vector3();
        this._scene = scene;
        this.collidables = [];
        this._grabbables = [];
        this._grabbed = [];
        this._renderer = renderer;
        this._camera = camera;
        this._mode = "standard";
        this._leftThrust = new THREE.Quaternion();
        this._rightThrust = new THREE.Quaternion();
        this._leftSpeed = 0;
        this._rightSpeed = 0;
        this._isTeleporting = false;
        this._isShieldLeft = false;
        this._isSheildRight = false;
    }

    get scene() { return this._scene; }
    set scene(val) { 
        this._scene = val; 
        this._raycaster.scene = val;
    }

    get isTeleporting() { return this._isTeleporting; }
    set isTeleporting(val) { this._isTeleporting = val; }

    get isShieldLeft() { return this._isShieldLeft; }
    get isShieldRight() { return this._isShieldRight; }

    get mode() { return this._mode; }
    set mode(val) { this._mode = val; }

    get collidables() { return this._collidables; }
    set collidables(val) { this._collidables = val; }

    get grabbables() { return this._grabbables; }
    set grabbables(val) { this._grabbables = val; }

    update(dt) {
        if (this._lController.controller.gamepad) {
            if(this._lController.controller.gamepad.buttons[4].pressed == true) {
                console.warn("x pressed");
                let voiceTrigger = document.getElementById("voice-button");
                if (_voiceTimeout == false) {
                    voiceTrigger.click();
                    _voiceTimeout = true;
                }

                setTimeout(() => {_voiceTimeout = false;}, 1000);
                // console.warn(voiceTrigger);
            }   

        }

        if (this._lController.controller.gamepad && this._mode == "standard") {
            let lpad = this._lController.controller.gamepad;
            let lpos = this._lController.grip.position;
            let rpad = this._rController.controller.gamepad;
            let rpos = this._rController.grip.position;
            // console.log("### controller position and gamepad ###");
            // console.log("-----------")
            // console.log(lpos);
            // console.log("-------------")
            // console.log(lpad);
            // console.log("===============");
            // this._controller.position.copy(new THREE.Vector3(pos[0] * 5, pos[0] * 5, pos[0] * 5));
            if (lpad.buttons[3].touched == true) {
                let axes = lpad.axes;
                // joystick
                if (axes[2] > 0) {
                    this._dolly.rotation.y -= 3 * dt;
                } else if (axes[2] < 0) {
                    this._dolly.rotation.y += 3 * dt;
                } else {
                    this._dolly.rotation.y += 0 * dt;
                }
            }

            if (rpad.buttons[4].pressed == true) {
                this._isTeleporting = !this._isTeleporting;
            }

            if (lpad.buttons[5].pressed == true) {
                console.log("y pressed");
                this.gaze(2, dt);
                // console.log("trigger pressed");
                // const speed = 2;

                // let tempQuat = new THREE.Quaternion();
                // let xrCamera = this._renderer.xr
                // .getCamera(this._camera)
                // .getWorldQuaternion(tempQuat);
                // // feetPos.y = 0;
                // console.warn("world quaternion is");
                // console.warn(tempQuat);

                // const orientation = this._dolly.quaternion.clone();
                // let wQuat = new THREE.Quaternion();

                // this._dummyCam.getWorldQuaternion( wQuat );
                // this._dolly.quaternion.copy(tempQuat);
                // this._dolly.translateZ(-dt * speed);
                // this._dolly.position.y = 0;
                // this._dolly.quaternion.copy(orientation);
            }

            if (lpad.buttons[0].pressed == true) {
                console.log("trigger pressed");
                // if (this._isTeleporting) {

                // }
            }

            if (lpad.buttons[1].pressed == true) {
                console.log("grip pressed");
                this.grab();
                // if (this._grabbables.length > 0) {
                //     for (let e in this._grabbables) {
                //         let obj = this._grabbables[e];
                //         let worldPos = new THREE.Vector3(); // create once an reuse it
                //         let cwPos = new THREE.Vector3();
                //         obj.getWorldPosition(worldPos);
                //         this._lController.grip.getWorldPosition( cwPos);
                //         let grabDist = worldPos.distanceTo(cwPos);
                //         // console.warn(this._lController);
                //         if (obj.ancestor == "vr-menu") {
                //             console.warn("distance to grabbable is: " + grabDist);
                //             console.warn("vr-menu");
                //         }
                //         console.error(obj);
                //         if (grabDist <= 1 && obj.ancestor != "vr-menu") {
                //             console.log("grabbing object");
                //             if (obj.ancestor == "arch-collider") {
                //                 // 919,"y":0,"z":2929
                //                 this._dolly.position.set(919, 0, 2929);
                //             } else {
                //                 this._lController.controller.attach(obj);
                //                 this._grabbed.push(obj);    
                //             }
                //         } else if (obj.ancestor == "vr-menu" && grabDist <= 0.5) {
                //             console.log("grabbing menu");
                //             obj.prevPosition = obj.position;
                //             this._lController.controller.attach(obj);
                //             this._grabbed.push(obj);
                //         }
                //     }
                // }
            }

            // release function
            if (lpad.buttons[1].pressed == false && this._grabbed.length > 0) {
                this.release();
                // for (let e in this._grabbed) {
                //     let el = this._grabbed.pop();
                //     if (el.name != "vr-menu") {
                //         this._scene.attach(el);
                //     } else {
                //         obj.position.copy(obj.prevPosition);
                //         this._rController.attach(obj);
                //     }
                    
                // }
            }

        } else if (this._mode == "iron-man") {
            console.log(this._lController);
            console.log(this._rController);
            if (this._lController.controller.gamepad.buttons[1].pressed == true) {
                this.thrust("left");
                this._leftSpeed += 1 * dt;
                if (this._leftSpeed >= 50) {
                    this._leftSpeed = 5;
                }
                this.fly(dt);
            }

            if (this._rController.controller.gamepad.buttons[1].pressed == true) {
                this.thrust("right");
                this._rightSpeed += 1 * dt;
                if (this._rightSpeed >= 50) {
                    this._rightSpeed = 5;
                }
                this.fly(dt);
            }

            if (this._lController.controller.gamepad.buttons[1].pressed == false) {
                // this.dethrust("left");
                this._leftSpeed -= 5 * dt;
                if (this._leftSpeed <= 0) {
                    this._leftSpeed = 0;
                }
                this.fly(dt);
            }

            if (this._rController.controller.gamepad.buttons[1].pressed == false) {
                // this.dethrust("right");
                this._rightSpeed -= 5 * dt;
                if (this._rightSpeed <= 0) {
                    this._rightSpeed = 0;
                }
                this.fly(dt);
            }

    
        } else if (this._mode == "tron") {
            if (this._lController.controller.gamepad.buttons[0].pressed) {
                // this._lController.controller.children
                for (let e in this._lController.controller.children) {
                    console.error(this._lController.controller.children[e]);
                    if (this._lController.controller.children[e].name == "shieldLeft") {
                        this._lController.controller.children[e].visible = true;
                    }
                }
            }

            if (this._lController.controller.gamepad.buttons[1].pressed) {
                // this._lController.controller.children
                for (let e in this._lController.controller.children) {
                    console.error(this._lController.controller.children[e]);
                    if (this._lController.controller.children[e].name == "shieldRight") {
                        this._lController.controller.children[e].visible = true;
                    }
                }
            }

            if (!this._lController.controller.gamepad.buttons[0].pressed) {
                // this._lController.controller.children
                for (let e in this._lController.controller.children) {
                    console.error(this._lController.controller.children[e]);
                    if (this._lController.controller.children[e].name == "shieldLeft") {
                        this._lController.controller.children[e].visible = false;
                    }
                }
            }

            if (!this._lController.controller.gamepad.buttons[1].pressed) {
                // this._lController.controller.children
                for (let e in this._lController.controller.children) {
                    console.error(this._lController.controller.children[e]);
                    if (this._lController.controller.children[e].name == "shieldRight") {
                        this._lController.controller.children[e].visible = false;
                    }
                }
            }
        }
    }

    thrust(dir) {
        if (dir == "left") {
            this._leftThrust.copy(this._lController.controller.quaternion);
        } else if (dir == "right") {
            this._rightThrust.copy(this._rController.controller.quaternion);
        }
    }

    dethrust(dir) {
        if (dir == "left") {
            this._leftThrust.copy(new THREE.Quaternion());
        } else if (dir == "right") {
            this._rightThrust.copy(new THREE.Quaternion());
        }  
    }

    fly(dt) {
        let fly = new THREE.Quaternion().copy(this._leftThrust);
        fly.multiply(this._rightThrust);
        let tempQuat = new THREE.Quaternion();
        let xrCamera = this._renderer.xr
        .getCamera(this._camera)
        .getWorldQuaternion(tempQuat);
        const orientation = this._dolly.quaternion.clone();
        this._dolly.quaternion.copy(fly);
        this._dolly.translateZ(dt * (this._leftSpeed + this._rightSpeed));
        // this._dolly.translateY(dt * (this._leftSpeed + this._rightSpeed));
        // this._dolly.translateX(dt * (this._leftSpeed + this._rightSpeed));
        // this._dolly.position.y = 0;
        this._dolly.quaternion.copy(orientation);
    }

    gaze(speed, dt) {
        // console.log("y pressed");
        // console.log("trigger pressed");
        // const speed = 2;

        let tempQuat = new THREE.Quaternion();
        let xrCamera = this._renderer.xr
        .getCamera(this._camera)
        .getWorldQuaternion(tempQuat);
        // feetPos.y = 0;
        console.warn("world quaternion is");
        console.warn(tempQuat);

        const orientation = this._dolly.quaternion.clone();
        let wQuat = new THREE.Quaternion();

        this._dummyCam.getWorldQuaternion( wQuat );
        this._dolly.quaternion.copy(tempQuat);
        this._dolly.translateZ(-dt * speed);
        this._dolly.position.y = 0;
        this._dolly.quaternion.copy(orientation);
    }

    grab() {
        if (this._grabbables.length > 0) {
            for (let e in this._grabbables) {
                let obj = this._grabbables[e];
                let worldPos = new THREE.Vector3(); // create once an reuse it
                let cwPos = new THREE.Vector3();
                obj.getWorldPosition(worldPos);
                this._lController.grip.getWorldPosition( cwPos);
                let grabDist = worldPos.distanceTo(cwPos);
                // console.warn(this._lController);
                if (obj.ancestor == "vr-menu") {
                    console.warn("distance to grabbable is: " + grabDist);
                    console.warn("vr-menu");
                }
                console.error(obj);
                if (grabDist <= 1 && obj.ancestor != "vr-menu") {
                    console.log("grabbing object");
                    if (obj.ancestor == "arch-collider") {
                        // 919,"y":0,"z":2929
                        this._dolly.position.set(919, 0, 2929);
                    } else {
                        this._lController.controller.attach(obj);
                        this._grabbed.push(obj);    
                    }
                } else if (obj.ancestor == "vr-menu" && grabDist <= 0.5) {
                    console.log("grabbing menu");
                    obj.prevPosition = obj.position;
                    this._lController.controller.attach(obj);
                    this._grabbed.push(obj);
                }
            }
        }  
    }

    release() {
        for (let e in this._grabbed) {
            let el = this._grabbed.pop();
            if (el.name != "vr-menu") {
                this._scene.attach(el);
            } else {
                el.position.copy(el.prevPosition);
                this._rController.attach(el);
            }
            
        }
    }

} export { XRHandler }