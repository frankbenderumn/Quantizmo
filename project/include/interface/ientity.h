#ifndef IENTITY_H_
#define IENTITY_H_

#include "util/json_helper.h"
#include <vector>
#include <string>
#include "util/console.h"

namespace csci3081 {

    enum EntityType { ACTOR, ACTEE, DESTINATION, UNDEFINED_ENTITY };

    class IEntity {
      public:
        IEntity() {}
        
        virtual ~IEntity() { printf("destroying ientity!\n"); }

        picojson::value Serialize();

        std::string EnumToString(EntityType type);

      protected:
        EntityType type = UNDEFINED_ENTITY;
        std::vector<double> position;
        std::vector<double> direction;
        std::string name;
        double radius;
        int id;
    };
}

#endif