#include "web_server_session.h"

namespace csci3081 {

void WebServerSession::receiveJSON(picojson::value& val) {
    picojson::object data = val.get<picojson::object>();
    std::string cmd = data["command"].get<std::string>();
    picojson::object returnValue;
    returnValue["id"] = data["id"];
    ReceiveCommand(cmd, data, returnValue);
    picojson::value retVal(returnValue);
    sendJSON(retVal);
}

void WebServerSession::ReceiveCommand(const std::string& cmd, picojson::object& data, picojson::object& returnValue) {
    if (cmd == "update") {
        std::chrono::time_point<std::chrono::system_clock> end = std::chrono::system_clock::now();
        std::chrono::duration<double> diff = end - start;
        double delta = diff.count() - time;
        time += delta;

        double simSpeed = data["simSpeed"].get<double>();
        delta *= simSpeed;

        if (delta > 0.1) {
            for (float f = 0.0; f < delta; f+=0.01) {
                Update(0.01, returnValue);
            }
        }
        else {
            Update(delta, returnValue);
        }
    }
    else if (cmd == "keyup") {
        KeyUp(data["key"].get<std::string>(), data["keyCode"].get<double>());
    }
    else if (cmd == "keydown") {
        KeyDown(data["key"].get<std::string>(), data["keyCode"].get<double>());
    }
    else {
        std::cout << "Unknown command: " << cmd << " - " << picojson::value(data).serialize() << std::endl;
    }
}

void WebServerSession::Update(double dt, picojson::object& returnValue) {
}

void WebServerSession::KeyUp(const std::string& key, int keyCode) {
}

void WebServerSession::KeyDown(const std::string& key, int keyCode) {
}

}
