#ifndef MANUAL_H_
#define MANUAL_H_

#include "strategy.h"
#include "util/handler.h"
#include <vector>

namespace csci3081 {
    class Manual : public Strategy {
      public:
        Manual(Handler* h) { this->type = MANUAL; handler = h; }
        ~Manual() { printf("destroying manual!\n"); }
        void Move(Vec3& pos, float speed, float dt) {
                // Console::Log(INFO, "MANUAL STRATEGY RUNNING!");

                // theta += (posTurn[0] + negTurn[0]) * 0.5f * dt;
                // phi += (posTurn[1] + negTurn[1]) * 0.5f * dt;
                pos[0] += (handler->GetPosMove()[0] + handler->GetNegMove()[0]) * speed * dt;
                pos[1] += (handler->GetPosMove()[1] + handler->GetNegMove()[1]) * speed * dt;
                pos[2] += (handler->GetPosMove()[2] + handler->GetNegMove()[2]) * speed * dt;
        }

      private:
        Handler* handler;
    };
}

#endif