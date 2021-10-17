#ifndef IENTITY_H_
#define IENTITY_H_

#include "util/json_helper.h"
#include <vector>
#include <string>
#include "util/console.h"
#include "util/vec3.h"

namespace csci3081 {

    enum EntityType { ACTOR, ACTEE, DESTINATION, UNDEFINED_ENTITY };

    class IEntity {
      public:
        IEntity() {}
        
        virtual ~IEntity() { printf("destroying ientity!\n"); }

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
            } else {
            result = "Undefined";
            }
            return result;
        }

      protected:
        EntityType type = UNDEFINED_ENTITY;
        Vec3 position;
        Vec3 direction;
        std::string name;
        double radius;
        int id;
    };
}

#endif