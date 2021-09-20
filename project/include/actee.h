#ifndef ACTEE_H_
#define ACTEE_H_

namespace csci3081 {
    class Actee : public Entity {
      public:
        Actee(const picojson::object& data) : Entity(data) {}
        ~Actee() { printf("destroying actee!\n"); }
    };
}

#endif