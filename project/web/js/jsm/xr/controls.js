class XRControls {
    constructor(controller, dolly, dummyCam) {
        this._controller = controller;
        this._dummyCam = dummyCam;
        this._dolly = dolly;
    }

    update(dt) {
        if (this._controller.gamepad) {
            console.log(this._controller.gamepad);
            if (this._controller.gamepad.buttons[3].touched == true) {
                let axes = this._controller.gamepad.axes;
                // joystick
                if (axes[2] > 0) {
                    this._dolly.rotation.y -= 1 * dt;
                } else if (axes[2] < 0) {
                    this._dolly.rotation.y += 1 * dt;
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
                console.log("x pressed");
            } else if (this._controller.gamepad.buttons[5].pressed == true) {
                console.log("y pressed");
            } else if (this._controller.gamepad.buttons[0].pressed == true) {
                console.log("trigger pressed");
                const speed = 2;
                const quaternion = this._dolly.rotation.clone();
                this._dolly.rotation.copy(this._dummyCam.rotation);
                this._dolly.translateZ(-dt * speed);
                this._dolly.position.y = 2;
                this._dolly.rotation.copy(quaternion);
            } else if (this._controller.gamepad.buttons[1].pressed == true) {
                console.log("grip pressed");
            }
        }
    }

} export { XRControls }