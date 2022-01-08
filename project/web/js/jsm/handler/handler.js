import * as THREE from "../../three.module.js"
import { Debug } from "../debug.js"
import { DevelopmentHandler } from "./DevelopmentHandler.js"
import { KeyboardHandler } from "./KeyboardHandler.js"
// import { XRHandler } from "./XRHandler.js"
import { GamepadHandler } from "./GamepadHandler.js"

let turnDragSpeed;
let initTurnSpeed;
let pointer = new THREE.Vector2(0, 0);
let drag = false;
let rClick = false;
let lClick = false;
// let scroll = false;
let cClick = false;
let dClick = false;
let zoomScale = 1;
let lastPoint = new THREE.Vector2(0, 0);
let xMove = 0;
let yMove = 0;
let frame = 0;
let lastDist = 0; 
let mouseMove = false; 

function cameraAngle() {
    if (drag) {
        controls.theta = controls.theta + 0.2 * xMove;
        controls.phi = controls.phi + 0.2 * yMove;
    } else if (mouseMove) {
        controls.turnSpeed = turnDragSpeed;
    } else {
        initTurnSpeed = controls.turnSpeed;
    }
    // axle *= zoomScale;
  }
  
  let mouseMoveEvent = function(e) {
      frame += 1;
      pointer.x = ( e.clientX / window.innerWidth );
      pointer.y = ( e.clientY / window.innerHeight );
      let newPoint = new THREE.Vector2(pointer.x, pointer.y);
      let newDist = lastPoint.distanceTo(newPoint);
  
      if (lClick) {
          xMove = (pointer.x - lastPoint.x) / lastPoint.x;
          yMove = (pointer.y - lastPoint.y) / lastPoint.y;
          drag = true;
      } else if (rClick) {
          mouseMove = true; 
          console.log("dragging");
          console.log("y prev move is: "+ lastPoint.y);
          console.log("y move is: "+ pointer.y);
          let scaleFactor;
          if (lastDist != 0) {
              scaleFactor = (newDist - lastDist) / lastDist;
          } else {
              scaleFactor = 0;
          }
          console.log("scale factor is: "+scaleFactor);
          controls.turnDragSpeed = controls.turnDragSpeed + scaleFactor;
  
          if (newPoint.x < lastPoint.x) {
              controls.turn(0, -1);
              controls.clearTurn(0, 1);
          } else {
              controls.turn(0, -1);
              controls.clearTurn(0, -1);
          }
  
          if (newPoint.y < lastPoint.y) {
              controls.turn(1, -1);
              controls.clearTurn(1, 1);
          } else {
              controls.turn(1, 1);
              controls.clearTurn(1, -1);
          }
  
          console.log("frame is: "+frame);
  
      } else {
          xMove = 0;
          yMove = 0;
      }
  
      if (frame > 100) {
          lastPoint = new THREE.Vector2(pointer.x, pointer.y);
          frame = 0;
          lastDist = newDist; 
          lastPoint = newPoint;
      }
  }
  
  let mouseDownEvent = function(e) {
      if (e.which === 3 && !lClick) { // right mouse (l = 1, c = 2, r = 3)
          rClick = true;
          let a = ( e.clientX / window.innerWidth );
          let b = ( e.clientY / window.innerHeight );
          lastPoint = new THREE.Vector2(a, b);
      } else if (e.which === 1 && rClick || e.which === 3 && lClick) {
          dClick = true;
          controls.move(2, -1);
      } else if (e.which === 1 && !rClick) {
          lClick = true;
          console.log("client x is: "+e.clientX);
          console.log("client y is: "+e.clientY);
          let a = ( e.clientX / window.innerWidth );
          let b = ( e.clientY / window.innerHeight );
          lastPoint = new THREE.Vector2(a, b);
          frame = 0;
      }
  }
  
  let mouseUpEvent = function(e) {
      if (dClick) {
          dClick = false;
          negMove[2] = 0;
          controls.clearMove(2, 0);
      }
      if (rClick) {
          rClick = false;
          controls.clearTurn(0, 1);
          controls.clearTurn(0, -1);
          controls.clearTurn(1, -1);
          controls.clearTurn(1, 1);
      }
  
      drag = false;
      lClick = false;
  }
  
  let press = function(e) {
    api.sendCommand(e.type, {key: e.key, keyCode: e.keyCode});
    let keyCode = e.keyCode;
  }
  
  let release = function(e) {
    api.sendCommand(e.type, {key: e.key, keyCode: e.keyCode});
    let keyCode = e.keyCode;
  }

  class Handler {
    constructor() {
        this._strategy = new DevelopmentHandler();
        this._current = "browser";
        this._cache = [];
        this._user = undefined;
        this._rig = undefined;
        this._viewport = undefined;
        this._controls = undefined;
    }

    get user() { return this._user; }
    set user(val) { this._user = val; }
    get controls() { return this._controls; }
    set controls(val) { this._controls = val; }

    focus() {
        this._user.controls.focus(this._user);
    }

    setType(name) {
        if (name === "development") {
            if(!this.cache(name)) {
                this._strategy = new DevelopmentHandler();
                this._cache[name] = this._strategy;
            } else {
                this._strategy = this._cache[name]; 
            }
        } else if (name === "gamepad") {
            if(!this.cache(name)) {
                if (this._user.controls === undefined) {
                    Debug.log("controls in handler is undefined", "failure");
                } else {
                    this._strategy = new GamepadHandler(this._user);
                }
                this._cache[name] = this._strategy;
            } else {
                this._strategy = this._cache[name]; 
            }
        } else if (name === "keyboard") {
            if(!this.cache(name)) {
                this._strategy = new KeyboardHandler();
                this._cache[name] = this._strategy;
            } else {
                this._strategy = this._cache[name]; 
            }
        } else if (name === "xr") {
            if(!this.cache(name)) {
                // this._strategy = new XRHandler();
                this._cache[name] = this._strategy;
            } else {
                this._strategy = this._cache[name]; 
            }
        } else {
            Debug.log("invalid strategy type", "failure");
        }
    }

    cache(name) {
        if (this._cache.length === 0) {
            return false;
        } else if (!this._cache.hasObjectProperty(name)) {
            return false;
        } else {
            return true;
        }
    }

    update(dt) {
        this._strategy.update(dt);
    }

  } export { Handler }