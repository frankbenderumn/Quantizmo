class WSApi {
    constructor() {
        // var self = this;
        this._socket = new WebSocket("ws://" + location.hostname+(location.port ? ':'+location.port: ''), "web_server");
        this._callbacks = {};
        this._requestId = 0;
        this._id = null;

        this._onmessage = null;

        this._socket.onmessage = function (msg) {
            if (!this._connected) {
                this._id = +msg.data;
                this._connected = true;
            }

            var data = JSON.parse(msg.data);
            if ("id" in data && data.id in this._callbacks) {
                //console.log(data);
                this._callbacks[data.id](data);
            }

            // interprets data from backend sent through observer
            if ("notification" in data) {
            $.fn.display(data);
            }

            if (self.onmessage) {
                self.onmessage(msg, data);
            }
        }

        this.connect = new Promise(function(resolve, reject) {
            this._socket.onopen = function() {
                resolve(this._socket);
            };
            this._socket.onerror = function(err) {
                console.log(err);
                reject(err);
            }
            this._socket.onclose = function (event) {
                console.log(event);
            }
        });

        this._connected = false;

        this._connect.then(function() {
            //self.connected = true;
        });
    }

    sendPostCommand(cmd, data, calcVal) {
        console.log(this.id);
        return this.sendCommand(cmd, data, calcVal, true);
    }
    
    sendCommand(cmd, data, calcVal, isPost = false) {
        // let self = this;
    
        if (this._connected) {
            data.command = cmd;
            data.id = this.requestId;
    
            if (isPost) {
            $.ajax({
                type: "POST",
                url: "/post/"+this._id,
                //data: JSON.stringify({command: "mouseClicked", output: output}),
                data: JSON.stringify(data),
                success: function(res) { console.log(res); },
                //error: function(res) { console.log(res); },
                dataType: "json"
                });
            }
            else {
                this.socket.send(JSON.stringify(data));
            }
    
            let promise = new Promise(function(resolve, reject) {
                this._callbacks[this._requestId] = function(data) {
                    if (calcVal) {
                        resolve(calcVal(data)); 
                    }
                    else {
                        resolve(data);
                    }
                    delete this._callbacks[data.id];
                }
            });
            this.requestId++;
            return promise;
        }
        else {
            return new Promise(function(resolve, reject) {
                this._connect.then(function() {
                    this._connected = true;
                        this.sendCommand(cmd, data, calcVal).then(
                            function(data) {
                                resolve(data);
                            });
                    }
                );
            });
        }
    
    };

} export { WSApi }