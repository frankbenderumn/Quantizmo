#ifndef ACTOR_H_
#define ACTOR_H_

#include "entity/entity.h"
#include "strategy/automatic.h"
#include "strategy/manual.h"
#include "strategy/target.h"
#include "util/console.h"
#include <stdexcept>
#include "actee.h"
#include "entity/destination.h"

namespace csci3081 {
    class Actor : public Entity {

      public: 
        /* @brief constructs the actor */
        Actor(const picojson::object& data) : Entity(data) {
          if (data.find("speed") != data.end()) {
              this->speed = data.find("speed")->second.get<double>();
          }
          this->strategy = new Automatic();
          this->type = ACTOR;
        }

        /* @brief destructs the actor */
        ~Actor() { printf("destroying actor!\n"); }

        void SetStrategy(Strategy* strategy) {
            this->strategy = strategy;
        }

        void SetTarget(Actee* e) {
            this->target = e;
            SetStrategy(new Target(*e));
        }

        void SetDestination(Destination* dest) {
            this->dest = dest;
        }

        /* @brief updates the actor */
        void Update(float dt) {
            if (strategy) {
                this->strategy->Move(this->direction, theta, phi);
            } else {
                Console::Log(WARNING, "No strategy selected");
            }

            if (target) {
                if (Distance(target->GetPosition(), this->GetPosition()) <= this->GetRadius()) {
                    this->Notify("alert", "customer picked up");
                    pickedUp = true;
                    this->SetStrategy(new Manual());
                }

            }

            if (pickedUp) {
                target->SetPosition(this->position);
            }

            if (strategy->GetType() == MANUAL) {
                // Console::Log(WARNING, "MANUAL STRATEGY EXECUTING!");
                theta += (posTurn[0] + negTurn[0]) * 0.5f * dt;
                phi += (posTurn[1] + negTurn[1]) * 0.5f * dt;
                // strategy->Move(this->direction, theta, phi);
                position[0] += (posMove[0] + negMove[0]) * 3.f * dt;
                position[1] += (posMove[1] + negMove[1]) * 3.f * dt;
                position[2] += (posMove[2] + negMove[2]) * 3.f * dt;

                // if (dest) {
                    if (Distance(target->GetPosition(), dest->GetPosition()) <= dest->GetRadius()) {
                        Console::Log(SUCCESS, "Target delivered!\n");
                        this->Notify("alert", "target successfully delivered!\n");
                    }
                // }

            } else if (strategy->GetType() == AUTOMATIC) {
                // strategy->Move(this->direction, theta, phi);
                Console::Log(WARNING, "AUTOMATIC STRATEGY EXECUTING!");

                // collision points :
                // [-110, 0, -62]
                // [-110, 0, 62]
                // [110, 0, 62]
                // [110, 0, -62]

                // set route index
                if (boxIndex == -1) { boxIndex++; }
                if (boxIndex == 4) {
                    boxIndex = 0;
                }

                // integrate
                Vec3 poi = box.at(boxIndex);
                this->position = this->position + ((poi - this->position).Normalize()) * 3.f * dt;

                // collision detection
                if (Distance(position, poi) <= this->radius) {
                    boxIndex++;
                }

            } else if (strategy->GetType() == TARGET) {
                Console::Log(WARNING, "TARGET STRATEGY EXECUTING!");
                // position[2] += direction[2] * speed * dt;
                position = position + (target->GetPosition() - this->position).Normalize() * 2.f * dt;
            }
        }

        /* @brief interprets pressed key for actor */
        void Press(const std::string& key, int keyCode) {
            if (strategy->GetType() != MANUAL) return;
            if (keyCode == 65) { // KeyA
                negMove[0] = -1;
            } else if (keyCode == 83) { // KeyS
                posMove[2] = 1;
            } else if (keyCode == 68) { // KeyD
                posMove[0] = 1;
            } else if (keyCode == 87) { // KeyW
                negMove[2] = -1;
            } else if (keyCode == 37) { // ArrowLeft
                negTurn[0] = -1;
            } else if (keyCode == 87) { // ArrowRight
                posTurn[0] = 1;
            } else if (keyCode == 38) { // ArrowUp
                posMove[1] = 1;
            } else if (keyCode == 40) { // ArrowDown
                negMove[1] = -1;
            } else if (keyCode == 01) { // dummy var for left mouse click
                // posMove.z = 1;
            } else if (keyCode == 02) { // dummy var for right mouse click
                // posMove.z = 1;
            } else if (keyCode == 03) { // dummy var for middle mouse click
                // posMove.z = 1;
            }
        }

        /* @brief interprets released key for actor */
        void Release(const std::string& key, int keyCode) {
          if (strategy->GetType() != MANUAL) return;
              if (keyCode == 65) { // KeyA
                  negMove[0] = 0;
              } else if (keyCode == 83) { // KeyS
                  posMove[2] = 0;
              } else if (keyCode == 68) { // KeyD
                  posMove[0] = 0;
              } else if (keyCode == 87) { // KeyW
                  negMove[2] = 0;
              } else if (keyCode == 37) { // ArrowLeft
                  negTurn[0] = 0;
              } else if (keyCode == 87) { // ArrowRight
                  posTurn[0] = 0;
              } else if (keyCode == 38) { // ArrowUp
                  posMove[1] = 0;
              } else if (keyCode == 40) { // ArrowDown
                  negMove[1] = 0;
              } else if (keyCode == 01) { // dummy var for left mouse click
                  // posMove.z = 1;
              } else if (keyCode == 02) { // dummy var for right mouse click
                  // posMove.z = 1;
              } else if (keyCode == 03) { // dummy var for middle mouse click
                  // posMove.z = 1;
              }
        }
    
      private:
        /* @brief positive direction key press */
        std::vector<int> posMove = {0, 0, 0};

        /* @brief negative direction key press */
        std::vector<int> negMove = {0, 0, 0};

        /* @brief positive turn key press */
        std::vector<int> posTurn = {0, 0};

        /* @brief negative turn key press */
        std::vector<int> negTurn = {0, 0};

        /* @brief horizontal rotation */
        float theta = 0;

        /* @brief vertical rotation */
        float phi = 0;

        bool pickedUp = false;

        /* @brief turn speed */
        float turnSpeed = 1;

        /* @brief actor speed */
        double speed = 0.0000001;
        
        /* @brief actor movement strategy */
        Strategy* strategy; 

        /* @brief target to be rescued */
        Actee* target;

        /* @brief target to drop off rescuee (actee) */
        Destination* dest;

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