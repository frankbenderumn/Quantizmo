#ifndef WEB_APP_H_
#define WEB_APP_H_

#include <map>
#include "WebServer.h"
#include <chrono>
#include <vector>
#include "ientity.h"
#include "vec3.h"
#include "factory.h"
#include <string>
#include <stdexcept>
#include <cassert>

namespace csci3081 {

class WebApp : public JSONSession {
  public:
    WebApp() : start(std::chrono::system_clock::now()), time(0.0), factory(new Factory()) {}
    ~WebApp() { printf("terminating web app -- ensure no memory leaks\n"); }
    void receiveJSON(picojson::value& val);
    void ReceiveCommand(const std::string& cmd, picojson::object& data, picojson::object& returnValue);
    void Update(double dt, picojson::object& returnValue);
    void KeyUp(const std::string& key, int keyCode);
    void KeyDown(const std::string& key, int keyCode);

    //iteration 2 functions
    void AddEntity(Entity* e) { entities.push_back(e); Console::Log(SUCCESS, "entity successfully added!"); std::cout << entities.size() << std::endl;  }
    const std::vector<Entity*> GetEntities() const { return entities; }

    // functions for observer implementation

  private:
    std::chrono::time_point<std::chrono::system_clock> start;
    double time;
    std::vector<Entity*> entities;
    Factory* factory;
};


}

#endif
