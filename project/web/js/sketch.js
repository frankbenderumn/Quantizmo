var api = new WSApi();

var count = 0;
var size = 80;
var color = {r: 0, g: 0, b: 0, a: 0}

try {
	/*socket.onmessage =function got_packet(msg) {
		count++;
		//console.log(count, JSON.parse(msg.data));
		var data = JSON.parse(msg.data);
		if (data.command == "updateElipse") {	
			size = data.size;
			color.r = data.color.r;
			color.g = data.color.g;
			color.b = data.color.b;
			color.a = data.color.a;	
		}
	} */
} catch(exception) {
	alert('<p>Error' + exception);  
}

// P5 functions
function setup() {
	//createCanvas(640, 480);
	createCanvas(windowWidth,windowHeight);
}

function draw() {
  background(128); 
  fill(color.r, color.g, color.b, color.a)
  ellipse(mouseX, mouseY, size, size);
}

function mouseMoved() {
    api.sendCommand({command: "mouseMoved", mouseX: mouseX, mouseY: mouseY}).then(
        function(data) {
            size = data.size;
            color.r = data.color.r;
            color.g = data.color.g;
            color.b = data.color.b;
            color.a = data.color.a;	
            console.log(data);
        }
    );
}
