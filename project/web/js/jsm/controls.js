import { OrbitControls } from 'https://cdn.skypack.dev/three@0.134.0/examples/jsm/controls/OrbitControls.js';
// import { ThirdPersonControls } from './controls/thirdperson.js';
import { TrackballControls } from 'https://cdn.skypack.dev/three@0.134.0/examples/jsm/controls/TrackballControls.js';

let _camera;
let _container;
let _controls;

class Controls {
    
    constructor(camera, container, _default = true) {
        _camera = camera;
        _container = container;
        if (_default) {
            _controls = new OrbitControls(camera, container);
        }
    }

    get controls() {
        return _controls;
    }

    update() {
        _controls.update();
    }

    use(name) {
        switch(name) {
            case "orbital":
                _controls = new OrbitalCamera(_camera, _container);
                break;
            // case "first":
            //     _controls = new FirstPersonControls(camera, container);
            //     break;
            case "third":
                _controls = new ThirdPersonControls(_camera, _container);
                break;
            case "trackball":
                _controls = new TrackballControls(camera, container);
                break;
            case "first":
                _controls = new FirstPersonControls(camera, container);
                break;
            default:
                alert("ERROR: No controls found!");
                break;
        }
    }

} export { Controls }