#ifndef TARGET_H_
#define TARGET_H_

#include "strategy.h"
#include "entity/entity.h"

namespace csci3081 {
    class Target : public Strategy {
      public:
        Target(Entity* e) { this->type = TARGET; this->target = e; }
        ~Target() { printf("destroying target!\n"); }
        void Move(const Vec3& pos, float dt) {
          if (target == nullptr) {
            Console::Log(WARNING, "target is not being set properly");
          }
          Vec3& newPos = const_cast<Vec3&>(pos);
          newPos += (target->GetPosition() - newPos).Normalize() * 2.f * dt;
        }
      private:
        Entity* target;
    };
}

#endif