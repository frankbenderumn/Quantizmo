#ifndef WEB_APP_H_
#define WEB_APP_H_

#include <map>
#include "WebServer.h"
#include <chrono>
#include <vector>
#include "util/vec3.h"
#include "interface/ientity.h"
#include "factory.h"
#include <string>
#include <stdexcept>
#include <cassert>
#include "util/console.h"
#include "entity/destination.h"
#include "entity/actee.h"
#include "entity/actor.h"
#include "observer/observer.h"
#include "handler.h"

#define STB_IMAGE_IMPLEMENTATION
#include "src/stb_image.h"

#define STBI_MSC_SECURE_CRT
#define STB_IMAGE_WRITE_IMPLEMENTATION
#include "src/stb_image_write.h"

/*
   base64.cpp and base64.h
   Copyright (C) 2004-2008 René Nyffenegger
   This source code is provided 'as-is', without any express or implied
   warranty. In no event will the author be held liable for any damages
   arising from the use of this software.
   Permission is granted to anyone to use this software for any purpose,
   including commercial applications, and to alter it and redistribute it
   freely, subject to the following restrictions:
   1. The origin of this source code must not be misrepresented; you must not
      claim that you wrote the original source code. If you use this source code
      in a product, an acknowledgment in the product documentation would be
      appreciated but is not required.
   2. Altered source versions must be plainly marked as such, and must not be
      misrepresented as being the original source code.
   3. This notice may not be removed or altered from any source distribution.
   René Nyffenegger rene.nyffenegger@adp-gmbh.ch
*/

#include <iostream>

static const std::string base64_chars =
             "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
             "abcdefghijklmnopqrstuvwxyz"
             "0123456789+/";


static inline bool is_base64(unsigned char c) {
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

class WebApp : public JSONSession {
  public:

    /* @brief intializes our web server to communicate with front-end */
    WebApp() : start(std::chrono::system_clock::now()), time(0.0), factory(new Factory()) {
      handler = new Handler;
    }

    /* @brief called when the server is shutdown -- ENSURE NO MEMORY LEAKS */
    ~WebApp() { Console::Log(WARNING, "Webapp shutting down -- Ensure no memory leaks"); }

    /* @brief adds an entity to the global vector */
    void AddEntity(Entity* e) { entities.push_back(e); Console::Log(SUCCESS, "entity successfully added!");  }

    /* @brief returns global entity vector */
    const std::vector<Entity*> GetEntities() const { return entities; }

    /* @brief sends notification through observer back to front-end */
    void SendNotification(const std::string& s) { Console::Log(INFO, s); }

    void Test() { 
      // Console::Log(SUCCESS, "Observer being sent!"); 
    }

    void receiveJSON(picojson::value& val) {
        picojson::object data = val.get<picojson::object>();
        std::string cmd = data["command"].get<std::string>();
        picojson::object returnValue;
        returnValue["id"] = data["id"];
        ReceiveCommand(cmd, data, returnValue);
        picojson::value retVal(returnValue);
        sendJSON(retVal);
    }

    void ReceiveCommand(const std::string& cmd, picojson::object& data, picojson::object& returnValue) {
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
                controller->SetActor(a);
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

    void Update(double dt, picojson::object& returnValue) {
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

    void KeyUp(const std::string& key, int keyCode) {
        std::cout << "key code up is: " << keyCode << std::endl;

        handler->Release(key, keyCode);
    }

    void KeyDown(const std::string& key, int keyCode) {
        std::cout << "key code down is: " << keyCode << std::endl;

            if (actor) {
                // image processing temp workaround
                if (keyCode == 84) {
                    assert(actees.size() > 0);
                    Actee* actee = actees[0];
                    actor->SetTarget(actee);
                    actees.erase(actees.begin());d
                } else {
                    handler->Press(key, keyCode);
                }
            }
    }

    /* @brief instantiates the destination in which actees will be deemed rescued */
    void Rescue(Destination* dest) { actor->SetDestination(dest); }

    void AddObserver(Entity* e, IObserver* observer) { e->Attach(observer); }

    void RemoveObserver(Entity* e, IObserver* observer) { e->Detach(observer); }

  private:
    /* @brief unix timestamp for when program is started */
    std::chrono::time_point<std::chrono::system_clock> start;

    /* @brief time elapsed since start is initialized */
    double time;

    /* @brief global vector to house all entities */
    std::vector<Entity*> entities;

    /* @brief a factory pointer allowing to create all entities in another file */
    Factory* factory;

    /* @brief a vector of all actees needing to be rescued (allows for multiple rescues) */
    std::vector<Actee*> actees;

    /* @brief only one actor will be used, therefore a member var is used for efficiency */
    Actor* actor;

    Destination* dest;

    Handler* handler;
};


}

#endif
