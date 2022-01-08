import { Raycaster } from "../../three.module.js"
import { Debug } from "../debug.js"

class KeyboardHandler {
    constructor() {
        this._raycast = new Raycaster();
    }

    update() {
        Debug.log("Updating keyboard handler");
    }
} export { KeyboardHandler }