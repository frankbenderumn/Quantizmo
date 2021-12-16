import * as THREE from '../../three.module.js'
import { Raycast } from '../raycast.js'

let _voiceTimeout = false;

class XRHandler {
    constructor(controllers, dolly, dummyCam, raycaster, scene, renderer, camera) {
        this._lController = controllers[0];
        this._rController = controllers[0];
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
    }

    get scene() { return this._scene; }
    set scene(val) { 
        this._scene = val; 
        this._raycaster.scene = val;
    }

    get collidables() { return this._collidables; }
    set collidables(val) { this._collidables = val; }

    get grabbables() { return this._grabbables; }
    set grabbables(val) { this._grabbables = val; }

    update(dt) {
        if (this._lController.controller.gamepad) {
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
                // if (axes[2] > 0) {
                //     this._dolly.rotation.y -= 2 * Math.PI * dt;
                // } else if (axes[2] < 0) {
                //     this._dolly.rotation.y += 2 * Math.PI * dt;
                // } else {
                //     this._dolly.rotation.y += 0 * dt;
                // }

                // if (axes[3] > 0) {
                //     this._dolly.position.z += 1 * dt;
                // } else if (axes[3] < 0) {
                //     this._dolly.position.z -= 1 * dt;
                // } else {
                //     this._dolly.position.z += 0 * dt;
                // }
            }

            if (lpad.buttons[4].pressed == true) {
                console.warn("x pressed");
                let voiceTrigger = document.getElementById("voice-button");
                if (_voiceTimeout == false) {
                    voiceTrigger.click();
                    _voiceTimeout = true;
                }

                setTimeout(() => {_voiceTimeout = false;}, 1000);
                // console.warn(voiceTrigger);

            }

            if (lpad.buttons[5].pressed == true) {
                console.log("y pressed");
                console.log("trigger pressed");
                const speed = 2;

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

            if (lpad.buttons[0].pressed == true) {
  
            }

            if (lpad.buttons[1].pressed == true) {
                console.log("grip pressed");
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
                        if (grabDist <= 1 && obj.ancestor != "vr-menu") {
                            console.log("grabbing object");
                            this._lController.controller.attach(obj);
                            this._grabbed.push(obj);
                        } else if (obj.ancestor == "vr-menu" && grabDist <= 0.5) {
                            console.log("grabbing menu");
                            obj.prevPosition = obj.position;
                            this._lController.controller.attach(obj);
                            this._grabbed.push(obj);
                        }
                    }
                }
            }

            // release function
            if (lpad.buttons[1].pressed == false && this._grabbed.length > 0) {
                for (let e in this._grabbed) {
                    let el = this._grabbed.pop();
                    if (el.name != "vr-menu") {
                        this._scene.attach(el);
                    } else {
                        obj.position.copy(obj.prevPosition);
                        this._rController.attach(obj);
                    }
                    
                }
            }
        }
    }

} export { XRHandler }