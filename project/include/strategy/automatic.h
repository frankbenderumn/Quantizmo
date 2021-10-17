#ifndef AUTOMATIC_H_
#define AUTOMATIC_H_

#include "strategy.h"

namespace csci3081 {
    class Automatic : public Strategy {
      public:
        Automatic() { this->type = AUTOMATIC; }
        ~Automatic() { printf("destroying automatic!\n"); }
        void Move(Vec3 dir, float theta, float phi) {
            dir[0] = theta;
            dir[1] = phi;
        }
    };
}

#endif