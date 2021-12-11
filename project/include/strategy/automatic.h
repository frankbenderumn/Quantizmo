#ifndef AUTOMATIC_H_
#define AUTOMATIC_H_

#include "strategy.h"

class Automatic : public Strategy {
    public:
    Automatic() { this->type = AUTOMATIC; }
    ~Automatic() { printf("destroying automatic!\n"); }
    void Move(Vec3& pos, float speed, float dt) {

        // set route index
        if (boxIndex == -1) { boxIndex++; }
        if (boxIndex == 4) {
            boxIndex = 0;
        }

        // integrate
        Vec3 poi = box.at(boxIndex);
        pos += ((poi - pos).Normalize()) * speed * dt;

        // collision detection
        if (Distance(pos, poi) <= 2.f) {
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

#endif