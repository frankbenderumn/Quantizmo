#ifndef IACTOR_H_
#define IACTOR_H_

#include "entity/entity.h"
#include "strategy/automatic.h"
#include "strategy/manual.h"
#include "strategy/target.h"
#include "util/console.h"
#include <stdexcept>
#include "entity/actee.h"
#include "entity/destination.h"
#include "util/handler.h"

class IActor : public Entity {

  public: 

    IActor(const picojson::object& data) : Entity(data) {}
    /* @brief destructs the actor */
    virtual ~IActor() { printf("destroying actor!\n"); }

    virtual void SetStrategy(Strategy* strategy) = 0;

    virtual void SetHandler(Handler* handler) = 0;

    virtual void SetTarget(Entity* e) = 0;

    // virtual void SetDestination(Destination* dest) = 0;

    virtual void Update(float dt) = 0;

  protected:
    /* @brief horizontal rotation */
    float theta = 0.f;

      /* @brief vertical rotation */
    float phi = 0.f;

    bool pickedUp = false;

    /* @brief turn speed */
    float turnSpeed = 1;

    /* @brief actor speed */
    float speed = 0.1f;
    
    /* @brief actor movement strategy */
    Strategy* strategy; 

    /* @brief target to be rescued */
    Entity* target = nullptr;

    /* @brief target to drop off rescuee (actee) */
    // Destination* dest;

    Handler* handler;
};

#endif