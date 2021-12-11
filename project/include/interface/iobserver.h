#ifndef IOBSERVER_H_
#define IOBSERVER_H_

#include "entity/entity.h"

class IObserver {
  public:
    IObserver() {}
    virtual ~IObserver() { printf("destroying iobserver!\n"); }
    virtual void OnEvent(const picojson::value& value, IEntity* e) = 0;

};

#endif