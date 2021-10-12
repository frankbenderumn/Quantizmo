#ifndef ENTITY_H_
#define ENTITY_H_

#include "util/json_helper.h"
#include <vector>
#include <string>
#include "util/console.h"
#include "interface/ientity.h"
#include "observer/observer.h"

// TODO: potentially switch member variable std::vector<float> to vec3, since we made it.

namespace csci3081 {

    class Entity : public IEntity {
      public:
        Entity(const picojson::object& data) {
            this->position = JsonHelper::CastVector(data.find("position")->second.get<picojson::array>());
            this->direction = JsonHelper::CastVector(data.find("direction")->second.get<picojson::array>());
            this->name = data.find("name")->second.get<std::string>(); 
            this->radius = data.find("radius")->second.get<double>();
            this->id = (int)data.find("entityId")->second.get<double>();
        }
        virtual ~Entity() { printf("destroying entity!\n"); }
        void virtual Update(float dt) {}
        const std::string& GetName() { return this->name; }
        EntityType GetType() { return this->type; }
        const int GetId() { return this->id; }
        const int GetRadius() { return this->radius; }
        
        bool Attach(Observer* observer) {
            for (auto o : observers) {
                if (o == observer) return false;
            }
            observers.push_back(observer);
            return true;
        }

        bool Detach(Observer* observer) {
            for (int i = 0; i < observers.size(); i++) {
                if (observers[i] == observer) {
                    observers.erase(observers.begin()+i);
                    return true;
                }
            }
            return false;
        }

        virtual void Notify(std::string event, float timestamp = 0.f) {
            Console::Log(INFO, "NOTIFYING!");
            picojson::object o;
            o["test"] = picojson::value("this is a test");
            if (event == "analytics") {
                o["type"] = picojson::value("anayltics");
                o["time"] = picojson::value(0.f);
            } else if (event == "alert") {
                o["type"] = picojson::value("alert");
            } else {
                Console::Log(FAILURE, "Invalid observer call type");
                exit(0);
            }
            picojson::value v(o);
            this->NotifyObservers(v, *this);
        }

        void NotifyObservers(const picojson::value& event, const Entity& e) {
            for (auto o : this->observers) {
                o->OnEvent(event, e);
            }
        }        

      protected:
        std::vector<Observer*> observers;

    };
}

#endif