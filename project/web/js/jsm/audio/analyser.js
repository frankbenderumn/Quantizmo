import * as THREE from '../../three.module.js';

// if ( typeof scriptId === 'string' ) {
//     var script = document.createElement( 'script' );
//     script.id = scriptId;
//     script.type = 'x-shader/x-vertex';
//     script.textContent = '\
//             attribute float size;\
//             attribute float time;\
//             attribute vec3 customColor;\
//             uniform float globalTime;\
//             varying vec3 vColor;\
//             varying float fAlpha;\
//             \
//             void main() {\
//                 vColor = customColor;\
//                 vec3 pos = position;\
//                 float localTime = time + globalTime;\
//                 float modTime = mod( localTime, 1.0 );\
//                 float accTime = modTime * modTime;\
//                 pos.x += cos( modTime * 8.0 + ( position.z ) ) * 70.0;\
//                 pos.z += sin( modTime * 6.0 + ( position.x ) ) * 100.0;\
//                 fAlpha = ( pos.z ) / 1800.0;\
//                 vec3 animated = vec3( pos.x, pos.y * accTime, pos.z );\
//                 vec4 mvPosition = modelViewMatrix * vec4( animated, 1.0 );\
//                 gl_PointSize = min( 150.0, size * ( 150.0 / length( mvPosition.xyz ) ) );\
//                 gl_Position = projectionMatrix * mvPosition;\
//             }';
//     document.head.appendChild( script );        
//     return script;
// }

// const listener = new THREE.AudioListener();
// camera.add( listener );

// // create a global audio source
// const sound = new THREE.Audio( listener );

// // load a sound and set it as the Audio object's buffer
// const audioLoader = new THREE.AudioLoader();
// audioLoader.load( 'sounds/ambient.ogg', function( buffer ) {
// 	sound.setBuffer( buffer );
// 	sound.setLoop( true );
// 	sound.setVolume( 0.5 );
// 	sound.play();
// });

export function analyze(_file, camera) {

const listener = new THREE.AudioListener();
camera.add( listener );

// create a global audio source
const sound = new THREE.Audio( listener );

// load a sound and set it as the Audio object's buffer
const audioLoader = new THREE.AudioLoader();
audioLoader.load( _file, function( buffer ) {
	sound.setBuffer( buffer );
	sound.setLoop( true );
	sound.setVolume( 0.5 );
	sound.play();
});

}

// export function analyze(_file, renderer) {
//     const fftSize = 128;
//     const listener = new THREE.AudioListener();

//     const audio = new THREE.Audio( listener );
//     const file = _file;

//     // if ( /(iPad|iPhone|iPod)/g.test( navigator.userAgent ) ) {

//         const loader = new THREE.AudioLoader();
//         loader.load( file, function ( buffer ) {
//             audio.setBuffer( buffer );
//             audio.setLoop( true );
//             audio.setVolume( 0.5 );
//             audio.play();
//         } );

    // } else {

    //     const mediaElement = new Audio( file );
    //     $(document).click(function(){
    //         mediaElement.play();
    //         audio.setMediaElementSource( mediaElement );
    //     });
    // }

    // let analyser = new THREE.AudioAnalyser( audio, fftSize );
    // const format = ( renderer.capabilities.isWebGL2 ) ? THREE.RedFormat : THREE.LuminanceFormat;
    // let uniforms = {
    //     tAudioData: { value: new THREE.DataTexture( analyser.data, fftSize / 2, 1, format ) }
    // };

    // const material = new THREE.ShaderMaterial( {

    //     uniforms: uniforms,
    //     vertexShader: document.getElementById( 'vertexShader2' ).textContent,
    //     fragmentShader: document.getElementById( 'fragmentShader2' ).textContent

    // } );

    // const geometry = new THREE.PlaneGeometry( 1, 1 );
    // const mesh = new THREE.Mesh( geometry, material );
    // return [mesh, uniforms];
// }
