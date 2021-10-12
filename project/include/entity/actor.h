#ifndef ACTOR_H_
#define ACTOR_H_

#include "entity.h"
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
        Actor(const picojson::object& data);

        /* @brief destructs the actor */
        ~Actor();

        /* @brief sets strategy */
        void SetStrategy(Strategy* strategy);

        /* @brief sets target */
        void SetTarget(Actee* e);

        /* @brief sets destination */
        void SetDestination(Destination* dest);

        /* @brief helper function for actor box-type path */
        void AABB(double a, double b, double width, double height);

        /* @brief updates the actor */
        void Update(float dt);

        /* @brief interprets pressed key for actor */
        void Press(const std::string& key, int keyCode);

        /* @brief interprets released key for actor */
        void Release(const std::string& key, int keyCode);

        /* @brief helper for creating three dim direction vector from angles */
        void PolarToCartesian(double theta, double phi);
    
      private:
        /* @brief positive direction key press */
        std::vector<int> posMove;

        /* @brief negative direction key press */
        std::vector<int> negMove;

        /* @brief positive turn key press */
        std::vector<int> posTurn;

        /* @brief negative turn key press */
        std::vector<int> negTurn;

        /* @brief horizontal rotation */
        double theta = 0;

        /* @brief vertical rotation */
        double phi = 0;

        /* @brief turn speed */
        double turnSpeed = 1;

        /* @brief actor speed */
        double speed = 0.0000001;
        
        /* @brief actor movement strategy */
        Strategy* strategy; 

        /* @brief target to be rescued */
        Actee* target;

        /* @brief target to drop off rescuee (actee) */
        Destination* dest;
    };
}

#endif