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
        Entity* Create(const picojson::object& data);
    };

}

#endif