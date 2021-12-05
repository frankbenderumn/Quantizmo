#ifndef DESTINATION_H_
#define DESTINATION_H_

#include "entity.h"

class Destination : public Entity {
  public:
    Destination(const picojson::object& data) : Entity(data) {
      this->type = DESTINATION;
    }
    void Update(float dt) {}
    ~Destination() { printf("destroying destination!\n"); }
};

#endif