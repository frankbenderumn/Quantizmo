class Entity {
    constructor(params) {
        if (params) {
            (params.name) ? this._name = params.name : this._name = "undefined";
            (params.entityId > -1) ? this._entityId = params.entityId : this._entityId = -1;
            (params.path) ? this._path = params.path : this._path = "undefined";
            (params.position) ? this._position = params.position : this._position = [0, 0, 0];
            (params.scale) ? this._scale = params.scale : this._scale = [1, 1, 1];
            (params.rotation) ? this._rotation = params.rotation : this._rotation = [0, 0, 0];
            (params.model) ? this._model = params.model : this._model = "undefined";
            (params.dynamic) ? this._dynamic = params.dynamic : this._dynamic = false;
            (params.type) ? this._type = params.type : this._type = "undefined";
            (params.meshes) ? this._meshes = params.meshes : this._meshes = [];
            (params.interact) ? this._interact = params.interact : this._interact = 0;
            (params.mixer) ? this._mixer = params.mixer : this._mixer = [];
            if (params.type == "controller") {
                (params.hand) ? this._hand = params.hand : this._hand = undefined;
                (params.node) ? this._node = params.node : this._node = undefined;    
            }
            (params.children) ? this._children = params.children : this._children = [];
        } else {
            console.log("not asynchronously loading");
        }
        this._action = false;
    }

    get name() { return this._name; }
    get id() { return this._id; }
    get path() { return this._path; }
    get position() { return this._position; }
    get scale() { return this._scale; }
    get rotation() { return this._rotation; }
    get model() { return this._model; }
    set name(val) { this._name = val; }
    get type() { return this._type; }
    get meshes() { return this._meshes; }
    get interact() { return this._interact; }
    get children() { return this._children; }
    get action() { return this._action; }
    set action(val) { this._action = val; }

    addComponent(component) {
        if (component.updatable) {
            this._components.push(component);
        } else {
            console.log("invalid component -- needs updatable variable");
        }
    }

    serialize() {
        let o = {
            entityId: this._entityId,
            name: this._name,
            position: this._model.position,
            scale: this._model.scale,
            rotation: this._model.rotation,
            dynamic: this._dynamic,
            interact: this._interact,
            type: this._type,
            path: this._path
        };
        return o;
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

        if (this._mixer && this._action) {
            for ( const mixer of this._mixer) {
                if (mixer.start == undefined || mixer.duration == undefined) {
                    mixer.mixer.update(dt);
                }
                else {
                    var newTime = time - mixer.start;
                    var iterations = Math.floor(newTime/mixer.duration);
                    newTime = newTime - iterations*mixer.duration + mixer.start;
                    mixer.mixer.setTime(newTime);
                }
            }
        }
    }

} export { Entity }