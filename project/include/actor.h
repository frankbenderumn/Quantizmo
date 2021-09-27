#ifndef ACTOR_H_
#define ACTOR_H_

#include "entity.h"
// #include "strategy.h"
#include "console.h"

namespace csci3081 {
    class Actor : public Entity {
      public:
        Actor(const picojson::object& data) : Entity(data) {
            if (data.find("speed") != data.end()) {
                this->speed = data.find("speed")->second.get<double>();
            }
            // this->strategy = new Automatic();
        }
        ~Actor() { printf("destroying actor!\n"); }
        // SetStrategy(Strategy* strategy) {
        //     this->strategy = strategy;
        // }
        // void Update(float dt) {
        //     if (stategy != nullptr) {
        //         // may need circle helper function or class to calculate next point on circumference given automated route radius
        //         this->strategy->Move(this->direction, 0.1, 0.1);
        //     } else {
        //         Console::Log(FAILURE, "No strategy selected");
        //     }
        // }
      private:
        double speed = 1;
        // Strategy* strategy; 
    };
}

#endif