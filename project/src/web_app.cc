#include "web_app.h"
#include "observer/observer.h"
// #define STB_IMAGE_IMPLEMENTATION
#include "image/stb_image.h"

// #define STBI_MSC_SECURE_CRT
// #define STB_IMAGE_WRITE_IMPLEMENTATION
#include "image/stb_image_write.h"

// /*
//    base64.cpp and base64.h
//    Copyright (C) 2004-2008 René Nyffenegger
//    This source code is provided 'as-is', without any express or implied
//    warranty. In no event will the author be held liable for any damages
//    arising from the use of this software.
//    Permission is granted to anyone to use this software for any purpose,
//    including commercial applications, and to alter it and redistribute it
//    freely, subject to the following restrictions:
//    1. The origin of this source code must not be misrepresented; you must not
//       claim that you wrote the original source code. If you use this source code
//       in a product, an acknowledgment in the product documentation would be
//       appreciated but is not required.
//    2. Altered source versions must be plainly marked as such, and must not be
//       misrepresented as being the original source code.
//    3. This notice may not be removed or altered from any source distribution.
//    René Nyffenegger rene.nyffenegger@adp-gmbh.ch
// */

const std::string base64_chars =
            "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
            "abcdefghijklmnopqrstuvwxyz"
            "0123456789+/";


bool is_base64(unsigned char c) {
    return (isalnum(c) || (c == '+') || (c == '/'));
}

std::string base64_decode(std::string const& encoded_string) {
    int in_len = encoded_string.size();
    int i = 0;
    int j = 0;
    int in_ = 0;
    unsigned char char_array_4[4], char_array_3[3];
    std::string ret;

    while (in_len-- && ( encoded_string[in_] != '=') && is_base64(encoded_string[in_])) {
        char_array_4[i++] = encoded_string[in_]; in_++;
        if (i ==4) {
        for (i = 0; i <4; i++)
            char_array_4[i] = base64_chars.find(char_array_4[i]);

        char_array_3[0] = (char_array_4[0] << 2) + ((char_array_4[1] & 0x30) >> 4);
        char_array_3[1] = ((char_array_4[1] & 0xf) << 4) + ((char_array_4[2] & 0x3c) >> 2);
        char_array_3[2] = ((char_array_4[2] & 0x3) << 6) + char_array_4[3];

        for (i = 0; (i < 3); i++)
            ret += char_array_3[i];
        i = 0;
        }
    }

    if (i) {
        for (j = i; j <4; j++)
        char_array_4[j] = 0;

        for (j = 0; j <4; j++)
        char_array_4[j] = base64_chars.find(char_array_4[j]);

        char_array_3[0] = (char_array_4[0] << 2) + ((char_array_4[1] & 0x30) >> 4);
        char_array_3[1] = ((char_array_4[1] & 0xf) << 4) + ((char_array_4[2] & 0x3c) >> 2);
        char_array_3[2] = ((char_array_4[2] & 0x3) << 6) + char_array_4[3];

        for (j = 0; (j < i - 1); j++) ret += char_array_3[j];
    }

    return ret;
}

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
          std::cout << "IMAGE GOING THROUGH" << std::endl;
            std::string decoded = base64_decode(data["image"].get<std::string>().substr(23));
            int width, height, comp;
            unsigned char* buffer = stbi_load_from_memory((const unsigned char*)decoded.c_str(), decoded.length(), &width, &height, &comp, 4);
            comp = 4;
            std::cout << stbi_write_png("test.png", width, height, comp, buffer, width*4) << std::endl;
            CannyDetect c;
            // c.detect();
            //std::cout << stbi_write_jpg("test.jpg", width, height, comp, buffer, 100.0) << std::endl;
        }
        else if (cmd == "reset") {
            for (auto e : entities) {
                delete e;
            }
        }
        else if (cmd == "createEntity") {
            assert(factory);
            Entity* e = factory->Create(data);
            // BatteryActor* b = dynamic_cast<BatteryActor*>(e);
            // if (b) {
            //     b->SetHandler(handler);
            //     // actor = b;
            // }
            if (e->GetType() == ACTOR) {
                Actor* a = dynamic_cast<Actor*>(e);
                assert(handler);
                a->SetHandler(handler);
                actor = a;
            } else if (e->GetType() == ACTEE) {
                Actee* a = dynamic_cast<Actee*>(e);
                actees.push_back(a);
            } else if (e->GetType() == DESTINATION) {
                Destination* d = dynamic_cast<Destination*>(e);
                Rescue(d);
            }
            if (e) { 
                AddEntity(e);
                std::cout << entities.size() << std::endl;
                AddObserver(e, new Observer(this));
                Console::Log(SUCCESS, "Entity was added!"); 
            } else {
                Console::Log(FAILURE, "Failed to add entity!");
            }
        } 
        else if (cmd == "rescue") {
          int acteeIdx = (int)data["actee"].get<double>();
          int destIdx = (int)data["actee"].get<double>();
        }
        else {
            std::cout << "Unknown command: " << cmd << " - " << picojson::value(data).serialize() << std::endl;
        }
    }

    void WebApp::Update(double dt, picojson::object& returnValue) {
        for (auto e : entities) {
            if (actor) {
                actor->Update(dt);
            } else {
                e->Update(dt);
            }
            returnValue["entity"+std::to_string(e->GetId())] = e->Serialize();
            // std::cout << returnValue["entity"+std::to_string(e->GetId())] << std::endl;
        }
    }

    void WebApp::KeyUp(const std::string& key, int keyCode) {
        std::cout << "key code up is: " << keyCode << std::endl;
        handler->Handle(0, keyCode);
    }

    void WebApp::KeyDown(const std::string& key, int keyCode) {
        std::cout << "key code down is: " << keyCode << std::endl;
        if (actor) {
            // image processing temp workaround
            if (keyCode == 84) {
                assert(actees.size() > 0);
                Actee* actee = actees[0];
                // if (actor->GetType() == ACTOR) {
                //     Actor* a = dynamic_cast<Actor*>(actor);
                //     a->SetTarget(actee); 
                // } else {
                //     BatteryActor* b = dynamic_cast<BatteryActor*>(actor);
                //     b->SetTarget(actee); 
                // }
                actor->SetTarget(actee);
                actees.erase(actees.begin());
            } else {
                handler->Handle(1, keyCode);
            }
        }
    }

    void Observer::OnEvent(const picojson::value& value, const IEntity& e) {
        sys->Test();
        // std::cout << e.Serialize() << std::endl;
    }

}
