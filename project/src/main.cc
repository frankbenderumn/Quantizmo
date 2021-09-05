/**
Copyright (c) 2019 Dan Orban
*/

#include <iostream>
#include <map>
#include "web_sockets_server.h" 

using namespace csci3081;

int main(int argc, char**argv) {
    std::cout << "Usage: ./bin/ExampleServer 8081 web" << std::endl;

    if (argc > 1) {
        int port = std::atoi(argv[1]);
        std::string webDir = std::string(argv[2]);
        WebServer<WebServerSession> server(port, webDir);
        while (true) {
            server.service();
        }
    }

    return 0;
}


