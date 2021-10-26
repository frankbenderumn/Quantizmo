#ifndef ENTITY_H_
#define ENTITY_H_

#include "util/json_helper.h"
#include <vector>
#include <string>
#include "util/console.h"
#include "util/vec3.h"
#include "interface/ientity.h"
#include "interface/iobserver.h"

namespace csci3081 {

    class Entity : public IEntity {
      public:
        Entity() {}
        Entity(const picojson::object& data) {
            this->position = Vec3(JsonHelper::CastVector(data.find("position")->second.get<picojson::array>()));
            this->direction = Vec3(JsonHelper::CastVector(data.find("direction")->second.get<picojson::array>()));
            this->name = data.find("name")->second.get<std::string>(); 
            this->radius = data.find("radius")->second.get<double>();
            this->id = (int)data.find("entityId")->second.get<double>();
        }
        virtual ~Entity() { printf("destroying entity!\n"); }
        virtual void Update(float dt) {};
        
        bool Attach(IObserver* observer) {
            for (auto o : observers) {
                if (o == observer) return false;
            }
            observers.push_back(observer);
            return true;
        }

        bool Detach(IObserver* observer) {
            for (int i = 0; i < observers.size(); i++) {
                if (observers[i] == observer) {
                    observers.erase(observers.begin()+i);
                    return true;
                }
            }
            return false;
        }

        virtual void Notify(std::string event, std::string msg = "", float timestamp = 0.f) {}

        void NotifyObservers(const picojson::value& event) {
            for (auto o : this->observers) {
                o->OnEvent(event, this);
            }
        }        

      protected:
        std::vector<IObserver*> observers;

    };
}

#endif