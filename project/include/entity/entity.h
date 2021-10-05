#ifndef ENTITY_H_
#define ENTITY_H_

#include "util/json_helper.h"
#include <vector>
#include <string>
#include "util/console.h"
#include "interface/ientity.h"

// TODO: potentially switch member variable std::vector<float> to vec3, since we made it.

namespace csci3081 {
    class Entity : public IEntity {
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
        void Update(float dt) { 
          position[0] += 1 * dt;
        }
        const std::string& GetName() { return this->name; }
        const std::string& GetType() { return this->type; }
        const int GetId() { return this->id; }
    };
}

#endif