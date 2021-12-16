#include "web_app.h"
#include "observer/observer.h"
#define STB_IMAGE_IMPLEMENTATION
#include "image/stb_image.h"

#define STBI_MSC_SECURE_CRT
#define STB_IMAGE_WRITE_IMPLEMENTATION
#include "image/stb_image_write.h"

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


std::map<std::string, float> WebApp::drone_runtimes = {};
std::map<std::string, std::vector<float>> Analytics::cachedOutput = {};

void WebApp::receiveJSON(picojson::value& val) {
    picojson::object data;
    picojson::object returnValue;
    std::string cmd;
    Console::Log(INFO, "PICOJSON::VAL");
    std::cout << picojson::value(val).serialize() << std::endl;
    if (val.is<picojson::object>()) {
        data = val.get<picojson::object>();
        cmd = data["command"].get<std::string>();
        Console::Log(INFO, "SCENE FILE");
        std::cout << picojson::value(data).serialize() << std::endl;
    } else if (val.is<picojson::array>()) {
        picojson::array arr = val.get<picojson::array>();
        std::cout << "in array" << std::endl;
        std::cout << picojson::value(arr).serialize() << std::endl;
        picojson::object o;
        cmd = "save";
        o["scene"] = picojson::value(arr);
        data = o;
    }
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
    std::string decoded;
        std::cout << "IMAGE GOING THROUGH" << std::endl;
        if (data["image"].is<std::string>()) {
            decoded = base64_decode(data["image"].get<std::string>().substr(23));
        } else {
            Console::Log(FAILURE, "picojson value is not a string");
        }
        int width, height, comp;
        // std::cout << decoded << std::endl;
        unsigned char* buffer = stbi_load_from_memory((const unsigned char*)decoded.c_str(), decoded.length(), &width, &height, &comp, 4);
        comp = 4;
        std::cout << stbi_write_png("test.png", width, height, comp, buffer, width*4) << std::endl;
        // CannyDetect c;
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

        if (data.find("decorator") != data.end()) {
            printf("should only run on ec\n");
            picojson::object battery = data.find("decorator")->second.get<picojson::object>();
            picojson::array arr = battery["battery"].get<picojson::array>();
            float charge = static_cast<float>(arr[0].get<double>());
            float max_charge = static_cast<float>(arr[1].get<double>());
            Actor* a = new Actor(data); 
            // AddEntity(a);
            AddObserver(a, new Observer(this));
            BatteryActor* b = new BatteryActor(a, new Battery(charge, max_charge));
            printf("init battery life is:\n");
            b->GetBattery()->Print();
            b->SetHandler(handler);
            decorator = b;
            printf("Adding decorator\n");
            return;
        }

        Entity* e = factory->Create(data);
        if (e->GetType() == ACTOR) {
            Actor* a = dynamic_cast<Actor*>(e);
            assert(handler);
            a->SetHandler(handler);
            actor = a;
        } else if (e->GetType() == ACTEE) {
            Actee* a = dynamic_cast<Actee*>(e);
            actees.push_back(a);
        } else if (e->GetType() == CHARGER) {
            Charger* a = dynamic_cast<Charger*>(e);
            chargers.push_back(a);
        }
        if (e) { 
            AddEntity(e);
            std::cout << entities.size() << std::endl;
            AddObserver(e, new Observer(this));
        } else {
            // Console::Log(FAILURE, "Failed to add entity!");
        }
    } 
    else if (cmd == "rescue") {
        int acteeIdx = (int)data["actee"].get<double>();
        int destIdx = (int)data["destination"].get<double>();
        std::cout << "acteeIdx: " << acteeIdx << " destIdx: " << destIdx << std::endl;
        assert(entities.size() >= 2);
        if (decorator) {
            Rescue((Actee*)entities.at(acteeIdx-1), (Destination*)entities.at(destIdx-1));
        } else {
            Rescue((Actee*)entities.at(acteeIdx), (Destination*)entities.at(destIdx));
        }
    } else if (cmd == "save") {
        std::cout << picojson::value(data).serialize() << std::endl;
        std::cout << "building" << std::endl;
        auto arr = data["scene"].get<picojson::array>();
        picojson::object sceneInfo = arr[0].get<picojson::object>();
        std::string path = sceneInfo.find("path")->second.get<std::string>();
        std::string ext = sceneInfo.find("ext")->second.get<std::string>();
        Builder* b = new Builder(arr);
        b->build(path, ext);
        delete b;
    } else if (cmd == "stock") {
        std::cout << picojson::value(data).serialize() << std::endl;
        std::string token = "Tpk_64ae4b7c2dca48c7bb11970baaf64f1c";
        Iex* client = new Iex(token);
        std::string ticker = data["ticker"].get<std::string>();
        picojson::value iex = client->Quote(ticker);
        std::cout << iex.serialize() << std::endl;
        picojson::object child;
        child["type"] = picojson::value("stock");
        child["data"] = iex;
        picojson::object o;
        o["notification"] = picojson::value(child);
        picojson::value toSend(o);
        this->Send(toSend);
        delete client;
    } else if (cmd == "speech") {
        Console::Log(SUCCESS, "Receiving speech text");
        std::cout << picojson::value(data).serialize() << std::endl;
        std::string s;
        if(data["text"].is<std::string>()) {
            s = data["text"].get<std::string>();
            s = nlp->Parse(s);
            
        } else {
            Console::Log(WARNING, "Text is not being received.");
        }

        if (s.size() > 0) {
            // if(s.find("Royal Caribbean") != 0 && s.find("Royal Caribbean") != string::npos) {
            //     Console::Log(SUCCESS, "SAYING RCL");
            //     SendFin("RCL");

            // } 
            // else if(s.find("Carnival") != 0 && s.find("Carnival") != string::npos) {
            //     Console::Log(SUCCESS, "SAYING CCL");
            //     SendFin("CCL");
            // } 
            SendFin(s);
            s = "";
        }
    } else if (cmd == "skybox") {
        std::cout << "skybox received" << std::endl;
    }
    else {
        std::cout << "Unknown command: " << cmd << " - " << picojson::value(data).serialize() << std::endl;
    }
}

void WebApp::Update(double dt, picojson::object& returnValue) {
    // printf("updating\n");
    if (decorator) {
        BatteryActor* b = (BatteryActor*) decorator;
        b->SetChargers(chargers);
        if (b->GetBattery()->IsLow()) {
        // Console::Log(WARNING, "Battery is low\n");
        }
        const std::string drone_model = JsonHelper::GetString(decorator->GetActor()->GetData(), "name");
        UpdateTimeMap(drone_model, dt);
        decorator->Update(dt);
        returnValue["entity"+std::to_string(decorator->GetActor()->GetId())] = decorator->GetActor()->Serialize();
        // std::cout << returnValue["entity"+std::to_string(decorator->GetActor()->GetId())] << std::endl;
    }

    for (auto e : entities) {
        Actor* a = dynamic_cast<Actor*>(e);
        if (a) {
            // printf("updating\n");
            a->Update(dt);
            const std::string drone_model = JsonHelper::GetString(a->GetData(), "name");
            UpdateTimeMap(drone_model, dt);
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
    if (decorator) { actor = decorator->GetActor(); }
    if (actor) {
        // image processing temp workaround
        if (keyCode == 84) {
            assert(actees.size() > 0);
            Actee* actee = actees[0];
            if (actor->GetType() == ACTOR) {
                Actor* a = dynamic_cast<Actor*>(actor);
                a->SetTarget(actee); 
            } else {
                BatteryActor* b = dynamic_cast<BatteryActor*>(actor);
                b->SetTarget(actee); 
            }
            // actor->SetTarget(actee);
            // actees.erase(actees.begin());
        } else {
            handler->Handle(1, keyCode);
        }
    }
}

std::vector<Entity*> WebApp::GetByType(int type) {
    std::vector<Entity*> result;
    for (auto e : entities) {
        if (e->GetType() == type) result.push_back(e);
    }
    return result;
}

void WebApp::UpdateTimeMap(const std::string& drone_model, float distance){
    auto it = drone_runtimes.find(drone_model);
    if (it == drone_runtimes.end()){
        drone_runtimes.insert({drone_model, distance});
    }
    else{
        it->second += distance;
    }
}

void WebApp::SendFin(std::string ticker) {
    std::string token = "Tpk_64ae4b7c2dca48c7bb11970baaf64f1c";
    Iex* client = new Iex(token);
    picojson::value iex = client->Quote(ticker);
    // std::cout << iex.serialize() << std::endl;
    picojson::object child;
    child["type"] = picojson::value("stock");
    child["data"] = iex;
    picojson::object o;
    o["notification"] = picojson::value(child);
    picojson::value toSend(o);
    this->Send(toSend);
    delete client;
}

void WebApp::Send(picojson::value& val) {
    sendJSON(val);
}

void Observer::OnEvent(const picojson::value& value, IEntity* e) {
    // if (e->GetType() == ACTOR) {
    //   Actor* a = dynamic_cast<Actor*>(e);
    // }
    // std::cout << e->Serialize() << std::endl;
    picojson::object o;
    o["notification"] = picojson::value(value);
    picojson::value v(o);
    sys->Send(v);
}
