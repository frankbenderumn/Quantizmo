import * as Loader from './loader.js';
import * as Feature from './feature.js';

let _api = new WSApi();
let idx = -1;

$.getJSON("./js/scenes/stocks.json", function(data) {
    for (let i = 0; i < data.length; i++) {
        console.log(data[i]);
        let li = document.createElement("li");
        li.append(data[i].stock.ticker);
        li.append(" - ");
        li.append(data[i].stock.name);
        li.setAttribute("id", "stock");
        li.setAttribute("data-role", "stock");
        li.setAttribute("data-target", data[i].stock.ticker);
        $("#stocks").append(li);
    }
}).then(function(){
    $("li#stock").click(function(){
        let o = {
            ticker: $(this).attr("data-target"),
            name: "none"
        };
        send("stock", o);
    });
});

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

        if (command.command == "skybox") {
            let o = await Feature.createSkybox(command.params);
            _entities.push(o);
        }

    }

    return _entities;

}

export function send(command, params) {
    _api.sendCommand(command, params).then(function(data){
        console.log("$$$$");
        console.log(data);
    });
}

export async function generate(type) {
    idx++;
    let o = {
            "entityId": idx,
            "name": "undefined",
            "type": "undefined",
            "path": "undefined",
            "position": [0, 0, 0],
            "scale": [1, 1, 1],
            "direction": [1,0,0],
            "radius": 1.0,
            "rotation": [0, 0, 0]
    };
    switch(type) {
        case "drone":
            o.path = "drone.glb";
            o.type = "actor";
            o.name = `drone ${idx}`;
            o.scale = [0.15, 0.15, 0.15];
            break;
        case "robot":
            o.path = "robot.glb";
            o.type = "actee";
            o.name = `robot ${idx}`;
            o.position = [-90 + Math.random() * 180, 0, -50 + Math.random() * 100];       
            o.scale = [0.25, 0.25, 0.25];
            break;
        case "charger":
            o.path = "charger.glb";
            o.type = "charger";
            o.name = `recharge station ${idx}`;
            o.position = [-90 + Math.random() * 180, 0, -50 + Math.random() * 100];       
            break;
        default:
            break;
    }
    $("#entitySelect").append($('<option value="' + o.entityId + '">' + o.name + '</option>'));    
    let promise = await Loader.loadAsync(o);
    return [promise, o];
}