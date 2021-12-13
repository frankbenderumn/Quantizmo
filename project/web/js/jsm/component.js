export function dofMenu(entity, controller) {
    let model = entity.model;
    cylinder.position.copy(controller.grip.position);

    model.update = function() {
        let c = controller.grip.position;
        model.position.set(0, 0, 0);
    };

    updatables.push(cylinder);
    _scene.add(cylinder);
    controller.controller.add(cylinder);
    _entities.push(o);
}

export function grabbable() {

}

export function grabber() {

}