#ifndef AUTOMATIC_H_
#define AUTOMATIC_H_

#include "strategy.h"

namespace csci3081 {
    class Automatic : public Strategy {
      public:
        Automatic() { this->type = AUTOMATIC; }
        ~Automatic() { printf("destroying automatic!\n"); }
        void Move(const Vec3& pos, float dt) {
            Vec3& newPos = const_cast<Vec3&>(pos);

            // set route index
            if (boxIndex == -1) { boxIndex++; }
            if (boxIndex == 4) {
                boxIndex = 0;
            }

            // integrate
            Vec3 poi = box.at(boxIndex);
            newPos += ((poi - newPos).Normalize()) * 3.f * dt;

            // collision detection
            if (Distance(newPos, poi) <= 2.f) {
                boxIndex++;
            }
        }

      private:
        std::vector<Vec3> box = {
            Vec3(-110, 8, -62),
            Vec3(-110, 8, 62),
            Vec3(110, 8, 62),
            Vec3(110, 8, -62)
        };

        int boxIndex = -1;
    };
}

#endif