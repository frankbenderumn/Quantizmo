#ifndef DESTINATION_H_
#define DESTINATION_H_

namespace csci3081 {
    class Destination : public Entity {
      public:
        Destination(const picojson::object& data) : Entity(data) {}
        ~Destination() { printf("destroying entity!\n"); }
    };
}

#endif