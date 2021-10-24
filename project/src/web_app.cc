#include "web_app.h"
#include "observer/observer.h"
#define STB_IMAGE_IMPLEMENTATION
#include "stb_image.h"

#define STBI_MSC_SECURE_CRT
#define STB_IMAGE_WRITE_IMPLEMENTATION
#include "stb_image_write.h"

namespace csci3081 {

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
          std::cout << "IMAGE GOING THROUGH" << std::endl;
            std::string decoded = base64_decode(data["image"].get<std::string>().substr(23));
            int width, height, comp;
            unsigned char* buffer = stbi_load_from_memory((const unsigned char*)decoded.c_str(), decoded.length(), &width, &height, &comp, 4);
            comp = 4;
            std::cout << stbi_write_png("test.png", width, height, comp, buffer, width*4) << std::endl;
            //std::cout << stbi_write_jpg("test.jpg", width, height, comp, buffer, 100.0) << std::endl;
        }
        else if (cmd == "reset") {
            for (auto e : entities) {
                delete e;
            }
            // if (entities.size() > 0) {
            //     entities.clear();
            // }
            std::cout << entities.size() << std::endl;
        }
        else if (cmd == "createEntity") {
            assert(factory);
            Entity* e = factory->Create(data);
            if (e->GetType() == ACTOR) {
                Actor* a = dynamic_cast<Actor*>(e);
                actor = a;
                // controller->SetActor(a);
            } else if (e->GetType() == ACTEE) {
                Actee* a = dynamic_cast<Actee*>(e);
                actees.push_back(a);
            } else if (e->GetType() == DESTINATION) {
                Destination* d = dynamic_cast<Destination*>(e);
                Rescue(d);
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

    void Observer::OnEvent(const picojson::value& value, const IEntity& e) {
        sys->Test();
        // std::cout << e.Serialize() << std::endl;
    }

}
