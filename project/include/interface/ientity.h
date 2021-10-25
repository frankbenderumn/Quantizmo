#ifndef IENTITY_H_
#define IENTITY_H_

#include "util/json_helper.h"
#include <vector>
#include <string>
#include "util/console.h"
#include "util/vec3.h"

namespace csci3081 {

    enum EntityType { ACTOR, ACTEE, DESTINATION, CHARGER, BATTERY_ACTOR, UNDEFINED_ENTITY };

    class IEntity {
      public:              
        virtual ~IEntity() { printf("destroying ientity!\n"); }
        virtual void Update(float dt) = 0;
        virtual const std::string& GetName() = 0;
        virtual EntityType GetType() = 0;
        virtual const int GetId() = 0;
        virtual const int GetRadius() = 0;
        virtual Vec3& GetPosition() = 0;
        virtual void SetPosition(Vec3 rhs) = 0;
        virtual picojson::value Serialize() = 0;

      protected:
        picojson::object data;
        EntityType type = UNDEFINED_ENTITY;
        Vec3 position;
        Vec3 direction;
        std::string name;
        double radius;
        int id;
    };
}

#endif