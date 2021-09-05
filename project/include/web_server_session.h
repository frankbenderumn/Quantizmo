#ifndef WEB_SOCKETS_SERVER_H_
#define WEB_SOCKETS_SERVER_H_

#include <map>
#include "WebServer.h"
#include <chrono>

namespace csci3081 {

class WebServerSession : public JSONSession {
public:
    WebServerSession() : start(std::chrono::system_clock::now()), time(0.0) {}
    ~WebServerSession() {}
    
    void receiveJSON(picojson::value& val);
    void ReceiveCommand(const std::string& cmd, picojson::object& data, picojson::object& returnValue);
    void Update(double dt, picojson::object& returnValue);
    void KeyUp(const std::string& key, int keyCode);
    void KeyDown(const std::string& key, int keyCode);

private:
    std::chrono::time_point<std::chrono::system_clock> start;
    double time;
};


}

#endif
