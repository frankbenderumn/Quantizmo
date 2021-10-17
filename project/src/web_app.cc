#include "web_app.h"
#include "observer/observer.h"

namespace csci3081 {

    void Observer::OnEvent(const picojson::value& value, const IEntity& e) {
        sys->Test();
        // std::cout << e.Serialize() << std::endl;
    }


}