import * as Rain from '../rain.js';
import * as Snow from '../snow.js';
import * as Tornado from '../tornado.js';

// class Weather {
//   constructor(scene) {
//     this.scene = scene;
//     this.type = -1;
//     this.tornadoLoader = new Tornado(this.scene);
//     this.rainLoader = new Rain(this.scene);
//     this.snowLoader = new Snow(this.scene);
//   }

  // init(name) {
  //   switch (name) {
  //     case "tornado":
  //       this.type = 0;
  //       this.tornadoLoader.init();
  //       this.scene.add(this.tornadoLoader.object);
  //       break;
  //     case "rain":
  //       this.type = 1;
  //       this.rainLoader.init();
  //       this.scene.add(this.rainLoader.object);
  //       break;
  //     case "snow":
  //       this.type = 2;
  //       this.snowLoader.init();
  //       this.scene.add(this.snowLoader.object);
  //       break;
  //     default:
  //       console.log("invalid weather type!");
  //       break;
  //   }
  // }

  // let weatherType = {
  //   0: "snow",
  //   1: "rain",
  //   2: "tornado",
  //   3: "blizzard",
  //   4: "fire"
  // };
  
  
  // clearWeather() {
  //   scene.remove(snow);
  //   scene.remove(rain);
  //   scene.remove(tornado);
  //   // scene.remove(blizzard);
  //   for (let k = 0; k < 70; k++) {
  //     scene.remove(tornado[k]);
  //   }
  //   scene.fog = undefined;
  // };
  
  // getWeather () {
  //   return weatherIndex;
  // }
  
  // initWeather = (num) => {
  //   $.fn.clearWeather();
  //   switch (num) {
  //     case "0":
  //       scene.add(snow);
  //       scene.remove(sky);
  //       scene.background = new THREE.Color(0xffffff);
  //       scene.fog = new THREE.Fog(0xffffff, 0.015, 100);
  //       changeWeather(0);
  //       break;
  //     case "1":
  //       scene.add(rain);
  //       changeWeather(1);
  //       break;
  //     case "2":
  //       for (let k = 0; k < 70; k++) {
  //         scene.add(tornado[k]);
  //       }
  //       scene.remove(sky);
  //       changeWeather(2);
  //       break;
  //     case "3":
  //       changeWeather(3);
  //       break;
  //     case "4":
  //       apocalypsef();
  //       changeWeather(4);
  //       break;
  //     case "5":
  //       floodf();
  //       changeWeather(5);
  //       break;
  //     default:
  //       console.log("WEATHER PATTERN NOT FOUND!");
  //   }
  // };

// } export { Weather }
  