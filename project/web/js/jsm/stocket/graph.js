let _width = 0;
let _height = 0;
let _canvas;
let _ctx;

let _size = 25;
// let canvas = document.getElementById("grapha");
// let width = canvas.width;
// let height = canvas.height;
let _linesX, _linesY, _xAxis, _yAxis;
let _xStart = { number: 1, suffix: '\u03a0' };
let _yStart = { number: 1, suffix: '' };
let _demoA, _demoB = 0;
let _xRange, _yRange, _xInit, _yInit;
let _highlighting = true;
let _hovering = true;
let _collidables = [];
let _fillGraph = [];
let cursor = {
    x: 0,
    y: 0,
};

let _labels = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n',
'ao', 'bo', 'c', 'do', 'e', 'fr', 'g', 'h', 'in', 'j', 'k', 'l', 'm', 'n',
'a', 'b', 'c', 'd', 'ek', 'f', 'gl', 'h', 'i', 'j', 'k', 'l', 'm', 'n',
'a', 'b', 'c', 'di', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n',
'a', 'b', 'c', 'dh', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n',
'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n'];

let _points = ['10', '10', '11', '12', '6', '7', '8', '9', '1', '0', '10', '10', '11', '12', '6', '7', '8', '9', '1', '0', 
'10', '10', '11', '12', '6', '7', '8', '9', '1', '0', '10', '10', '11', '12', '6', '7', '8', '9', '1', '0'];



class Graph {
    constructor(width, height, id = "undefined") {
        _width = width;
        _height = height;
        if (id == "undefined") {
            _canvas = document.createElement("canvas");
            _canvas.style.width = width;
            _canvas.style.height = height;
            document.getElementById("visualizer");
        } else {
            _canvas = document.getElementById(id);
        }
        _canvas.style.backgroundColor = '#0e0e0e';
        _ctx = _canvas.getContext('2d');
        _linesX = Math.floor(_height/_size);
        _linesY = Math.floor(_width/_size);
        _xAxis = _linesX - 1;
        _yAxis = 1;
        console.warn("Initializing graph!");
    }

    drawTooltip(x, y) {
        _ctx.lineWidth = 5;
        _ctx.beginPath();
        _ctx.moveTo(x, y);
        _ctx.lineTo(x + 50, y);
        _ctx.lineTo(x + 50, y - 50);
        _ctx.lineTo(x, y - 50);
        // _ctx.closePath();
        _ctx.fillStyle = 'red';
        _ctx.fill();
    }

    drawFill() {
        _ctx.lineWidth = 2;
        _ctx.beginPath();
        _ctx.moveTo(_fillGraph[0].x, _fillGraph[0].y);
        for (let i = 0; i < _fillGraph.length; i++) { _ctx.lineTo(_fillGraph[i].x, _fillGraph[i].y); }
        _ctx.closePath();
        var grd = _ctx.createLinearGradient(0, 0, _canvas.width, _canvas.height);
        grd.addColorStop(0, '#00ff0055');
        grd.addColorStop(1, '#00110000');   
        _ctx.fillStyle = grd;
        _ctx.fill();
    }

    drawLine(points, xBin, yBin) {
        _ctx.lineWidth = 2;
        _ctx.beginPath();
        _ctx.moveTo(0, 0);
        _fillGraph.push({x: 0, y: 0});
        for (let i = 0; i < points.length; i++) {
            _ctx.lineTo(i * xBin, 10 - (points[i] * yBin) );
            _fillGraph.push({x: i * xBin, y: 10 - (points[i] * yBin)});
        }
        // hard coded cap for now (not 800), should be xBins * number of bins
        _fillGraph.push({x: 800, y: 0});
        _ctx.strokeStyle = "#00ff00";
        _ctx.stroke();
        this.drawFill();
    }

    drawGrid() {
        console.error("drawing grid");

// Grid lines
// =======================================
        for (let i = 0; i <= _linesX; i++) {
            _ctx.beginPath();
            _ctx.lineWidth = 1;
            
            // If line represents X-axis draw in different color
            (i == _xAxis) ? _ctx.strokeStyle = "#ffffff" : _ctx.strokeStyle = "#333333";
            
            if (i == _linesX) {
                _ctx.moveTo(0, _size*i);
                _ctx.lineTo(_width, _size*i);
            } else {
                _ctx.moveTo(0, _size*i+0.5);
                _ctx.lineTo(_width, _size*i+0.5);
            }
            _ctx.stroke();
        }

        // Draw grid lines along Y-axis
        for (let i = 0; i <= _linesY; i++) {
            _ctx.beginPath();
            _ctx.lineWidth = 1;
            
            // If line represents Y-axis draw in different color
            (i == _yAxis) ? _ctx.strokeStyle = "#ffffff" : _ctx.strokeStyle = "#333333";
            
            if(i == _linesY) {
                _ctx.moveTo(_size*i, 0);
                _ctx.lineTo(_size*i, _height);
            } else {
                _ctx.moveTo(_size*i+0.5, 0);
                _ctx.lineTo(_size*i+0.5, _height);
            }
            _ctx.stroke();
        }

        _ctx.translate(_yAxis * _size, _xAxis * _size);

// Grid Labels
// =========================
        // Ticks marks along the positive X-axis
        for(let i = 1; i < (_linesY - _yAxis); i++) {
            _ctx.beginPath();
            _ctx.lineWidth = 1;
            _ctx.strokeStyle = "#eeeeee";

            // Draw a tick mark 6px long (-3 to 3)
            _ctx.moveTo(_size*i+0.5, -3);
            _ctx.lineTo(_size*i+0.5, 3);
            _ctx.stroke();

            // Text value at that point
            _ctx.font = '9px Arial';
            _ctx.fillStyle = 'white';
            _ctx.textAlign = 'start';
            _ctx.fillText(_labels[i], _size*i-2, 15);
        }

        // Ticks marks along the negative X-axis
        for(let i = 1; i < _yAxis; i++) {
            _ctx.beginPath();
            _ctx.lineWidth = 1;
            _ctx.strokeStyle = "#eeeeee";

            // Draw a tick mark 6px long (-3 to 3)
            _ctx.moveTo(-_size*i+0.5, -3);
            _ctx.lineTo(-_size*i+0.5, 3);
            _ctx.stroke();

            // Text value at that point
            _ctx.font = '9px Arial';
            _ctx.fillStyle = 'white';
            _ctx.textAlign = 'end';
            _ctx.fillText(-_xStart.number*i + _xStart.suffix, -_size*i+3, 15);
        }

        // Ticks marks along the positive Y-axis
        // Positive Y-axis of graph is negative Y-axis of the canvas
        for(let i = 1; i < (_linesX - _xAxis); i++) {
            _ctx.beginPath();
            _ctx.lineWidth = 1;
            _ctx.strokeStyle = "#eeeeee";

            // Draw a tick mark 6px long (-3 to 3)
            _ctx.moveTo(-3, _size*i+0.5);
            _ctx.lineTo(3, _size*i+0.5);
            _ctx.stroke();

            // Text value at that point
            _ctx.font = '9px Arial';
            _ctx.textAlign = 'start';
            _ctx.fillText(-_yStart.number*i + _yStart.suffix, 8, _size*i+3);
        }

        // Ticks marks along the negative Y-axis
        // Negative Y-axis of graph is positive Y-axis of the canvas
        for(let i = 1; i < _xAxis; i++) {
            _ctx.beginPath();
            _ctx.lineWidth = 1;
            _ctx.strokeStyle = "#eeeeee";

            // Draw a tick mark 6px long (-3 to 3)
            _ctx.moveTo(-3, -_size*i+0.5);
            _ctx.lineTo(3, -_size*i+0.5);
            _ctx.stroke();

            // Text value at that point
            _ctx.font = '9px Arial';
            _ctx.textAlign = 'start';
            _ctx.fillText(_yStart.number*i + _yStart.suffix, 8, -_size*i+3);
        }
    }

    render() {
        // this.drawGrid();
        // this.drawLine(_points, _size, _size);
        // this.drawLine();
        // this.drawFill();
    }

    resize(height, width) {
        _height = height;
        _width = width;
        this.render();
    }   

    seed(type, json) {
        console.log("Seeding the graph.");
        switch(type) {
            case "historical":
                _points = [];
                let length = json.length;
                for (let i = 0; i < length; i++) {
                    _points.push(json[i].average);
                }
                break;
            case "real-time":
                break;
            case "projection":
                break;
            case "SIM":
                break;
            case "CAPM":
                break;
            default:
                break;
        }
    }

    tick() {
        if (_highlighting) {

        }

        // cursor.x = window.clientX;
        // cursor.y = window.clientY;
        // this.drawTooltip(cursor.x, cursor.y);

        // if (_hovering) {
            console.log("cursor is at: <"+cursor.x+","+cursor.y+">");
        //     _ctx.fillStyle = "#00CCFF";
        //     _demoA += 1;
        //     _demoB += 1;
        //     _ctx.fillRect(_demoA,
        //                     -_demoB,
        //                     100,
        //                     -50);
        // }
    }

    loop() {
        // this.render();
        _ctx.clearRect(0, 0, _width * 2, -_height * 2);
        // this.tick();
        // this.drawGrid();
        // this.drawLine(_points, _size, _size);
        this.drawTooltip(cursor.x, cursor.y);
        requestAnimationFrame(this.loop.bind(this));
    }

    init() {
        this.drawGrid();
        this.drawLine(_points, _size, _size);
        // this.drawFill();
        this.seed();
        this.loop();
    }

    set height(val) { _height = val; }
    get height() { return _height; }

    set width(val) { _width = val; }
    get width() { return _width; }

} export { Graph };

document.addEventListener('mousemove', (e) => {
    let ctxBnd = _canvas.getBoundingClientRect();
	cursor.x = (e.clientX - ctxBnd.left) - _size;
	cursor.y = (-_height + (e.clientY - ctxBnd.top) + _size);
});