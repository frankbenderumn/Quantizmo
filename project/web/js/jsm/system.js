import { Scene } from './scene.js'
import * as Voice from './system/voice.js'
import * as Script from './script.js'
import { Raycast } from "./raycast.js"
// import * as Handler from './system/handler.js'

class System {
    constructor(handler) {
        this._scene = undefined;
        this._handler = handler;
        this._raycast = undefined;
    }

    run(name) {
        switch (name) {
            case "development":
                break;
            case "production":
                break;
            case "testing":
                break;
            case "staging":
                break;
            case "safe":
                break;
            default:
                break;
        }
        // hide scaffolding; toggle run environment
    }

    async load(script) {
        this._scene = new Scene(container, `${script}.json`, false);
        await this._scene.init().then(function(){
            this._raycast = new Raycast(this._scene. this._scene.camera, this._scene.clickables);
        });
        this._scene.start();
    }

    open() {

    }

    cache() {

    }

    create(name) {
        Script.send("new", name);
    }

    get handler() { return this._handler; }
    set handler(val) { this._handler = val; }
    get scene() { return this._scene; }
    set scene(val) { this._scene = val; }

} export { System }