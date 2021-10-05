#ifndef TARGET_H_
#define TARGET_H_

#include "strategy.h"

namespace csci3081 {
    class Target : public Strategy {
      public:
        Target(const std::vector<float>& target) { this->type = TARGET; this->target = target; }
        ~Target() { printf("destroying entity!\n"); }
        std::vector<float> Move(const std::vector<float>& dir, float theta, float phi) {
            // TODO: computes actor direction so that it maintains a consistent circular path
            std::vector<float>& newDir = const_cast<std::vector<float>&>(dir);
            // may want to use vec3 class
            newDir[0] += 1.f;
        }
      private:
        std::vector<float> target;
    };
}

#endif