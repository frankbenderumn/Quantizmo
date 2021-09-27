#ifndef STRATEGY_H_
#define STRATEGY_H_

#include "json_helper.h"
#include <vector>
#include <string>
#include "console.h"

namespace csci3081 {
    class Strategy {
      public:
        Strategy() {}
        virtual ~Strategy() { printf("destroying entity!\n"); }
        virtual std::vector<float> Move(const std::vector<float>& dir, float theta, float phi) {
            // TODO: returns actor direction
        }
    };
}

#endif