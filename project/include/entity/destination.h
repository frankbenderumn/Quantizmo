#ifndef DESTINATION_H_
#define DESTINATION_H_

#include "entity.h"

namespace csci3081 {
    class Destination : public Entity {
      public:
        Destination(const picojson::object& data) : Entity(data) {
          this->type = DESTINATION;
        }
        ~Destination() { printf("destroying destination!\n"); }
    };
}

#endif