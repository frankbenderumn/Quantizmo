#ifndef ENTITY_H_
#define ENTITY_H_

#include "json_helper.h"
#include <vector>
#include <string>
#include "console.h"

namespace csci3081 {
    class Entity {
      public:
        Entity(const picojson::object& data) {
            this->type = data.find("type")->second.get<std::string>(); 
            this->position = JsonHelper::CastVector(data.find("position")->second.get<picojson::array>());
            this->direction = JsonHelper::CastVector(data.find("direction")->second.get<picojson::array>());
            this->name = data.find("name")->second.get<std::string>(); 
            this->radius = data.find("radius")->second.get<double>();
            this->id = (int)data.find("entityId")->second.get<double>();
        }
        virtual ~Entity() { printf("destroying entity!\n"); }
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
          o["type"] = picojson::value(this->type);
          o["position"] = picojson::value(pos);
          o["direction"] = picojson::value(dir);
          o["name"] = picojson::value(this->name);
          o["radius"] = picojson::value(this->radius);
          o["entityId"] = picojson::value((double)this->id);
          std::cout << "serialized entity is "<< picojson::value(o).serialize() << std::endl;
          return picojson::value(o);
        }
        void Update(float dt) { 
          position[0] = position[0] + 1 * dt;
        }
        const std::string& GetName() { return name; }
        const std::string& GetType() { return type; }
        const int GetId() { return id; }

      private:
        std::string type;
        std::vector<double> position;
        std::vector<double> direction;
        std::string name;
        double radius;
        int id;
    };
}

#endif