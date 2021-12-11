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
    // if (keyCode == 65) { // KeyA
    //     controls.move(0, -1);
    // } else if (keyCode == 83) { // KeyS
    //     controls.move(2, 1);
    // } else if (keyCode == 68) { // KeyD
    //     controls.move(0, 1);
    // } else if (keyCode == 87) { // KeyW
    //     controls.move(2, -1);
    // } else if (keyCode == 37) { // ArrowLeft
    //     controls.turn(0, -1);
    // } else if (keyCode == 39) { // ArrowRight
    //     controls.turn(0, 1);
    // } else if (keyCode == 38) { // ArrowUp
    //     controls.turn(1, -1);
    // } else if (keyCode == 40) { // ArrowDown
    //     controls.turn(1, 1);
    // }
  }
  
  let release = function(e) {
    api.sendCommand(e.type, {key: e.key, keyCode: e.keyCode});
    let keyCode = e.keyCode;
    // if (keyCode == 65) { // KeyA
    //     controls.clearMove(0, -1);
    // } else if (keyCode == 83) { // KeyS
    //     controls.clearMove(2, 1);
    // } else if (keyCode == 68) { // KeyD
    //     controls.clearMove(0, 1);
    // } else if (keyCode == 87) { // KeyW
    //     controls.clearMove(2, -1);
    // } else if (keyCode == 37) { // ArrowLeft
    //     controls.clearTurn(0, -2);
    // } else if (keyCode == 39) { // ArrowRight
    //     controls.clearTurn(0, 1);
    // } else if (keyCode == 38) { // ArrowUp
    //     controls.clearTurn(1, -1);
    // } else if (keyCode == 40) { // ArrowDown
    //     controls.clearTurn(1, 1);
    // }
  }