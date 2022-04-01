#ifndef IEX_H_
#define IEX_H_

#include <picojson.h>
#include "util/api.h"
#include "util/parser/json_parser.h"

class Iex {
  public:
    Iex(std::string token) {
        _token = token;
    }

    ~Iex() {
        printf("deleting iex client\n");
    }

    // picojson::value Parse(const std::string& response) {
    //     picojson::value iex;
    //     std::string err = picojson::parse(iex, response);
    //     if (!err.empty()) {
    //         std::cerr << err << std::endl;
    //     } else {
    //         printf("fin data parsed\n");
    //     }
    //     return iex;
    // }

    picojson::value Quote(const std::string ticker) {
        if (Validate()) {
            std::string route = "stock/" + ticker + "/quote";
            picojson::value result = JsonParser::Parse(Api::Get(_base, route, _token));
            return result;
        }
    }

    // // std::string base = "https://sandbox.iexapis.com/stable/stock/aapl/quote?token=";
    // std::string base = "https://sandbox.iexapis.com/stable/stock/aapl/chart/1m/20211201?token=";

    picojson::value Historical(const std::string ticker, const std::string range, const std::string date) {
        if (Validate()) {
            std::string route = "stock/" + ticker + "/chart/" + range + "/" + date;
            picojson::value result = JsonParser::Parse(Api::Get(_base, route, _token));
            return result;
        }
    }

  private:
    bool Validate() {
        return (_token != "undefined");
    }
    std::string _base = "https://sandbox.iexapis.com/stable/";
    std::string _token = "undefined";
};

#endif