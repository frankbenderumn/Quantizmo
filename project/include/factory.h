#ifndef FACTORY_H_
#define FACTORY_H_

#include "actor.h"
#include "actee.h"
#include "destination.h"
#include "console.h"
#include "json_helper.h"

namespace csci3081 {
    class Factory {
      public:
        Factory() {}
        Entity* Create(const picojson::object& data) {
            const std::string& type = data.find("type")->second.get<std::string>();
            Console::Print(data);
            if (type == "actor") {
                Console::Log(SUCCESS, "Actor type properly interpreted!");
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