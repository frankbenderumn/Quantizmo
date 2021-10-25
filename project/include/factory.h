#ifndef FACTORY_H_
#define FACTORY_H_

#include "entity/actor.h"
#include "entity/actee.h"
#include "entity/destination.h"
#include "util/console.h"
#include "util/json_helper.h"
#include "entity/charger.h"
#include "addon/battery_actor.h"

namespace csci3081 {
    
    class Factory {
      public:
        /* @brief creates the entity */
        Entity* Create(const picojson::object& data) {
            const std::string& type = data.find("type")->second.get<std::string>();
            Console::Print(data);
            if (type == "actor") {
                Actor* actor = new Actor(data);
                return actor;
            } else if (type == "battery_actor") {
                BatteryActor* actor = new BatteryActor(new Actor(data));
                return actor;
            } else if (type == "actee") {
                Actee* actee = new Actee(data);
                return actee;
            } else if (type == "destination") {
                Destination* destination = new Destination(data);
                return destination;
            } else if (type == "charger") {
                Charger* charger = new Charger(data);
                return charger;
            } else {
                Console::Log(FAILURE, "Invalid Entity type");
            }
        }
    };

}

#endif