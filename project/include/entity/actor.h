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
#include "util/handler.h"

namespace csci3081 {
    class Actor : public Entity {

      public: 
        /* @brief constructs the actor */
        Actor(const picojson::object& data) {
          if (data.find("speed") != data.end()) {
              this->speed = data.find("speed")->second.get<double>();
          }
          this->strategy = new Automatic();
          this->type = ACTOR;
          this->data = data;
        }

        /* @brief destructs the actor */
        ~Actor() { printf("destroying actor!\n"); }

        void SetStrategy(Strategy* strategy) { this->strategy = strategy; }

        void SetHandler(Handler* handler) { this->handler = handler; }

        void SetTarget(Actee* e) {
            this->target = e;
            SetStrategy(new Target(e));
        }

        void SetDestination(Destination* dest) { this->dest = dest; }

        /* @brief updates the actor */
        void Update(float dt) {
            if (target) {
                if (Distance(target->GetPosition(), this->GetPosition()) <= 1.f) {
                    this->Notify("alert", "customer picked up");
                    pickedUp = true;
                    // if (target->GetType() == ACTEE) {
                        this->SetStrategy(new Manual(handler));
                    // } else {
                    //     this->SetStrategy(new Automatic());
                    // }
                }

            }

            if (pickedUp) { target->SetPosition(this->position); }

            if (dest && target) {
                if (Distance(target->GetPosition(), dest->GetPosition()) <= dest->GetRadius()) {
                    Console::Log(SUCCESS, "Target delivered!\n");
                    this->Notify("alert", "target successfully delivered!\n");
                }
            }

            if (strategy) {
                strategy->Move(this->position, dt);
            } else {
                Console::Log(WARNING, "No strategy selected");
            }
        }

      private:
        /* @brief horizontal rotation */
        float theta = 0;

         /* @brief vertical rotation */
        float phi = 0;

        bool pickedUp = false;

        /* @brief turn speed */
        float turnSpeed = 1;

        /* @brief actor speed */
        float speed = 0.0000001;
        
        /* @brief actor movement strategy */
        Strategy* strategy; 

        /* @brief target to be rescued */
        Actee* target = nullptr;

        /* @brief target to drop off rescuee (actee) */
        Destination* dest = nullptr;

        Handler* handler;
    };
}

#endif