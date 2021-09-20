#ifndef PHYSICS_H_
#define PHYSICS_H_

namespace csci3081 {
    class Physics {
        Physics() {}
        virtual ~Physics() { printf("destroying physics!\n"); }
    };
}

#endif