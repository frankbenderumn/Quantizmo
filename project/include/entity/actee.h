#ifndef ACTEE_H_
#define ACTEE_H_

#include "entity.h"
#include "destination.h"
 
class Actee : public Entity {
  public:
    Actee(const picojson::object& data) : Entity(data) {
      this->type = ACTEE;
    }
    ~Actee() { printf("destroying actee!\n"); }
    void Update(float dt) {}
    void SetDestination(Destination* dest) { this->dest = dest; }
    Destination* GetDestination() { return this->dest; }
    
  private:
    Destination* dest;
};

#endif