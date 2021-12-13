import * as THREE from '../../three.module.js'

class Automate {
    constructor(obj, pois) {
        this._obj = obj;
        this._pois = pois;
        this._speed = 1;
        this._maxSpeed = 5;
        this._acceleration = 0.2;
        this._deceleration = 0.1;
        this._idx = 0;
        for (let poi in pois) {
            this._pois.push(new THREE.Vector3(pois[poi][0], pois[poi][1], pois[poi][2]));
        }
    }

    get idx() { return this._idx; }
    get pois() { return this._pois; }

    increment() { this._idx++; }

    isColliding(idx) {
        console.log(this._obj.position);
        console.log(this._pois[idx]);
        return (this._obj.position.distanceTo(this._pois[idx]) <= 0.1);
    }

    move(idx, dt) {
        // prevents operator overload
        let pt = new THREE.Vector3(this._pois[idx][0], this._pois[idx][1], this._pois[idx][2]);
        console.log(pt);
        pt.sub(this._obj.position);
        console.log(pt);
        pt.normalize();
        let pos = new THREE.Vector3(this._obj.position.x, this._obj.position.y, this._obj.position.z);
        pt.multiplyScalar(5);
        console.log(pt);
        pos.add(pt);
        // pos.add(direction.multiplyScalar(this._speed * dt));
        // pos.add(direction.multiplyScalat)
        this._obj.position.copy(pos);
        console.log(pos);
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