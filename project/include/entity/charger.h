#ifndef CHARGER_H_
#define CHARGER_H_

#include "entity.h"

namespace csci3081 {

    class Charger : public Entity {
      public:
        Charger(const picojson::object& data) : Entity(data) {
          this->type = CHARGER;
        }
        void Update(float dt) {}
        ~Charger() { printf("destroying charger!\n"); }

      private:
    };
}

#endif