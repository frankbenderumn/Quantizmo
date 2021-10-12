#include "factory.h"

namespace csci3081 {
    
    Entity* Factory::Create(const picojson::object& data) {
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

}