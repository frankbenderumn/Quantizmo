#ifndef AUTOMATIC_H_
#define AUTOMATIC_H_

#include "strategy.h"

namespace csci3081 {
    class Automatic : public Strategy {
      public:
        Automatic() { this->type = AUTOMATIC; }
        ~Automatic() { printf("destroying automatic!\n"); }
        void Move(const std::vector<double>& dir, double theta, double phi) {
            std::vector<double>& newDir = const_cast<std::vector<double>&>(dir);
            newDir[0] = theta;
            newDir[1] = phi;
        }
    };
}

#endif