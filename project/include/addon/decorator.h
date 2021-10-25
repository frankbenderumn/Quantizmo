#ifndef DECORATOR_H_
#define DECORATOR_H_

#include "strategy/strategy.h"
#include "util/handler.h"
#include "entity/actee.h"
#include "entity/destination.h"
#include "interface/iactor.h"

namespace csci3081 {
    class Decorator {
      public:
        Decorator(IActor* a) : actor(a) {}
        ~Decorator() {}
        void SetStrategy(Strategy* strategy) { actor->SetStrategy(strategy); }
        void SetHandler(Handler* handler) { actor->SetHandler(handler); }
        void SetTarget(Actee* e) { actor->SetTarget(e); }
        // void SetDestination(Destination* dest) { actor->SetDestination(dest); }
        void Update(float dt) { actor->Update(dt); }
        // int GetId() { return actor->GetId(); }
        IActor* GetActor() { return actor; }

      protected:
        IActor* actor;
    };
}

#endif
        
