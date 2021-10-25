#ifndef STRATEGY_H_
#define STRATEGY_H_

#include "util/json_helper.h"
#include <vector>
#include <string>
#include "util/console.h"
#include "util/vec3.h"

namespace csci3081 {

    enum StrategyType {AUTOMATIC, TARGET, MANUAL, UNDEFINED_STRATEGY };

    class Strategy {
      public:
        Strategy() {}
        virtual ~Strategy() { printf("destroying strategy!\n"); }
        virtual void Move(const Vec3& pos, float dt) = 0;
        StrategyType GetType() { return type; }
      protected:
        StrategyType type = UNDEFINED_STRATEGY;
    };
}

#endif