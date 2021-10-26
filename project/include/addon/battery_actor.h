#ifndef BATTERY_ACTOR_H_
#define BATTERY_ACTOR_H_

#include "battery.h"
#include "interface/iactor.h"
// #include "entity/charger.h"
#include "decorator.h"
#include "entity/entity.h"
#include "entity/charger.h"

namespace csci3081 {

    class BatteryActor : public Decorator {
      public:
        // BatteryActor(IActor* actor) : Decorator(actor) {
        //     battery = new Battery;
        // }
        BatteryActor(IActor* actor, Battery* battery) : Decorator(actor) {
            this->battery = battery;
        }
        ~BatteryActor() { printf("destroying battery actor!\n"); delete battery; }

        void SetChargers(std::vector<Charger*> chargers) {
            chargers = chargers;
        }

        void Update(float dt) override {
            printf("moment of truth\n");
            if (battery == nullptr) {
                Console::Log(FAILURE, "Battery does not exist!");
            }
            battery->Deplete(dt);
            if (battery->IsLow()) {
                if (chargers.size() > 0) {
                    actor->SetTarget(chargers.at(0));
                } else {
                    Console::Log(WARNING, "Low battery with charger!");
                }
                
                if (Distance(actor->GetPosition(), chargers.at(0)->GetPosition()) <= chargers.at(0)->GetRadius()) {
                    battery->Charge(dt);
                }
            }
            if (battery->IsDead()) {
                Console::Log(FAILURE, "Game over!");
            }
            actor->Update(dt);
        }

        Battery* GetBattery() { return battery; }

      private:
        Battery* battery;
        std::vector<Charger*> chargers;
    };
}

#endif