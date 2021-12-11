#ifndef JSON_PARSER_H_
#define JSON_PARSER_H_

#include <picojson.h>
#include <sstream>
#include <string>
// #include <iostream>

class JsonParser {
  public:
    static picojson::value Parse(const std::string& path) {
        picojson::value data;
        std::string err = picojson::parse(data, path);
        if (!err.empty()) {
            std::cerr << err << std::endl;
        } else {
            printf("json data parsed\n");
        }
        return data;
    }

    static picojson::value Read(const std::string& path) {
        std::ifstream nodes(path);
        std::stringstream buf;
        buf << nodes.rdbuf();
        std::string json = buf.str();
        return Parse(json);
    }
};

#endif