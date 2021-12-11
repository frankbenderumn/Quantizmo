#ifndef BATTERY_ACTOR_H_
#define BATTERY_ACTOR_H_

#include "battery.h"
#include "interface/iactor.h"
// #include "entity/charger.h"
#include "decorator.h"
#include "entity/entity.h"
#include "entity/charger.h"
#include "strategy/automatic.h"

class BatteryActor : public Decorator {
  public:
    BatteryActor(IActor* actor, Battery* battery) : Decorator(actor) {
        this->battery = battery;
    }
    ~BatteryActor() { printf("destroying battery actor!\n"); delete battery; }

    void SetChargers(std::vector<Charger*> chargers) {
        this->chargers = chargers;
    }

    void Update(float dt) override {
        if (battery == nullptr) {
            Console::Log(FAILURE, "Battery does not exist!");
        }
        battery->Deplete(dt);
        if (idle || battery->IsLow()) {
            if (chargers.size() > 0) {
                if (battery->IsLow() && !busy) { actor->SetTarget(chargers.at(0)); busy = true; }
                if (Distance(actor->GetPosition(), chargers.at(0)->GetPosition()) <= chargers.at(0)->GetRadius()) {
                        battery->Charge(dt);
                        idle = true;     
                        busy = false;                       
                }
            }
        }

        if (!idle) {
            actor->Update(dt);
        }

        if (battery->IsFull() && idle) {
            idle = false;
            actor->SetTarget(nullptr);
            actor->SetStrategy(new Automatic());
        }

        if (battery->IsDead()) {
            Console::Log(FAILURE, "Game over!");
        }

        actor->Notify("battery", "", battery->GetLife());
        // battery->Print();
    }

    Battery* GetBattery() { return battery; }

  private:
    Battery* battery;
    std::vector<Charger*> chargers;
    bool idle;
    bool busy = false;
};

#endif