import * as Loader from '../loader.js';
let _api = new WSApi();

export async function run(file, modelsDir) {
    var _entities = [];
    Loader.setDir(modelsDir);
    let json = [];
    await $.getJSON(file, function(data) {
        json = data;
    });
    for (var i = 0; i < json.length; i++) {

        var command = json[i];

        if (command.command == "reset") {
            // _api.sendCommand("reset", command.params);
        }

        if (command.command == "createEntity") {
            let o = await Loader.load(command.params);
            _entities.push(o);
    
            // _api.sendCommand("createEntity", command.params);
        }

        if (command.command == "terrain") {
            let o = await Loader.load(command.params, false);
            _entities.push(o);
    
            // _api.sendCommand("createEntity", command.params);
        }

        if (command.command == "rescue") {
            // _api.sendCommand("rescue", command.params);
        }
    }

    return _entities;

}