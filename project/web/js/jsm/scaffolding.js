import { Vector3 } from "../three.module.js";
import { WSApi } from "./system/socket.js";

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

export function dag(entities) {
    let shell = document.createElement("section");
    shell.className = "dag ";
    _entities = entities;
    for (let e of entities) {    
        let li = document.createElement("li");
        li.className = "fuck";
        li.style = "display:block;"
        li.setAttribute("data-role","entity");
        li.setAttribute("data-entity-id",e.entityId);
        li.append(icon("stroopwafel"));
        li.addEventListener('click', function() {
            $("#inspector").show();
            $("#inspector div").html('');
            $("#inspector div").append("<H5>entity inspector for "+e.name+"</H5>");
            let f = createForm(e);
            $("#inspector div").append(f);
        });
        li.append(" "+e.name+" loaded");
        shell.append(li);
        log(e.name+" loaded");
    }
    document.body.append(shell); 
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