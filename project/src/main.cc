/**
Copyright (c) 2019 Dan Orban
*/

#include <iostream>
#include <map>
#include "web_sockets_server.h" 

using namespace csci3081;

class MouseMovedCommand : public WebServerCommand {
public:
	void execute(WebServerSession* session, picojson::object& command, WebServerSessionState* state, picojson::object& returnData) {
		std::cout << command["mouseX"] << " " << command["mouseY"]  << std::endl;
		returnData["size"] = picojson::value(command["mouseX"].get<double>());
		picojson::object color;
		color["r"] = picojson::value((double)255.0);
		color["g"] = picojson::value((double)255-command["mouseY"].get<double>()/4);
		color["b"] = picojson::value((double)command["mouseY"].get<double>()/4);
		color["a"] = picojson::value((double)255.0);
		returnData["color"] = picojson::value(color);
	}
};


int main(int argc, char**argv) {
    std::cout << "Usage: ./bin/ExampleServer 8081 web" << std::endl;

    if (argc > 1) {
        int port = std::atoi(argv[1]);
        std::string webDir = std::string(argv[2]);
        WebServerSessionState state;
        state.commands["mouseMoved"] = new MouseMovedCommand();
        WebServerWithState<WebServerSession, WebServerSessionState> server(state, port, webDir);
        while (true) {
            server.service();
        }
    }

    return 0;
}


