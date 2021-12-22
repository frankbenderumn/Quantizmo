/**
Copyright (c) 2019 Dan Orban
*/

#include <iostream>
#include <map>
#include "util/debug/console.h"
#include "web_app.h" 
#include <curl/curl.h>
#include <util/api.h>
#include <pqxx/pqxx>
// #include "financial/iex.h"
#include <fstream>
#include "db/database.h"
#include <iterator>
#include <sstream>
#include <string_view>
#include <unistd.h>
// #include <opencv2/opencv.hpp>

enum DataType { OBJECT, ARRAY, UNDEFINED_DATA };

int main(int argc, char**argv) {
    if (argc > 1) {

        // pqxx::connection* C;
        Database* db = new Database();
        // db->GetTable("stocks");

#ifdef DEBUG
    printf("--------------------------------\n");
    printf("            DEBUGGING           \n");
    printf("--------------------------------\n");
#endif


        // try {
        //     // Connect to the database.
        //     std::cout << "Connected to " << C->dbname() << '\n';

        //     // Start a transaction.
        //     pqxx::work W{*C};

        //     // Perform a query and retrieve all results.
        //     pqxx::result R{W.exec("SELECT name FROM stock")};

        //     // Iterate over results.
        //     std::cout << "Found " << R.size() << "employees:\n";
        //     for (auto row: R)
        //         std::cout << row[0].c_str() << '\n';

        //     // Perform a query and check that it returns no result.
        //     std::cout << "Doubling all employees' salaries...\n";
        //     W.exec("UPDATE employee SET salary = salary*2");

        //     // Commit the transaction.
        //     std::cout << "Making changes definite: ";
        //     W.commit();
        //     std::cout << "OK.\n";
        // }
        
        // catch (std::exception const &e) {
        //     std::cerr << e.what() << '\n';
        //     return 1;
        // }

        // std::string token = "Tpk_f83b0edb1ba24de8b19d58d61ddf13dc";
        // Iex* client = new Iex(token);
        // picojson::value iex = client->Quote("AAPL");

        // if (iex.is<picojson::array>()) {
        //     Console::Log(SUCCESS, "iex data is an array");
        //     picojson::array arr = iex.get<picojson::array>();
        //     std::cout << "array size of: " << arr.size() << std::endl;
        //     int iteration = 0;
        //     for (int i = 0; i < arr.size(); i++) {
        //         int prefix = 0;
        //         // std::cout << "Iteration -- " << iteration << std::endl;
        //         if (arr[i].is<picojson::object>()) {
        //             picojson::object o = arr[i].get<picojson::object>();
        //             for (picojson::object::const_iterator it = o.begin(); it != o.end(); it++) {
        //                 // std::cout << prefix << " --- " << it->first << ": " << it->second << std::endl;
        //                 prefix++;
        //             }
        //             // std::cout << std::endl;
        //             iteration++;

        //         } else {
        //             std::cout << "is not an object" << std::endl;
        //         }
        //     }
        // } else if (iex.is<picojson::object>()) {
        //     Console::Log(SUCCESS, "iex data is an object");
        //     picojson::object o = iex.get<picojson::object>();
        //     int prefix = 0;
        //     for (picojson::object::const_iterator it = o.begin(); it != o.end(); it++) {
        //         // std::cout << prefix << " --- " << it->first << ": " << it->second << std::endl;
        //         prefix++;
        //     }
        // } else {
        //     Console::Log(FAILURE, "Invalid picojson data from iex");
        // }

        // delete client;

        int port = std::atoi(argv[1]);
        std::string webDir = std::string(argv[2]);
        WebServer<WebApp> server(port, webDir);
        while (true) {
            server.service();
        }
    
    }
    else {
        std::cout << "Usage: ./bin/ExampleServer 8081 web" << std::endl;
    }
   

    return 0;
}

