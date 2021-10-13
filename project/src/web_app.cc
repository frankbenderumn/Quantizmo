#include "web_app.h"
#include "observer/observer.h"

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
        for (auto e : entities) {
            delete e;
        }
        if (entities.size() > 0) {
            entities.clear();
        }
        // printf("entities size is: ");
        std::cout << entities.size() << std::endl;
    }
    else if (cmd == "createEntity") {
        assert(factory);
        Entity* e = factory->Create(data);
        if (e->GetType() == ACTOR) {
            Actor* a = dynamic_cast<Actor*>(e);
            actor = a;
        } else if (e->GetType() == ACTEE) {
            Actee* a = dynamic_cast<Actee*>(e);
            actees.push_back(a);
        }
        if (e) { 
            AddEntity(e);
            AddObserver(e, new Observer(this));
            Console::Log(SUCCESS, "Entity was added!"); 
        } else {
            Console::Log(FAILURE, "Failed to add entity!");
        }
    } 
    else {
        std::cout << "Unknown command: " << cmd << " - " << picojson::value(data).serialize() << std::endl;
    }
}

void WebApp::Update(double dt, picojson::object& returnValue) {
    for (auto e : entities) {
        // Actor* actor = dynamic_cast<Actor*>(e);
        if (actor) {
            actor->Update(dt);
        } else {
            e->Update(dt);
        }
        returnValue["entity"+std::to_string(e->GetId())] = e->Serialize();
        std::cout << returnValue["entity"+std::to_string(e->GetId())] << std::endl;
    }
}

void WebApp::KeyUp(const std::string& key, int keyCode) {
    std::cout << "key code up is: " << keyCode << std::endl;
    // for (auto e : entities) {
        // Actor* a = dynamic_cast<Actor*>(e);
        if (actor) {
            actor->Release(key, keyCode);
        }
    // }
}

void WebApp::KeyDown(const std::string& key, int keyCode) {
    std::cout << "key code down is: " << keyCode << std::endl;
    // for (auto e : entities) {
    //     Actor* a = dynamic_cast<Actor*>(e);
        if (actor) {
            if (keyCode == 84) {
                assert(actees.size() > 0);
                Actee* actee = actees[0];
                actor->SetTarget(actee);
                actees.erase(actees.begin());
            } else {
                actor->Press(key, keyCode);
            }
        }
    // }
}

void WebApp::Rescue(Destination* dest) {
    actor->SetDestination(dest);
}

void WebApp::AddObserver(Entity* e, IObserver* observer) {
    e->Attach(observer);
}

void WebApp::RemoveObserver(Entity* e, IObserver* observer) {
    e->Detach(observer);
}

void Observer::OnEvent(const picojson::value& value, const IEntity& e) {
    sys->Test();
    // std::cout << e.Serialize() << std::endl;
}


}