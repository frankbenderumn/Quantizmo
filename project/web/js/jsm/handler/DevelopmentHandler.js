import { Raycaster } from "../../three.module.js"
import { Debug } from "../debug.js"

class DevelopmentHandler {
    constructor() {
        this._raycast = new Raycaster();
    }

    update() {
        Debug.log("Updating development handler");
    }
} export { DevelopmentHandler }