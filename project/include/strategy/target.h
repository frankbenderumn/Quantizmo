#ifndef TARGET_H_
#define TARGET_H_

#include "strategy.h"
#include "entity/actee.h"

namespace csci3081 {
    class Target : public Strategy {
      public:
        Target(const Actee& e) { this->type = TARGET; this->target = target; }
        ~Target() { printf("destroying target!\n"); }
        void Move(Vec3 dir, float theta, float phi) {
            dir[0] = theta;
            dir[1] = phi;
        }
      private:
        Actee* target;
    };
}

#endif