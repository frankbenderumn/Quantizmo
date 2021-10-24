#ifndef MANUAL_H_
#define MANUAL_H_

#include "strategy.h"

namespace csci3081 {
    class Manual : public Strategy {
      public:
        Manual() { this->type = MANUAL; }
        ~Manual() { printf("destroying manual!\n"); }
        void Move(Vec3 dir, float theta, float phi) {
            Vec3& newDir = const_cast<Vec3&>(dir);
            dir[0] = theta;
            dir[1] = phi;
        }
    };
}

#endif