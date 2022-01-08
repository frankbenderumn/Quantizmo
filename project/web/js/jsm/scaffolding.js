import { LinearEncoding, Vector3 } from "../three.module.js";
import { WSApi } from "./system/socket.js";
import * as Loader from "./loader.js";
import { GLTFLoader } from "https://cdn.skypack.dev/three/examples/jsm/loaders/GLTFLoader.js";
import { GLTFExporter } from "https://cdn.skypack.dev/three/examples/jsm/exporters/GLTFExporter.js";
import { Entity } from "./entity.js";
import { FileSystem } from "./filesystem.js"

let _vr = false;
let _entities;

export function setVR(val) {
    _vr = val;
}

export function log(content) {
    let logger = document.getElementById("logger-content");
    logger.style = "overflow-y:scroll;overflow-x:hidden;"
    let li = document.createElement("li");
    li.style = "display:block;"
    li.append(content)
    logger.append(li);
}

export function shell() {
    let shell = document.createElement("div");
    shell.className = "shell ";

    document.body.append(li);
}

export function icon(name) {
    let i = document.createElement("i");
    i.className += "fas fa-" + name + " ";
    return i;
}

export function fileTree(files, scene) {
    let dir = document.getElementById("component-filetree");
    dir.style.backgroundColor = "black";
    dir.style.color = "white";
    dir.style.overflow = "scroll";
    dir.style.height = "500px";
    let meta = [];
    console.log("%c %s", "color: green", files);
    let o = JSON.parse(files);
    for (let e in o) {
        if (e == "response") {
            // if (o[e].hasOwnProperty("files")) {
            for (let i in o[e]) {
                let arr = o[e][i].split("\n");
                let label = document.createElement("label");
                label.setAttribute("for", "directory");
                let input = document.createElement("input");
                input.style.display = "none";
                input.setAttribute("type", "checkbox");
                label.setAttribute("id", "directory");
                label.append(icon("folder"));
                label.append(" assets");
                label.addEventListener("click", function(){
                    input.checked = !input.checked;
                });
                // meta.append(label);
                // meta.append(input);
                dir.append(label);
                dir.append(input);
                for (let j of arr) {
                    if (j != "") {
                        // zerba method
                        let li = document.createElement("li");
                        li.setAttribute("data-value", j);
                        li.className = "leaf";
                        li.append(icon("file"));
                        li.append(" "+j);
                        dir.append(li);
                        if (i == "scenes") {
                            meta.push(li);
                        }

                        // tree method
                        // let li = document.createElement("li");

                        // <label for="menu-1-1">menu-1-1</label>
                        // <input type="checkbox" id="menu-1-1" />
                    }
                }
            }
        }
    }
    // dir.append(files);
    // $("#component-scenes").append(meta);
    for (let k of meta) {
        k.setAttribute("data-role", "scene-trigger");
        k.setAttribute("data-value", k.innerText);
        k.className = "";
        console.warn(k);
        $("div#component-scenes").append(k);
        k.addEventListener("click", function() {
            let target = this.getAttribute("data-value");
            let script = target.split(".")[0];
            console.warn(target);
            scene.changeScript(script);
        });
    }
}

export function components(param) {
    let element = document.getElementById("components");
    // element.setAttribute("id", "component-menu");
    // element.className = "dag";
    // element.style.float = "right";
    // element.style.width = "500px";
    // element.style.padding = "0px";
    // let cols = document.createElement("div");
    // cols.className = "component-navigation";
    // let colA = document.createElement("div");
    // colA.append("A");
    // colA.className = "left-col";
    // cols.append(colA);
    // for (let i = 0; i < 12; i++) {
    //     let col = document.createElement("div");
    //     col.className = "right-col";
    //     col.append(`row ${i}`);
    //     cols.append(col);
    // }
    // element.append(cols);
    // document.body.append(element);

    // <section id="component-menuz" style="display:block;">
    // <div id="component-navigationz">
    //     <div class="left-col">A</div>
    //     <div class="right-col">B</div>
    // </div>
// </section>
}

function leaf(e, parent = undefined) {
    let li = document.createElement("li");
    li.className = "leaf";
    li.setAttribute("data-role","entity");
    if (parent != undefined) {
        li.setAttribute("data-entity-id",parent.entityId);
    } else {
        li.setAttribute("data-entity-id",e.entityId);
    }
    if (e.name == "Light") {
        li.append(icon("lightbulb"));
    } else if (e.name == "Camera") {
        li.append(icon("camera"));
    } else {
        li.append(icon("cube"));
    }
    li.append(" "+e.name);
    return li;
}

export function dag(entities) {
    let shell = document.createElement("section");
    shell.className = "dag folder-tree";
    shell.setAttribute("id", "dag");
    _entities = entities;
    console.log("########");
    console.log(entities);
    for (let e of entities) {    
        if (e.children.length > 0) {
            console.log("element has children");
            let li = document.createElement("li");
            li.className = "directory";
            let label = document.createElement("label");
            li.style.display = "block";
            li.style.padding = "5px 0px";
            label.setAttribute("for", "directory");
            let input = document.createElement("input");
            input.style.display = "none";
            input.setAttribute("type", "checkbox");
            input.checked = false;
            li.append(label);
            li.append(input);
            label.setAttribute("id", "directory");
            label.addEventListener("click", function(){
                input.checked = !input.checked;
                (input.checked) ? li.style.color = "rgba(0, 255, 255)" : li.style.color = "white";
            });
            li.className = "comet";
            li.setAttribute("data-role","entity");
            li.setAttribute("data-entity-id",e.entityId);
            // if (e.name == "Light") {
            //     label.append(icon("lightbulb"));
            // } else if (e.name == "Camera") {
            //     label.append(icon("camera"));
            // } else {
                label.append(icon("meteor"));
            // }
            label.append(` ${e.name}`);
            label.addEventListener('dblclick', function() {
                $("#inspector").show();
                $("#inspector div").html('');
                $("#inspector div").append("<H5>entity inspector for "+e.name+"</H5>");
                let f = createForm(e);
                $("#inspector div").append(f);
            });
            for (let j of e.children) {
                li.append(leaf(j, e.entityId));
                console.warn("HAS CHILD");
            }
            shell.append(li);
            // shell.append(input);
        } else {
            shell.append(leaf(e));
            // let li = document.createElement("li");
            // li.className = "leaf";
            // li.style = "display:block;"
            // li.setAttribute("data-role","entity");
            // li.setAttribute("data-entity-id",e.entityId);
            // li.append(icon("cube"));
            // li.addEventListener('click', function() {
            //     $("#inspector").show();
            //     $("#inspector div").html('');
            //     $("#inspector div").append("<H5>entity inspector for "+e.name+"</H5>");
            //     let f = createForm(e);
            //     $("#inspector div").append(f);
            // });
            // li.append(" "+e.name+" loaded");
            // shell.append(li);
            // log(e.name+" loaded");
        }

    }
    document.getElementById("wrapper").append(shell); 
}

export function entities(scene) {
    let glbLoader = new GLTFLoader();
    let exporter = new GLTFExporter();

    const dropzone = document.getElementById('component-dropzone');

    dropzone.ondragover = dropzone.ondragenter = function (e) {
        e.preventDefault();
    }
    dropzone.ondrop = function (e) {
        e.stopPropagation()
        e.preventDefault()
        console.log(e);
        const files = (e.dataTransfer).files;
        const reader = new FileReader();
        console.log(files);
        reader.onload = function () {
            console.warn(reader.result);
            // Loader.load(reader.result).then(function(data) {
            //     console.warn(data);
            // });
            glbLoader.parse(reader.result, "/", (data) => {
                console.log(data);
                let formatted = Loader.format(data);
                console.log(formatted);
                let entity = new Entity(formatted);
                console.log(entity);
                scene.scene.add(entity.model);
                let ents = scene.entities;
                ents.push(entity);
                scene.entities = ents;
                exporter.parse(data.scene,
                	function ( gltf ) {
                        console.log( gltf );
                        // var data = "text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(gltf));
                        let link = document.createElement("a");
                        link.style.display = "none";
                        document.body.append(link);

                        function saveArrayBuffer( buffer, filename ) {

                            save( new Blob( [ buffer ], { type: 'application/octet-stream' } ), filename );
            
                        }

                        function save( blob, filename ) {

                            link.href = URL.createObjectURL( blob );
                            link.download = filename;
                            link.click();
                        }

                        saveArrayBuffer( gltf, 'scene.glb' );

                        // el.click();
                        // '<a href="data:' + data + '" download="data.glb">download JSON</a>';
                        // downloadJSON( gltf );
                        // console.log(gltfJson);
                        // const jsonString = JSON.stringify(gltfJson);
                        // console.log(jsonString);
                    
                        // // The following doesn't seem to work due to iframe sandboxing.
                        // // But please save the gltf json from the Console to obtain the file.
                        // const blob = new Blob([jsonString], { type: "application/json" });
                        // saveAs(blob, "colored-square.glb");
                        console.log("Download requested");
                
                    },
                    // called when there is an error in the generation
                    function (error) {
                        console.error("Failed to export glb file");
                
                    },
                    {binary: true}
                )

            }, 
            (error) => {
                console.error(error);
            });
        };
        reader.readAsArrayBuffer(files[0]);
    }
}

export function cleanDag() {
    let dag = document.getElementById("dag");
    // console.log("childreeeeeeen");
    // console.log(dag.children.length);
    dag.remove();
}

export function createForm(e) {
    let form = document.createElement('form');
    let i = createInput("text", "an-id", "a-role", ["cool", "man"]);
    let i2 = createInput("select", "an-id", "a-role", ["building", "big"], ["cool", "not cool", "kinda cool"]);
    let i3 = createInput("radio", "an-id", "a-role", ["cool", "man"], ["x", "y", "z"]);
    let i4 = createInput("checkbox", "an-id", "a-role", ["cool", "man"]);
    let i5 = createInput("text", "an-id", "a-role", ["cool", "man"]);
    let i6 = createInput("submit", "an-id", "a-role", ["cool", "man"] );
    let l1 = createLabel("position");
    let l2 = createLabel("direction");
    let l3 = createLabel("rotation");
    let l4 = createLabel("scale");
    let l5 = createLabel("component");
    let l6 = createLabel("submit");
    form.append(l1);
    form.append(i);
    form.append(l2);
    form.append(i2);
    form.append(l3);
    form.append(i3);
    form.append(l4);
    form.append(i4);
    form.append(l5);
    form.append(i5);
    form.append(l6);
    form.append(i6);
    let p = createVector("translation", e.model.position);
    let r = createVector("rotation", e.model.rotation);
    let s = createVector("scale", e.model.scale);
    form.append(p); form.append(r); form.append(s);
    return form;
}

export function createLabel(name) {
    let label = document.createElement("label");
    label.setAttribute("value", name);
    label.innerHTML = `${name}`;
    return label;
}

export function createGroup() {

}

export function createVector(name, vector) {
    let group = document.createElement("div");
    group.className += "quad";
    let label = document.createElement("label");
    label.setAttribute("value", name);
    label.className += "a";
    label.innerHTML = `${name}`;
    let xG = document.createElement("div");
    xG.className += "b";
    let x = createInput("text", vector.x, name);
    xG.append("x"); xG.append(x);
    let yG = document.createElement("div");
    yG.className += "c";
    let y = createInput("text", vector.y, name);
    yG.append("y"); yG.append(y);
    let zG = document.createElement("div");
    zG.className += "d";
    let z = createInput("text", vector.z, name);
    zG.append("z"); zG.append(z);
    group.append(label);
    group.append(x); group.append(y); group.append(z);
    return group;
}

export function lighting(lights) {
    let element = document.getElementById("components-light");
    for(let e of lights) {
        let li = document.createElement("li");
        li.setAttribute("data-uuid", e.uuid);
        li.setAttribute("data-name", e.name);
        li.setAttribute("id", "component-light");
        li.className = "component-li";
        li.append(`Light ${e.name}`);
        element.append(li);
    }
}

export function analytics(entities, collections, collidables, clickables, grabbables) {
    let el = document.getElementById("component-statistics");
    let div = document.createElement("div");
    div.append(createLi("Entities: "+entities.length));
    div.append(createLi("Collections: "+collections.length));
    div.append(createLi("Collidables: "+collidables.length));
    div.append(createLi("Clickables: "+clickables.length));
    div.append(createLi("Grabbables: "+grabbables.length));
    el.append(div);
}

function createLi(content) {
    let li = document.createElement("li");
    li.append(content);
    return li;
}

export function createInput(type, content, role, data = '', options = '') {
    let result;
    switch(type) {
        case "text":
            result = document.createElement("input");
            result.setAttribute("type", "text");
            break;
        case "radio":
            result = document.createElement("input");
            result.setAttribute("type", "radio");
            for (const e in options) {
                result.setAttribute("value", `${options[e]}`);
                result.append(`${options[e]}`);
            }
            break;
        case "checkbox":
            result = document.createElement("input");
            result.setAttribute("type", "checkbox");
            for (const e in options) {
                result.setAttribute("value", `${options[e]}`);
                result.append(`${options[e]}`);
            }
            break;
        case "password":
            result = document.createElement("input");
            result.setAttribute("type", "text");
            break;
        case "submit":
            result = document.createElement("input");
            result.setAttribute("type", "submit");
            break;
        case "select":
            result = document.createElement("select");
            for (const e in options) {
                console.log("***");
                console.log(e);
                let option = document.createElement("option");
                option.setAttribute("value", `${options[e]}`);
                option.append(`${options[e]}`);
                result.append(option);
            }
            break;
        case "textarea":
            result = document.createElement("div");
            result.setAttribute("content-editable", "true");
            break;
        default:
            log("invalid input type");
            break;
    }
    if (data != '') {
        for(const e in data) {
            let key = data[e][0];
            let value = data[e][1];
            result.setAttribute(`data-${key}`,value);
        }   
    }
    result.setAttribute("value", content);
    result.setAttribute("data-role", role);
    result.setAttribute("group", "inspector");
    return result;
}

export function success(message) {
    notify(0, message);
}

export function failure(message) {
    notify(1, message);
}

export function warning(message) {
    notify(3, message);
}

export function notice(message) {
    notify(2, message);
}

export function notify(type, message) {
    let wrap = document.getElementById("alert-wrapper");
    let alert = document.createElement("div");
    alert.className = "alert " + alertCounter + " ";
    let icon = document.createElement("div");
    icon.className = "icon ";
    let symbol = document.createElement("i");
    symbol.className = "fas ";
    let content = document.createElement("div");
    content.className = "content ";
    content.innerHTML += message;
    switch(type) {
      case 0:
        symbol.className += "fa-check-circle ";
        symbol.className += "success";
        icon.className += "green-bg";
        content.className += "success-bg green";
        alert.className += "green-border";
        break;
      case 1:
        symbol.className += "fa-skull-crossbones ";
        symbol.className += "danger";
        icon.className += "red-bg";
        content.className += "danger-bg red";
        alert.className += "red-border";
        break;
      case 2:
        symbol.className += "fa-star ";
        symbol.className += "notice";
        icon.className += "blue-bg";
        content.className += "notice-bg blue";
        alert.className += "blue-border";
        break;
      case 3:
        symbol.className += "fa-exclamation-circle ";
        symbol.className += "warning";
        icon.className += "orange-bg";
        content.className += "warning-bg orange";
        alert.className += "orange-border";
        break;
      default: 
        break;
    }
    icon.append(symbol);
    alert.append(icon);
    alert.append(content);
    wrap.append(alert);
    alertCounter++;
    $(".alert").delay(4000).fadeOut(2000);
}