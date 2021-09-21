#ifndef IENTITY_H_
#define IENTITY_H_

#include "json_helper.h"
#include <vector>
#include <string>
#include "console.h"

namespace csci3081 {
    class IEntity {
      public:
        IEntity() {}
        virtual ~IEntity() { printf("destroying entity!\n"); }
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
          // std::cout << "serialized entity is "<< picojson::value(o).serialize() << std::endl;
          return picojson::value(o);
        }

      protected:
        std::string type;
        std::vector<double> position;
        std::vector<double> direction;
        std::string name;
        double radius;
        int id;
    };
}

#endif