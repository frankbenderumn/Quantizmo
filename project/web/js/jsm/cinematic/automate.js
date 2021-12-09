import * as THREE from '../../three.module.js'

class Automate {
    constructor(obj, pois) {
        this._obj = obj;
        this._pois = [];
        this._speed = 0;
        this._maxSpeed = 5;
        this._acceleration = 0.2;
        this._deceleration = 0.1;
        this._idx = -1;
        for (let poi of pois) {
            this._pois.push(new THREE.Vector3(poi[0], poi[1], poi[2]));
        }
    }

    get idx() { return this._idx; }
    get pois() { return this._pois; }

    increment() { this._idx++; }

    isColliding(idx) {
        return (this._obj.position.distanceTo(pois[idx]) <= 1);
    }

    move(idx, dt) {
        // prevents operator overload
        let temp = this._pois[idx] - this._obj.position;
        let direction = temp.normalize();
        this._obj.position += direction * speed * dt;
    }

    up() {
        let speed = this._acceleration * dt;
        this._speed += speed;
        if (this._speed > this._maxSpeed) {
            this._speed = this._maxSpeed;
        }
    }

    down() {
        let speed = this._deceleration * dt;
        this._speed -= speed;
        if (this._speed < 0) {
            this._speed = 0;
        }
    }

} export { Automate }