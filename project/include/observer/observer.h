#ifndef OBSERVER_H_
#define OBSERVER_H_

#include "interface/iobserver.h"
#include "web_app.h"

namespace csci3081 {

class WebApp;

class Observer : public IObserver {
  public:
    Observer(WebApp* sys) : sys(sys) {}
    ~Observer() { printf("destroying web observer!\n"); }
    void OnEvent(const picojson::value& value, IEntity* e);

  private:
    WebApp* sys;

};

}  // namespace csci3081

#endif