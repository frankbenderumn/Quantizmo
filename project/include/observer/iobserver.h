#ifndef IOBSERVER_H_
#define IOBSERVER_H_

#include "entity/entity.h"

namespace csci3081 {

class IObserver {
  public:
    IObserver() {}
    virtual ~IObserver() { printf("destroying iobserver!\n"); }
    virtual void OnEvent(const picojson::value& value, const IEntity& e) = 0;

};

}  // namespace csci3081

#endif