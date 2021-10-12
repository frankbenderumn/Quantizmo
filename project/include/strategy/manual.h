#ifndef MANUAL_H_
#define MANUAL_H_

#include "strategy.h"

namespace csci3081 {
    class Manual : public Strategy {
      public:
        Manual() { this->type = MANUAL; }
        ~Manual() { printf("destroying manual!\n"); }
        void Move(const std::vector<double>& dir, double theta, double phi) {
            std::vector<double>& newDir = const_cast<std::vector<double>&>(dir);
            newDir[0] = theta;
            newDir[1] = phi;
        }
    };
}

#endif