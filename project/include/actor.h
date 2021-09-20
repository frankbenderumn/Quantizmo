#ifndef ACTOR_H_
#define ACTOR_H_

namespace csci3081 {
    class Actor : public Entity {
      public:
        Actor(const picojson::object& data) : Entity(data) {
            if (data.find("speed") != data.end()) {
                this->speed = data.find("speed")->second.get<double>();
            }
        }
        ~Actor() { printf("destroying actor!\n"); }
      private:
        double speed = 1;
    };
}

#endif