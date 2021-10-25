#ifndef BATTERY_ACTOR_H_
#define BATTERY_ACTOR_H_

#include "battery.h"
#include "interface/iactor.h"
// #include "entity/charger.h"
#include "decorator.h"
#include "entity/entity.h"

namespace csci3081 {

    class BatteryActor : public Decorator {
      public:
        BatteryActor(IActor* actor) : Decorator(actor) {
            battery = new Battery;
        }
        ~BatteryActor() { printf("destroying battery actor!\n"); delete battery; }
        bool Charged() {
            return battery->IsFull();
        }
        void SetChargers(std::vector<Charger*> chargers) {
            chargers = chargers;
        }
        void Charge(float dt) {
            battery->Charge(dt);
        }
        void Update(float dt) {
            printf("moment of truth\n");
            battery->Deplete(dt);
            if (battery->IsLow()) {
                actor->SetTarget(chargers.at(0));
            }
            if (Distance(actor->GetPosition(), chargers.at(0)->GetPosition()) <= chargers.at(0)->GetRadius()) {
                Charge(dt);
            }
            actor->Update(dt);
        }

      private:
        Battery* battery;
        std::vector<Charger*> chargers;
    };
}

#endif