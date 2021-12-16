#ifndef BUILDER_H_
#define BUILDER_H_

#include <sstream>
#include <picojson.h>
#include <chrono>
#include <string>
#include <vector>
#include <fstream>
#include "util/debug/console.h"
#include <time.h>

class Builder {
    public:
        Builder(picojson::array arr) {
            this->scene = arr;
        }
        std::string build(std::string fileName, std::string ext) {
            std::array<char, 64> buffer;
            buffer.fill(0);
            time_t rawtime;
            time(&rawtime);
            const auto timeinfo = localtime(&rawtime);
            strftime(buffer.data(), sizeof(buffer), "%m%d%Y_%H%M%S", timeinfo);
            std::string s(buffer.data());
            std::string name = "web/js/scenes/"+fileName+"."+ext;
            std::ofstream f(name);
            f << "[" << "\n";
            for(int i = 0; i < scene.size(); i++) {
                auto el = scene.at(i);
                f << "\t{" << std::endl;
                std::cout << "HELL EL ---->" << std::endl;
                std::cout << el << std::endl;
                if (el.is<std::string>()) {
                    printf("stringggg\n");
                } else if (el.is<double>()) {
                    printf("doubleeee\n");
                } else if (el.is<picojson::array>()) {
                    printf("arrray\n");
                } else if (el.is<picojson::object>()) {

                    std::cout << picojson::value(el).serialize() << std::endl;
                    picojson::object e = el.get<picojson::object>();
                    std::cout << "GOD DAMNIT" << std::endl;

                    std::string type = e.find("type")->second.get<std::string>();
                    if (type == "actor" || type == "actee" || type == "destination" || type == "charger" || type == "collider") {
                        f << "\t\t\"command\": \"createEntity\"," << std::endl;
                        f << "\t\t\"params\": {" << std::endl;
                        f << "\t\t\t" << "\"entityId\": " << picojson::value(e.find("entityId")->second.get<double>()).serialize() << "," << std::endl;
                        f << "\t\t\t" << "\"name\": " << picojson::value(e.find("name")->second.get<std::string>()).serialize() << "," << std::endl;
                        f << "\t\t\t" << "\"type\": " << picojson::value(e.find("type")->second.get<std::string>()).serialize() << "," << std::endl;
                        f << "\t\t\t" << "\"path\": " << picojson::value(e.find("path")->second.get<std::string>()).serialize() << "," << std::endl;
                        f << "\t\t\t" << "\"interact\": " << picojson::value(e.find("interact")->second.get<double>()).serialize() << "," << std::endl;
                        f << "\t\t\t" << "\"dynamic\": " << picojson::value(e.find("dynamic")->second.get<bool>()).serialize() << "," << std::endl;
                        f << "\t\t\t" << "\"position\": " << picojson::value(e.find("position")->second.get<picojson::object>()).serialize() << "," << std::endl;
                        f << "\t\t\t" << "\"rotation\": " << picojson::value(e.find("rotation")->second.get<picojson::object>()).serialize() << "," << std::endl;
                        f << "\t\t\t" << "\"scale\": " << picojson::value(e.find("scale")->second.get<picojson::object>()).serialize() << std::endl;
                    } else if (type == "skybox") {
                        f << "\t\t\"command\": \"skybox\"," << std::endl;
                        f << "\t\t\"params\": {" << std::endl;
                        f << "\t\t\t" << "\"entityId\": " << picojson::value(e.find("entityId")->second.get<double>()).serialize() << "," << std::endl;
                        f << "\t\t\t" << "\"name\": " << picojson::value(e.find("name")->second.get<std::string>()).serialize() << "," << std::endl;
                        f << "\t\t\t" << "\"type\": " << picojson::value(e.find("type")->second.get<std::string>()).serialize() << "," << std::endl;
                        f << "\t\t\t" << "\"path\": " << picojson::value(e.find("path")->second.get<std::string>()).serialize() << std::endl;
                    } else if (type == "scene") {
                        f << "\t\t\"command\": \"scene\"," << std::endl;
                        f << "\t\t\"params\": {" << std::endl;
                        f << "\t\t\t" << "\"name\": " << picojson::value(e.find("name")->second.get<std::string>()).serialize() << "," << std::endl;
                        f << "\t\t\t" << "\"ext\": " << picojson::value(e.find("ext")->second.get<std::string>()).serialize() << "," << std::endl;
                        f << "\t\t\t" << "\"type\": " << picojson::value("scene").serialize() << "," << std::endl;
                        f << "\t\t\t" << "\"path\": " << picojson::value(e.find("path")->second.get<std::string>()).serialize() << "," << std::endl;
                        f << "\t\t\t" << "\"author\": " << picojson::value(e.find("author")->second.get<std::string>()).serialize() << "," << std::endl;
                        f << "\t\t\t" << "\"created_at\": " << picojson::value(s).serialize() << "," << std::endl;
                        f << "\t\t\t" << "\"updated_at\": " << picojson::value(s).serialize() << "" << std::endl;
                    } else if (type == "controller") {
                        f << "\t\t\"command\": \"createEntity\"," << std::endl;
                        f << "\t\t\"params\": {" << std::endl;
                        f << "\t\t\t" << "\"entityId\": " << picojson::value(e.find("entityId")->second.get<double>()).serialize() << "," << std::endl;
                        f << "\t\t\t" << "\"name\": " << picojson::value(e.find("name")->second.get<std::string>()).serialize() << "," << std::endl;
                        f << "\t\t\t" << "\"type\": " << picojson::value(e.find("type")->second.get<std::string>()).serialize() << "," << std::endl;
                        f << "\t\t\t" << "\"hand\": " << picojson::value(e.find("type")->second.get<std::string>()).serialize() << "," << std::endl;
                        f << "\t\t\t" << "\"node\": " << picojson::value(e.find("type")->second.get<std::string>()).serialize() << "," << std::endl;
                        f << "\t\t\t" << "\"path\": " << picojson::value(e.find("path")->second.get<std::string>()).serialize() << "," << std::endl;
                        f << "\t\t\t" << "\"dynamic\": " << picojson::value(e.find("dynamic")->second.get<bool>()).serialize() << "," << std::endl;
                        f << "\t\t\t" << "\"position\": " << picojson::value(e.find("position")->second.get<picojson::object>()).serialize() << "," << std::endl;
                        f << "\t\t\t" << "\"rotation\": " << picojson::value(e.find("rotation")->second.get<picojson::object>()).serialize() << "," << std::endl;
                        f << "\t\t\t" << "\"scale\": " << picojson::value(e.find("scale")->second.get<picojson::object>()).serialize() << std::endl;
                    }

                }
                f << "\t\t}" << std::endl;
                if (i != scene.size() - 1) {
                    f << "\t}," << std::endl;
                } else {
                    f << "\t}" << std::endl;
                }
            }
            f << "]" << "\n";
            f.close();
            return name;
        }
    private:
        picojson::array scene;
};

#endif