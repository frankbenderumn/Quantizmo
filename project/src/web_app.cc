#include "web_app.h"

namespace csci3081 {

void WebApp::receiveJSON(picojson::value& val) {
    picojson::object data = val.get<picojson::object>();
    std::string cmd = data["command"].get<std::string>();
    picojson::object returnValue;
    returnValue["id"] = data["id"];
    ReceiveCommand(cmd, data, returnValue);
    picojson::value retVal(returnValue);
    sendJSON(retVal);
}

void WebApp::ReceiveCommand(const std::string& cmd, picojson::object& data, picojson::object& returnValue) {
    if (cmd == "update") {
        std::chrono::time_point<std::chrono::system_clock> end = std::chrono::system_clock::now();
        std::chrono::duration<double> diff = end - start;
        double delta = diff.count() - time;
        time += delta;

        double simSpeed = data["simSpeed"].get<double>();
        delta *= simSpeed;

        if (delta > 0.1) {
            for (float f = 0.0; f < delta; f+=0.01) {
                Update(0.01, returnValue);
            }
        }
        else {
            Update(delta, returnValue);
        }
    }
    else if (cmd == "keyup") {
        KeyUp(data["key"].get<std::string>(), data["keyCode"].get<double>());
    }
    else if (cmd == "keydown") {
        KeyDown(data["key"].get<std::string>(), data["keyCode"].get<double>());
    }
    else if (cmd == "image") {
        const std::string& image = data.find("url")->second.get<std::string>();
        // std::cout << image << std::endl;
    }
    else if (cmd == "reset") {
        if (entities.size() > 0) {
            entities.clear();
        }
    }
    else if (cmd == "createEntity") {
        assert(factory != nullptr);
        // Entity* e = factory->Create(data.find("entity")->second.get<picojson::object>());
        Entity* e = factory->Create(data);
        Actor* actor = dynamic_cast<Actor*>(e);
        if (actor != nullptr) {
            Observer* o = new Observer(this);
            actor->Attach(o);
        }
        if (e) { AddEntity(e); Console::Log(SUCCESS, "Entity was added!"); } else {
            Console::Log(FAILURE, "Failed to add entity!");
        }
    } 
    else {
        std::cout << "Unknown command: " << cmd << " - " << picojson::value(data).serialize() << std::endl;
    }
}

void WebApp::Update(double dt, picojson::object& returnValue) {
    // JsonHelper::Print(returnValue);
    for (auto e : entities) {
        Actor* actor = dynamic_cast<Actor*>(e);
        if (actor != nullptr) {
            actor->Update(dt);
        } else {
            e->Update(dt);
        }
        // std::cout << e->GetName() << std::endl;
        // std::cout << e->Serialize() << std::endl;
        returnValue["entity"+std::to_string(e->GetId())] = e->Serialize();
    }
}

void WebApp::KeyUp(const std::string& key, int keyCode) {
    std::cout << "key code up is: " << keyCode << std::endl;
    if (actor) {
        actor->Release(key, keyCode);
    }
}

void WebApp::KeyDown(const std::string& key, int keyCode) {
    std::cout << "key code down is: " << keyCode << std::endl;
    if (actor) {
        actor->Press(key, keyCode);
    }
}

// void WebApp::AddObserver(Entity* e, Observer* observer) {
//     Actor* actor = dynamic_cast<Actor*>(e);
//     if (actor) {
//         actor->AddObserver();
//     }
//   observers.push_back(observer);
// }

// void WebApp::RemoveObserver(Entity* e, Observer* observer) {

//   for (int i = 0; i < observers.size(); i++) {
//     if (observers[i] == observer) {
//       observers.erase(observers.begin() + i);
//       return;
//     }
//   }
// }

// void WebApp::NotifyObservers(picojson::value& notification, Entity* entity) {
//   for (Observer* obs : observers) {
//     obs->OnEvent(notification, *entity);
//   }
// }

}
