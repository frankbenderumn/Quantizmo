#ifndef ENTITY_H_
#define ENTITY_H_

namespace csci3081 {
    class Entity {
        Entity() {}
        virtual ~Entity() { printf("destroying entity!\n"); }
    };
}

#endif