#ifndef WEB_APP_H_
#define WEB_APP_H_

#include "picojson.h"
#include <map>
#include "WebServer.h"
#include <chrono>
#include <vector>
#include "util/vec3.h"
#include "interface/ientity.h"
#include "factory.h"
#include <string>
#include <stdexcept>
#include <cassert>
#include "util/console.h"
#include "entity/destination.h"
#include "entity/actee.h"
#include "entity/actor.h"
#include "observer/observer.h"

namespace csci3081 {

class WebApp : public JSONSession {
  public:

    /* @brief intializes our web server to communicate with front-end */
    WebApp() : start(std::chrono::system_clock::now()), time(0.0), factory(new Factory()) {}

    /* @brief called when the server is shutdown -- ENSURE NO MEMORY LEAKS */
    ~WebApp() { Console::Log(WARNING, "Webapp shutting down -- Ensure no memory leaks"); }

    /* @brief receives JSON from the front-end */
    void receiveJSON(picojson::value& val);

    /* @brief executes calls on parsed JSON, then is sent back to front-end upon completion */
    void ReceiveCommand(const std::string& cmd, picojson::object& data, picojson::object& returnValue);

    /* @brief updates all entities within application */
    void Update(double dt, picojson::object& returnValue);

    /* @brief interprets when a key on the keyboard is pressed */
    void KeyUp(const std::string& key, int keyCode);

    /* @brief interprets when a key on the keyboard is released */
    void KeyDown(const std::string& key, int keyCode);

    /* @brief adds an entity to the global vector */
    void AddEntity(Entity* e) { entities.push_back(e); Console::Log(SUCCESS, "entity successfully added!");  }

    /* @brief returns global entity vector */
    const std::vector<Entity*> GetEntities() const { return entities; }

    /* @brief sends notification through observer back to front-end */
    void SendNotification(const std::string& s) { Console::Log(INFO, s); }

    void Test() { Console::Log(SUCCESS, "Observer being sent!"); }

    /* @brief instantiates the destination in which actees will be deemed rescued */
    void Rescue(Destination* dest);

    /* @brief attaches observer to entity */
    void AddObserver(Entity* e, IObserver* observer);

    /* @brief detaches observer from entity */
    void RemoveObserver(Entity* e, IObserver* observer);

  private:
    /* @brief unix timestamp for when program is started */
    std::chrono::time_point<std::chrono::system_clock> start;

    /* @brief time elapsed since start is initialized */
    double time;

    /* @brief global vector to house all entities */
    std::vector<Entity*> entities;

    /* @brief a factory pointer allowing to create all entities in another file */
    Factory* factory;

    /* @brief a vector of all actees needing to be rescued (allows for multiple rescues) */
    std::vector<Actee*> actees;

    /* @brief only one actor will be used, therefore a member var is used for efficiency */
    Actor* actor;
};


}

#endif
