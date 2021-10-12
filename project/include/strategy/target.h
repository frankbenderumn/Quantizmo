#ifndef TARGET_H_
#define TARGET_H_

#include "strategy.h"
#include "entity/actee.h"

namespace csci3081 {
    class Target : public Strategy {
      public:
        Target(const Actee& e) { this->type = TARGET; this->target = target; }
        ~Target() { printf("destroying target!\n"); }
        void Move(const std::vector<double>& dir, double theta, double phi) {
            std::vector<double>& newDir = const_cast<std::vector<double>&>(dir);
            newDir[0] = theta;
            newDir[1] = phi;
        }
      private:
        Actee* target;
    };
}

#endif