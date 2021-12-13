import * as THREE from '../../three.module.js'
import { Raycast } from '../raycast.js'

class XRHandler {
    constructor(controller, dolly, dummyCam, raycaster, scene) {
        this._controller = controller;
        this._dummyCam = dummyCam;
        this._dolly = dolly;
        this._raycaster = raycaster;
        this._raycaster.scene = scene;
        this._workingMatrix = new THREE.Matrix4();
        this._workingVector = new THREE.Vector3();
        this._scene = scene;
        this.collidables = [];
    }

    get scene() { return this._scene; }
    set scene(val) { 
        this._scene = val; 
        this._raycaster.scene = val;
    }

    get collidables() { return this._collidables; }
    set collidables(val) { this._collidables = val; }

    update(dt) {
        if (this._controller.gamepad) {
            console.log("### controller position and gamepad ###");
            console.log("-----------")
            console.log(this._controller.position);
            console.log("-------------")
            console.log(this._controller.gamepad);
            console.log("===============");
            let pos = this._controller.position;
            this._controller.position.copy(new THREE.Vector3(pos[0] * 5, pos[0] * 5, pos[0] * 5));
            if (this._controller.gamepad.buttons[3].touched == true) {
                let axes = this._controller.gamepad.axes;
                // joystick
                if (axes[2] > 0) {
                    this._dolly.rotation.y -= 2 * Math.PI * dt;
                } else if (axes[2] < 0) {
                    this._dolly.rotation.y += 2 * Math.PI * dt;
                } else {
                    this._dolly.rotation.y += 0 * dt;
                }

                if (axes[3] > 0) {
                    this._dolly.position.z += 1 * dt;
                } else if (axes[3] < 0) {
                    this._dolly.position.z -= 1 * dt;
                } else {
                    this._dolly.position.z += 0 * dt;
                }
            } else if (this._controller.gamepad.buttons[4].pressed == true) {
                console.warn("x pressed");
                let voiceTrigger = document.getElementById("voice-button");
                voiceTrigger.click();
                // console.warn(voiceTrigger);

            } else if (this._controller.gamepad.buttons[5].pressed == true) {
                console.log("y pressed");
            } else if (this._controller.gamepad.buttons[0].pressed == true) {
                console.log("trigger pressed");
                const speed = 2;
                const quaternion = this._dolly.quaternion.clone();
                this._dolly.updateMatrixWorld();
                // this._dolly.quaternion.copy(this._dummyCam.getWorldQuaternion());
                this._dolly.translateZ(-dt * speed);
                this._dolly.position.y = 0;
                this._dolly.rotation.copy(quaternion);
            } else if (this._controller.gamepad.buttons[1].pressed == true) {
                console.log("grip pressed");
            }
        }
    }

} export { XRHandler }