import * as THREE from '../three.module.js';
import { Water } from 'https://cdn.skypack.dev/three@0.132.2/examples/jsm/objects/Water.js';

class Ocean {
    constructor(scene) {this.scene = scene; this.water = undefined; }
    render() {
        const waterGeometry = new THREE.PlaneBufferGeometry(100000, 100000);
        this.water = new Water(
            waterGeometry,
            {
            textureWidth: 512,
            textureHeight: 512,
            waterNormals: new THREE.TextureLoader().load('../assets/texture/waternormals.jpg', function (texture) {
                texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
            }),
            alpha: 1.0,
            sunDirection: new THREE.Vector3(),
            sunColor: 0xffffff,
            waterColor: 0x001e0f,
            distortionScale: 0.1,
            fog: this.scene.fog !== undefined
            }
        );
        this.water.rotation.x = - Math.PI / 2;
        this.water.position.y = -10;
        this.scene.add(this.water);
    }
    update() {
        this.water.material.uniforms[ 'time' ].value += 1.0 / 70.0;
    }
} export { Ocean }