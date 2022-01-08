#ifndef WEB_APP_H_
#define WEB_APP_H_

#include <map>
#include "WebServer.h"
#include <chrono>
#include <vector>
#include "util/math/vec3.h"
#include "interface/ientity.h"
#include "factory.h"
#include <string>
#include <stdexcept>
#include <cassert>
#include "util/debug/console.h"
#include "entity/destination.h"
#include "entity/actee.h"
#include "entity/actor.h"
#include "observer/observer.h"
#include "util/handler.h"
#include <iostream>
#include "image/canny_detect.h"
#include "addon/analytics.h"
#include "addon/battery_actor.h"
#include "builder.h"
#include "financial/iex.h"
#include "ai/nlp.h"
#include <unordered_map>
// #include <filesystem>

class WebApp : public JSONSession {
  public:

    /* @brief intializes our web server to communicate with front-end */
    WebApp() : start(std::chrono::system_clock::now()), time(0.0), factory(new Factory()) {
        handler = new Handler;
        analytics = Analytics::instance();
        nlp = new NLP;

        // for (const auto& file : directory_iterator("web/assets/texture/hdr")) {
            // Console::Log(INFO, file.path());
            // cout << file.path() << endl;
            // return EXIT_SUCCESS;
        // }
        // std::cout << "Wow" << std::endl;
        // FILE* stream;
        // const int max_buffer = 256;
        // char buffer[max_buffer];
        // std::string cmd = "ls web/assets/texture/hdr";
        // cmd.append(" 2>&1");

        // stream = popen(cmd.c_str(), "r");

        // if (stream) {
        //   while (!feof(stream))
        //     if (fgets(buffer, max_buffer, stream) != NULL) files.append(buffer);
        //   pclose(stream);
        // }
        dirs["hdr"] = readDir("web/assets/texture/hdr");
        dirs["models"] = readDir("web/assets/models");
        dirs["scenes"] = readDir("web/js/scenes");
        dirs["images"] = readDir("web/assets/images");


        // return data;
        Console::Log(SUCCESS, "File directory parsed!");
        // std::cout << files << std::endl;
        // picojson::value val = picojson::value(files);
        // this->sendJSON(val);
        // system("ls web/assets/texture/hdr");
    }

    std::string readDir(std::string name) {
        FILE* stream;
        std::string fileBuffer = "";
        const int max_buffer = 256;
        char buffer[max_buffer];
        std::string cmd = "ls " + name;
        cmd.append(" 2>&1");

        stream = popen(cmd.c_str(), "r");

        if (stream) {
          while (!feof(stream))
            if (fgets(buffer, max_buffer, stream) != NULL) fileBuffer.append(buffer);
          pclose(stream);
        }

        return fileBuffer;
    }

    /* @brief called when the server is shutdown -- ENSURE NO MEMORY LEAKS */
    ~WebApp() { 
        Console::Log(WARNING, "Webapp shutting down -- Ensure no memory leaks");
        // analytics = Analytics::instance();
        analytics->WriteRuntimesToCache(drone_runtimes);
     }

    /* @brief adds an entity to the global vector */
    void AddEntity(Entity* e) { entities.push_back(e); Console::Log(SUCCESS, "entity successfully added!");  }

    /* @brief returns global entity vector */
    const std::vector<Entity*> GetEntities() const { return entities; }

    void receiveJSON(picojson::value& val);

    void ReceiveCommand(const std::string& cmd, picojson::object& data, picojson::object& returnValue);
    
    void Update(double dt, picojson::object& returnValue);

    void KeyUp(const std::string& key, int keyCode);

    void KeyDown(const std::string& key, int keyCode);

    /* @brief instantiates the destination in which actees will be deemed rescued */
    void Rescue(Actee* actee, Destination* dest) { actee->SetDestination(dest); }

    void AddObserver(Entity* e, IObserver* observer) { e->Attach(observer); }

    void RemoveObserver(Entity* e, IObserver* observer) { e->Detach(observer); }

    /* @brief sends notification through observer back to front-end */
    void Send(picojson::value& val);

    void SendFin(std::string ticker);

    std::vector<Entity*> GetByType(int type);

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
    std::vector<Charger*> chargers;
    
    /* @brief only one actor will be used, therefore a member var is used for efficiency */
    IActor* actor = nullptr;
    Decorator* decorator = nullptr;
    
    Handler* handler;    
    
    static std::map<std::string, float> drone_runtimes; // Records the runtime traveled for each drone. Used for Analytics
    void UpdateTimeMap(const std::string&, float distance = 0); // Update the drone time map
    Analytics* analytics;
    NLP* nlp;
    std::string files;
    std::unordered_map<std::string, std::string> dirs;
};

#endif
