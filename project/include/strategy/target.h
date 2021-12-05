#ifndef TARGET_H_
#define TARGET_H_

#include "strategy.h"
#include "entity/entity.h"

class Target : public Strategy {
  public:
    Target(Entity* e) { this->type = TARGET; this->target = e; }
    ~Target() { printf("destroying target!\n"); }
    void Move(Vec3& pos, float speed, float dt) {
      if (target == nullptr) {
        Console::Log(WARNING, "target is not being set properly");
      }
      pos += (target->GetPosition() - pos).Normalize() * speed * dt;
    }
  private:
    Entity* target;
};

#endif