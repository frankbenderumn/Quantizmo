#ifndef STRATEGY_H_
#define STRATEGY_H_

#include "util/json_helper.h"
#include <vector>
#include <string>
#include "util/console.h"

namespace csci3081 {

    enum StrategyType {AUTOMATIC, TARGET, MANUAL, UNDEFINED_STRATEGY };

    class Strategy {
      public:
        Strategy() {}
        virtual ~Strategy() { printf("destroying strategy!\n"); }
        virtual void Move(const std::vector<double>& dir, double theta, double phi) {
            std::vector<double>& newDir = const_cast<std::vector<double>&>(dir);
            newDir[0] = theta;
            newDir[1] = phi;
            Console::Log(WARNING, "This strategy should not be running!");
        }
        StrategyType GetType() { return type; }
      protected:
        StrategyType type = UNDEFINED_STRATEGY;
    };
}

#endif