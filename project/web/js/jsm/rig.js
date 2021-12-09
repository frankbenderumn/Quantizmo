import { Automate } from "./cinematic/automate.js";

class Rig {
    constructor(camera, dolly, controllers) {
        this._leftController = controllers[0];
        this._rightController = controllers[1];
        this._camera = camera;
        this._dolly = dolly;
        this._track = false;
        this. handler = false;
        this._strategy = "manual";
    }

    automate(pois) {
        this._track = new Automate(this._dolly, pois);
        this._strategy = "automatic";
    }

    update(dt) {
        if (this._track && this._strategy == "automate") {
            let idx = this._track.idx;
            if (this._track.isColliding(idx)) {
                this._track.increment();
            } else {
                this._track.move(idx, dt);
            }
        } else if (this._strategy == "manual") {

            // input locomotion
        
        }
    }

    get strategy() { return this._strategy; }
    set strategy(val) { this._strategy = val; }
    get track() { return this._track; }
    set track(val) { this._track = val; }



} export { Rig }