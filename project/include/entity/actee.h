#ifndef ACTEE_H_
#define ACTEE_H_

#include "entity.h"

namespace csci3081 {
    class Actee : public Entity {
      public:
        Actee(const picojson::object& data) : Entity(data) {
          this->type = ACTEE;
        }
        ~Actee() { printf("destroying actee!\n"); }
        void Update(float dt) {}
    };
}

#endif