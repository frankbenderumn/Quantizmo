#ifndef WEB_APP_H_
#define WEB_APP_H_

#include "picojson.h"
#include <map>
#include "WebServer.h"
#include <chrono>
#include <vector>
#include "interface/ientity.h"
#include "util/vec3.h"
#include "factory.h"
#include <string>
#include <stdexcept>
#include <cassert>
#include "util/console.h"
#include "observer/observer.h"

namespace csci3081 {

// class Observer;

class WebApp : public JSONSession {
  public:
    WebApp() : start(std::chrono::system_clock::now()), time(0.0), factory(new Factory()) {}
    ~WebApp() { Console::Log(WARNING, "Webapp shutting down -- Ensure no memory leaks"); }
    void receiveJSON(picojson::value& val);
    void ReceiveCommand(const std::string& cmd, picojson::object& data, picojson::object& returnValue);
    void Update(double dt, picojson::object& returnValue);
    void KeyUp(const std::string& key, int keyCode);
    void KeyDown(const std::string& key, int keyCode);

    //iteration 2 functions
    void AddEntity(Entity* e) { entities.push_back(e); Console::Log(SUCCESS, "entity successfully added!"); std::cout << entities.size() << std::endl;  }
    const std::vector<Entity*> GetEntities() const { return entities; }

    // functions for observer implementation
    void NotifyObservers(picojson::value& notification, Entity* entity);
    void RemoveObserver(Observer* observer);
    void AddObserver(Observer* observer);
    void SendNotification(const std::string& s) {
      Console::Log(INFO, s);
    }
    void Test() {
      printf("Ass!\n");
    }


  private:
    std::chrono::time_point<std::chrono::system_clock> start;
    double time;
    std::vector<Entity*> entities;
    Factory* factory;

    // added this for efficiency as there will likely only ever be one actor
    Actor* actor;
};


}

#endif
