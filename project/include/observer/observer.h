#ifndef OBSERVER_H_
#define OBSERVER_H_

#include "web_app.h"

namespace csci3081 {

    class WebApp;

    class Observer {
      public:
        Observer(WebApp* webapp) {
          this->sys = webapp;
        }
        ~Observer() { printf("destroying observer!\n"); }
        void OnEvent(const picojson::value& value, const Entity& e) {
            // this->sys->Test();
        }

      private:
        WebApp* sys;
    };

}  // namespace csci3081

#endif