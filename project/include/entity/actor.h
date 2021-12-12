#ifndef ACTOR_H_
#define ACTOR_H_

#include "entity/entity.h"
#include "strategy/automatic.h"
#include "strategy/manual.h"
#include "strategy/target.h"
#include <stdexcept>
#include "actee.h"
#include "entity/destination.h"
#include "util/handler.h"
#include "interface/iactor.h"

class Actor : public IActor {

    public: 
    /* @brief constructs the actor */
    Actor(const picojson::object& data) : IActor(data) {
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

    void SetTarget(Entity* e) {
        this->target = e;
        if (e == nullptr) return;
        if (e->GetType() == ACTEE) {
            this->Notify("alert", "customer spotted");
        } else if (e->GetType() == CHARGER) {
            this->Notify("alert", "heading to charger");
        }
        SetStrategy(new Target(e));
    }

    /* @brief updates the actor */
    void Update(float dt) {

        // this->Notify("alert", "spam");

        if (target) {
            if (Distance(target->GetPosition(), this->GetPosition()) <= 1.f) {
                if (target->GetType() == ACTEE) {
                    if (pickedUp == false) {
                        this->Notify("alert", "customer picked up");
                        pickedUp = true;
                    }
                    this->SetStrategy(new Manual(handler));
                } else {
                    this->SetStrategy(new Automatic());
                }
            }
        }

        if (pickedUp) { target->SetPosition(this->position); }

        if (target) {  
            Actee* t = dynamic_cast<Actee*>(target);
            if (t) {
                if (Distance(t->GetPosition(), t->GetDestination()->GetPosition()) <= t->GetDestination()->GetRadius()) {
                    Console::Log(SUCCESS, "Target delivered!\n");
                    this->Notify("alert", "target successfully delivered!\n");
                    t->SetPosition(Vec3(0, 1000, 0));
                }
            }

        }

        if (strategy) {
            strategy->Move(this->position, this->speed, dt);
        } else {
            Console::Log(WARNING, "No strategy selected");
        }
    }

    void Notify(std::string event, std::string msg = "", float timestamp = 0.f) override {
        // Console::Log(INFO, "NOTIFYING!");
        picojson::object o;
        if (event == "analytics") {
            o["type"] = picojson::value("anayltics");
            o["data"] = picojson::value(timestamp);
        } else if (event == "alert") {
            o["type"] = picojson::value("alert");
            o["data"] = picojson::value(msg);
        } else if (event == "battery") {
            o["type"] = picojson::value("battery");
            o["data"] = picojson::value(timestamp);
        } else {
            Console::Log(FAILURE, "Invalid observer call type");
            exit(0);
        }
        picojson::value v(o);
        this->NotifyObservers(v);
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
    Entity* target = nullptr;

    // /* @brief target to drop off rescuee (actee) */
    // Destination* dest = nullptr;

    Handler* handler;
};

#endif