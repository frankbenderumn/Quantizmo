#ifndef WEB_APP_H_
#define WEB_APP_H_

#include <map>
#include "WebServer.h"
#include <chrono>

namespace csci3081 {

// class Observer;

class WebApp : public JSONSession {
public:
    WebApp() : start(std::chrono::system_clock::now()), time(0.0) {}
    ~WebApp() {}

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
