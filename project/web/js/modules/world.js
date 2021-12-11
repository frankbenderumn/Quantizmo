import { Scene } from '../scene.js'

class World {
    constructor(scenes) {
        this.scenes = scenes;
    }

    scenes() {
        return this.scenes;
    }

} export { World }