#ifndef STRATEGY_H_
#define STRATEGY_H_

#include "util/json_helper.h"
#include <vector>
#include <string>
#include "util/console.h"

namespace csci3081 {

    enum StrategyType {AUTOMATIC, TARGET, MANUAL, UNDEFINED};

    class Strategy {
      public:
        Strategy() {}
        virtual ~Strategy() { printf("destroying entity!\n"); }
        virtual void Move(const std::vector<double>& dir, double theta, double phi) {
            // TODO: returns actor direction
            std::vector<double>& newDir = const_cast<std::vector<double>&>(dir);
            std::vector<double> temp = {0.f, 0.f, 0.f};
            newDir[0] = 2.f;
        }
        StrategyType GetType() { return type; }
      protected:
        StrategyType type = UNDEFINED;
    };
}

#endif