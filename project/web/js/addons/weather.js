// function snowf() {
    var particleCount = 100000,
    particles = new THREE.Geometry(),
    pMaterial = new THREE.PointsMaterial({
      color: 'rgb(255,255,255)',
      size: 0.2
    });
  
  for (var p = 0; p < particleCount; p++) {
    var pX = Math.random() * 500 - 250,
      pY = Math.random() * 500 - 250,
      pZ = Math.random() * 500 - 250,
      particle = new THREE.Vector3(pX, pY, pZ);
  
    particles.vertices.push(particle);
    snow = new THREE.Points(
      particles,
      pMaterial);
  }
  // };
  
  // function rainf() {
  var dropletCount = 100000,
    droplets = new THREE.Geometry(),
    dropletMat = new THREE.PointsMaterial({
      color: 0x0FFFFF,
      size: 0.1
    });
  
  for (var p = 0; p < dropletCount; p++) {
    var pX = Math.random() * 500 - 250,
      pY = Math.random() * 500 - 250,
      pZ = Math.random() * 500 - 250,
      droplet = new THREE.Vector3(pX, pY, pZ);
  
    droplets.vertices.push(droplet);
    rain = new THREE.Points(
      droplets,
      dropletMat);
  }
  // }
  
  // function tornadof() {
  var tMAt = new THREE.PointsMaterial({
    color: 'rgba(80, 80, 80, 0.2)',
    transparent: true,
    opacity: 0.65,
    size: 0.75
  });
  
  tornado = [];
  var t = 0;
  for (let i = 0; i < 70; i++) {
    t = 100 * i;
    droplets = new THREE.Geometry();
  
    for (var p = 0; p < t; p++) {
      var pX = Math.random() * 0.2 * (i * 0.1 * i) - 0.15 * (i * 0.075 * i) + (Math.random() * 5 - 2.5),
        pY = (Math.random() + 1) * i * 0.5,
        pZ = Math.random() * 0.2 * (i * 0.1 * i) - 0.15 * (i * 0.075 * i) + (Math.random() * 5 - 2.5),
        v = new THREE.Vector3(pX, pY, pZ);
  
      droplets.vertices.push(v);
    }
    tornado[i] = new THREE.Points(droplets, tMAt);
  
  }
  // }
  
  const weatherType = {
    0: "snow",
    1: "rain",
    2: "tornado",
    3: "blizzard",
    4: "fire"
  };
  
  
  $.fn.clearWeather = () => {
    scene.remove(snow);
    scene.remove(rain);
    // scene.remove(tornado);
    scene.remove(blizzard);
    for (let k = 0; k < 70; k++) {
      scene.remove(tornado[k]);
    }
    scene.fog = undefined;
  };
  
  $.fn.getWeather = () => {
    return weatherIndex;
  }
  
  $.fn.initWeather = (num) => {
    $.fn.clearWeather();
    switch (num) {
      case "0":
        scene.add(snow);
        scene.remove(sky);
        scene.background = new THREE.Color(0xffffff);
        scene.fog = new THREE.Fog(0xffffff, 0.015, 100);
        changeWeather(0);
        break;
      case "1":
        scene.add(rain);
        changeWeather(1);
        break;
      case "2":
        for (let k = 0; k < 70; k++) {
          scene.add(tornado[k]);
        }
        scene.remove(sky);
        changeWeather(2);
        break;
      case "3":
        changeWeather(3);
        break;
      case "4":
        apocalypsef();
        changeWeather(4);
        break;
      case "5":
        floodf();
        changeWeather(5);
        break;
      default:
        console.log("WEATHER PATTERN NOT FOUND!");
    }
  };
  