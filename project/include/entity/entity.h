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
        const std::string& GetName() { return this->name; }
        EntityType GetType() { return this->type; }
        const int GetId() { return this->id; }
        const int GetRadius() { return this->radius; }
        Vec3& GetPosition() { return this->position; }
        void SetPosition(Vec3 rhs) {
            this->position = rhs;
        }

        picojson::value Serialize() {
            picojson::object o;
            picojson::object pos;
            pos["x"] = picojson::value(this->position[0]);
            pos["y"] = picojson::value(this->position[1]);
            pos["z"] = picojson::value(this->position[2]);
            picojson::object dir;
            dir["x"] = picojson::value(this->direction[0]);
            dir["y"] = picojson::value(this->direction[1]);
            dir["z"] = picojson::value(this->direction[2]);
            o["type"] = picojson::value(EnumToString(this->type));
            o["position"] = picojson::value(pos);
            o["direction"] = picojson::value(dir);
            o["name"] = picojson::value(this->name);
            o["radius"] = picojson::value(this->radius);
            o["entityId"] = picojson::value((double)this->id);
            // std::cout << "serialized entity is "<< picojson::value(o).serialize() << std::endl;
            return picojson::value(o);
        }

        std::string EnumToString(EntityType type) {
            std::string result;
            if (type == ACTOR) {
              result = "Actor";
            } else if (type == ACTEE) {
              result = "Actee";
            } else if (type == DESTINATION) {
              result = "Destination";
            } else if (type == CHARGER) {
              result = "Charger";
            } else {
              result = "Undefined";
            }
            return result;
        }
        
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

        virtual void Notify(std::string event, std::string msg = "", float timestamp = 0.f) {
            // Console::Log(INFO, "NOTIFYING!");
            picojson::object o;
            o["test"] = picojson::value("this is a test");
            if (event == "analytics") {
                o["type"] = picojson::value("anayltics");
                o["time"] = picojson::value(0.f);
            } else if (event == "alert") {
                o["type"] = picojson::value("alert");
                o["message"] = picojson::value(msg);
            } else {
                Console::Log(FAILURE, "Invalid observer call type");
                exit(0);
            }
            picojson::value v(o);
            this->NotifyObservers(v, *this);
        }

        void NotifyObservers(const picojson::value& event, const IEntity& e) {
            for (auto o : this->observers) {
                o->OnEvent(event, e);
            }
        }        

      protected:
        std::vector<IObserver*> observers;

    };
}

#endif