class User {
    constructor(model, scene, renderer, camera, controls, handler, entity) {
        this._model = model;
        this._scene = scene;
        this._renderer = renderer;
        this._camera = camera;
        this._controls = controls;
        this._handler = handler; 
        this._entity = entity; 
    } 

    get model() { return this._model; }
    set model(val) { this._model = val; }

    get handler() { return this._handler; }
    set handler(val) { this._handler = val; }

    get controls() { return this._controls; }
    set controls(val) { this._controls = val; }

    third(controls) {
        this._controls.focus(this._model);
        this._controls.setType("third");
    }

    first() {

    }

    move(roll, pan) {
        this._model.position.z += pan.z;
        this._model.position.z += roll.z;
    }

    update(dt = 0) {
        this._controls.update(dt);
    }

} export { User }