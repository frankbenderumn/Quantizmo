#ifndef FACTORY_H_
#define FACTORY_H_

#include "entity/actor.h"
#include "entity/actee.h"
#include "entity/destination.h"
#include "util/console.h"
#include "util/json_helper.h"

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
            } else if (type == "actee") {
                Actee* actee = new Actee(data);
                return actee;
            } else if (type == "destination") {
                Destination* destination = new Destination(data);
                return destination;
            } else {
                Console::Log(FAILURE, "Invalid Entity type");
            }
        }
    };

}

#endif