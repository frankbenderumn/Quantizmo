class Entity {
    constructor(params) {
        if (params) {
            (params.name) ? this._name = params.name : this._name = "undefined";
            (params.id) ? this._id = params.id : this._id = -1;
            (params.path) ? this._path = params.path : this._path = "undefined";
            (params.position) ? this._1position = params.position : this._position = [0, 0, 0];
            (params.scale) ? this._scale = params.scale : this._scale = [1, 1, 1];
            (params.rotation) ? this._rotation = params.rotation : this._rotation = [0, 0, 0];
            (params.model) ? this._model = params.model : this._model = "undefined";
            (params.dynamic) ? this._dynamic = params.dynamic : this._dynamic = false;
        } else {
            console.log("not asynchronously loading");
        }
    }

    get name() { return this._name; }
    get id() { return this._id; }
    get path() { return this._path; }
    get position() { return this._position; }
    get scale() { return this._scale; }
    get rotation() { return this._rotation; }
    get model() { return this._model; }
    set name(val) { this._name = val; }

    addComponent(component) {
        if (component.updatable) {
            this._components.push(component);
        } else {
            console.log("invalid component -- needs updatable variable");
        }
    }

    update(dt) {
        for (let o in this._components) {
            if (this._components[o].updatable) {
                this._components[o].update();
            }
        }

        if (this._dynamic) {

            if (this._name == "wumpa") {
                this._model.rotation.y += 2 * dt;
            }

        }
    }

} export { Entity }