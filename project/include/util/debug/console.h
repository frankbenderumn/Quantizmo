#ifndef CONSOLE_H_
#define CONSOLE_H_

#include <string>
#include <iostream>
#include "util/json_helper.h"

enum StatusType { SUCCESS, FAILURE, INFO, WARNING };

class Console {
  public:
    static void Log(StatusType type, const std::string& msg) {
        if (type == 0) {
            std::cout << "\033[1;32mSUCCESS\033[0m " << msg << std::endl;
        } else if (type == 1) {
            std::cout << "\033[1;31mERROR\033[0m " << msg << std::endl;
        } else if (type == 2) {
            std::cout << "\033[1;34mINFO\033[0m " << msg << std::endl;
        } else if (type == 3) {
            std::cout << "\033[1;33mWARNING\033[0m " << msg << std::endl;
        } else {
            printf("\033[1;31mInvalid type in Console Logger\033[0m\n");
        }
    }

    static void Log(StatusType type, const std::string& msg, int size) {
        if (type == 0) {
            std::cout << "\033[1;32mSUCCESS\033[0m " << msg << " " << size << std::endl;
        } else if (type == 1) {
            std::cout << "\033[1;31mERROR\033[0m " << msg << " " << size << std::endl;
        } else if (type == 2) {
            std::cout << "\033[1;34mINFO\033[0m " << msg << " " << size << std::endl;
        } else {
            printf("\033[1;31mInvalid type in Console Logger\033[0m\n");
        }
    }

    static void Print(const picojson::object& data) {
        if (data.find("type") != data.end()) {
            const std::string& type = data.find("type")->second.get<std::string>();
            if (type == "actor" || type == "actee" || type == "destination") {
                const std::string& name = data.find("name")->second.get<std::string>();
                std::vector<float> position = JsonHelper::CastVector(data.find("position")->second.get<picojson::array>());
                int id = (int) data.find("entityId")->second.get<double>();
                std::cout << "\033[1;34mINFO for " << name << "\033[0m" << std::endl;
                std::cout << "\033[36mId:\033[0m       " <<  id << std::endl;
                std::cout << "\033[36mType:\033[0m     " <<  type << std::endl;
                std::cout << "\033[36mPosition:\033[0m " <<  "<" << position[0] << ", " << position[1] << ", " << position[2] << ">" << std::endl;
            }
        }
    }

};

#endif