import * as THREE from "../../three.module.js"
import { User } from "../user.js"
import { Controls } from "../controls/controls.js"
import { Debug } from "../debug.js";

// Modified from: https://gist.github.com/videlais/8110000
// Modified by Xander Luciano
class GamepadHandler {
    constructor(user) {
        this.supported = (navigator.webkitGetGamepads && navigator.webkitGetGamepads()) ||
        !!navigator.webkitGamepads || !!navigator.mozGamepads ||
        !!navigator.msGamepads || !!navigator.gamepads ||
        (navigator.getGamepads && navigator.getGamepads());

        this.ticking = false;

        this.pan = new THREE.Vector3(0,0,0);
        this.roll = new THREE.Vector3(0,0,0);
        this._user = user;
        Debug.log("params existence check", "info");
        this._controls  = user.controls;
        console.log(this._user);
        console.log(this._controls);

        // Recommended deadzones for Xbox One controller
        this.RIGHT_AXIS_THRESHOLD   = 7849 / 42767.0;
        this.LEFT_AXIS_THRESHOLD    = 8689 / 42767.0;
        this.TRIGGER_AXIS_THRESHOLD = 30   / 32767.0;
        
        this.SPACEMOUSE_THRESHOLD = 0.05;

        this.gamepads = [];
        this.prevRawGamepadTypes = [];
        this.prevTimestamps = [];

        this.init();
    }

    init() {
        if (this.supported) {
        // Older Firefox 
        window.addEventListener('MozGamepadConnected', (e) => this.onGamepadConnect(e), false);
        window.addEventListener('MozGamepadDisconnected', (e) => this.onGamepadDisconnect(e), false);

        //W3C Specification
        window.addEventListener('gamepadconnected', (e) => this.onGamepadConnect(e), false);
        window.addEventListener('gamepaddisconnected', (e) => this.onGamepadDisconnect(e), false);

        // Chrome
        if (navigator.webkitGetGamepads && navigator.webkitGetGamepads()) {
            this.startPolling();
        }

        //CocoonJS
        if(navigator.getGamepads && navigator.getGamepads()) {
            this.startPolling();
        }
        } else {
        console.log('Gamepad API not supported or not detected!');
        }
    }

    startPolling() {
        console.log('Controller Connected!');
        if (!this.ticking) {
        this.ticking = true;
        this.update();
        }
    }

    stopPolling() {
        console.log('Controller Disconnected!');
        this.ticking = false;
    }

    // Called externally
    update(dt) {
        this.pollStatus(dt);
        if (this.ticking) {
        this.pollJoysticks(dt);
        //requestAnimationFrame(() => this.tick());
        }
    }

    pollStatus(dt) {
        this.pollGamepads(dt);
        for (let i in this.gamepads) {
        let gamepad = this.gamepads[i];
        if (gamepad.timestamp && (gamepad.timestamp === this.prevTimestamps[i])) {
            continue;
        }
        this.prevTimestamps[i] = gamepad.timestamp;
        }
    }

    pollGamepads(dt) {
        let rawGamepads = (navigator.webkitGetGamepads && navigator.webkitGetGamepads()) ||
            navigator.webkitGamepads || navigator.mozGamepads ||
            navigator.msGamepads || navigator.gamepads || 
            (navigator.getGamepads && navigator.getGamepads());
        if (rawGamepads) {
        this.gamepads = [];
        for (let i = 0, max = rawGamepads.length; i < max; i++) {
            if (typeof rawGamepads[i] !== this.prevRawGamepadTypes[i]) {
            this.prevRawGamepadTypes[i] = typeof rawGamepads[i];
            }
            if (rawGamepads[i]) {
            this.gamepads.push(rawGamepads[i]);
            }
        }
        }

        let pad = 0

        if (this.gamepads[pad].buttons[0].pressed) {
            Debug.log("pressing button A", "success");
            this._controls.controls.jump(dt);
        }

        if (this.gamepads[pad].buttons[1].pressed) {
            Debug.log("pressing button B", "success");
        }

        if (this.gamepads[pad].buttons[2].pressed) {
            Debug.log("pressing button X", "success");
        }

        if (this.gamepads[pad].buttons[3].pressed) {
            Debug.log("pressing button Y", "success");
        }

        if (this.gamepads[pad].buttons[4].pressed) {
            Debug.log("pressing button 4", "success");
        }

        if (this.gamepads[pad].buttons[5].pressed) {
            Debug.log("pressing button 5", "success");
        }

        if (this.gamepads[pad].buttons[6].pressed) {
            Debug.log("pressing button 6", "success");
        }

        if (this.gamepads[pad].buttons[7].pressed) {
            Debug.log("pressing button 7", "success");
        }

        if (this.gamepads[pad].buttons[8].pressed) {
            Debug.log("pressing button 8", "success");
        }

        if (this.gamepads[pad].buttons[9].pressed) {
            Debug.log("pressing button 9", "success");
        }

        if (this.gamepads[pad].buttons[10].pressed) {
            Debug.log("pressing button 10", "success");
        }

        if (this.gamepads[pad].buttons[11].pressed) {
            Debug.log("pressing button 11", "success");
        }

        if (this.gamepads[pad].buttons[12].pressed) {
            Debug.log("pressing button D-Pad Up", "success");
        }

        if (this.gamepads[pad].buttons[13].pressed) {
            Debug.log("pressing button D-Pad Down", "success");
        }

        if (this.gamepads[pad].buttons[14].pressed) {
            Debug.log("pressing button D-Pad Left", "success");
        }

        if (this.gamepads[pad].buttons[15].pressed) {
            Debug.log("pressing button D-Pad Right", "success");
        }
    }

    pollJoysticks(dt) {
        let pad = 0;
        
        // Reset all input to 0
        this.pan = new THREE.Vector3(0,0,0);
        this.roll = new THREE.Vector3(0,0,0);

        console.error(this.gamepads);
        
        if (this.gamepads[pad]) {
        
        let leftX  = this.gamepads[pad].axes[0]; // Pan  X || Left X
        let leftY  = this.gamepads[pad].axes[1]; // Pan  Y || Left Y
        let leftZ  = this.gamepads[pad].axes[4]; // Pan  Z || Right X
        
        let rightX = this.gamepads[pad].axes[2]; // Roll X || Right Y
        let rightY = this.gamepads[pad].axes[3]; // Roll Y || Trigger Left
        let rightZ = this.gamepads[pad].axes[5]; // Roll Z || Trigger Right
        
        if (leftX < -this.SPACEMOUSE_THRESHOLD ||
            leftX > this.SPACEMOUSE_THRESHOLD) {
            this.pan.x = leftX;
        }
        
        if (leftY < -this.SPACEMOUSE_THRESHOLD ||
            leftY > this.SPACEMOUSE_THRESHOLD) {
            this.pan.y = leftY;
        }

        if (leftZ < -this.SPACEMOUSE_THRESHOLD ||
            leftZ > this.SPACEMOUSE_THRESHOLD) {
            this.pan.z = leftZ;
        }

        if (rightX < -this.SPACEMOUSE_THRESHOLD ||
            rightX > this.SPACEMOUSE_THRESHOLD) {
            this.roll.x = rightX;
        }

        if (rightY < -this.SPACEMOUSE_THRESHOLD ||
            rightY > this.SPACEMOUSE_THRESHOLD) {
            this.roll.y = rightY;
        }

        if (rightZ < -this.SPACEMOUSE_THRESHOLD ||
            rightZ > this.SPACEMOUSE_THRESHOLD) {
            this.roll.z = rightZ;
        }

        }

        // Debug.log(this.roll, "info");
        // Debug.log(this.pan, "info");
        // Debug.log("roll x:" + this.roll.x, "info");
        // Debug.log("roll y:" + this.roll.y, "info");
        // Debug.log("roll z:" + this.roll.z, "info");
        // Debug.log("pan x: " + this.pan.y, "info");
        // Debug.log("pan y: " + this.pan.x, "info");
        // Debug.log("pan z: " + this.pan.z, "info");

        // handler -> controller mapping
        // if (this.roll.z > 0) {
        //     this._controls.controls.turn(2, 1);
        // }

        console.log(this.pan);
        console.log(this.roll);

        if (this.pan.y <= -0.75) {
            this._controls.controls.move(2, -1);
        } else {
            this._controls.controls.clearMove(2, -1);
        }
        
        if (this.pan.y >= 0.75) {
            this._controls.controls.move(2, 1);
        } else {
            this._controls.controls.clearMove(2, 1);
        }

        if (this.pan.x <= -0.75) {
            this._controls.controls.move(0, -1);
        } else {
            this._controls.controls.clearMove(0, -1);
        }
        
        if (this.pan.x >= 0.75) {
            this._controls.controls.move(0, 1);
        } else {
            this._controls.controls.clearMove(0, 1);
        }

        if (this.roll.y <= -0.75) {
            this._controls.controls.turn(1, 1);
        } else {
            this._controls.controls.clearTurn(1, 1);
        }
        
        if (this.roll.y >= 0.75) {
            this._controls.controls.turn(1, -1);
        } else {
            this._controls.controls.clearTurn(1, -1);
        }

        if (this.roll.x <= -0.75) {
            this._controls.controls.turn(0, -1);
        } else {
            this._controls.controls.clearTurn(0, -1);
        }
        
        if (this.roll.x >= 0.75) {
            this._controls.controls.turn(0, 1);
            Debug.log("TURNING", "success");
        } else {
            this._controls.controls.clearTurn(0, 1);
        }

        this._controls.update(dt);
    }

    onGamepadConnect(event) {
        console.log(event);
        let gamepad = event.gamepad;
        this.gamepads[event.gamepad.id] = gamepad;
        this.startPolling();
    }

    onGamepadDisconnect(event) {
        this.gamepads[event.gamepad.id] = null;
        if (this.gamepads.length === 0) {
        this.stopPolling();
        }
    }
} export { GamepadHandler }