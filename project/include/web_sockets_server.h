#ifndef WEB_SOCKETS_SERVER_H_
#define WEB_SOCKETS_SERVER_H_

#include <map>
#include "WebServer.h"
#include <chrono>

namespace csci3081 {

class WebServerSession : public JSONSession {
public:
    WebServerSession() : start(std::chrono::system_clock::now()), time(0.0) {
    }
    ~WebServerSession() {
    }
    void receiveJSON(picojson::value& val) {
        picojson::object data = val.get<picojson::object>();
        std::string cmd = data["command"].get<std::string>();
        picojson::object ret;
        ret["id"] = data["id"];
        receiveCommand(cmd, data, ret);
        picojson::value retVal(ret);
        sendJSON(retVal);
    }

    void receiveCommand(const std::string& cmd, picojson::object& data, picojson::object& ret) {
        if (cmd == "update") {
            std::chrono::time_point<std::chrono::system_clock> end = std::chrono::system_clock::now();
	        std::chrono::duration<double> diff = end - start;
            double delta = diff.count() - time;
            time += delta;

            if (delta > 0.1) {
				for (float f = 0.0; f < delta; f+=0.01) {
					Update(0.01);
				}
			}
			else {
				Update(delta);
			}
        }
        else {
            std::cout << "Unknown command: " << cmd << " - " << picojson::value(data).serialize() << std::endl;
        }
    }

    void Update(double dt) {
    }

private:
    std::chrono::time_point<std::chrono::system_clock> start;
    double time;
};


}

#endif
