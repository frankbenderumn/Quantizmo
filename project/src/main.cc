/**
Copyright (c) 2019 Dan Orban
*/

#include <iostream>
#include <map>
#include "web_app.h" 
#include <curl/curl.h>
#include <pqxx/pqxx>
// #include <opencv2/opencv.hpp>

using namespace csci3081;

enum DataType { OBJECT, ARRAY, UNDEFINED_DATA };

class JsonParser {
    static DataType read() {

    }
};

// struct MemoryStruct {
//     char* memory;
//     size_t size;
// };

// size_t WriteMemoryCallback(void* contents, size_t size, size_t nmemb, void* userp) {
//     size_t realsize = size* nmemb;
//     struct MemoryStruct* mem = (struct MemoryStruct*)userp;

//     char *ptr = realloc(mem->memory, mem->size + realsize + 1);
//     if(ptr == NULL) {
//         printf("error: not enough memory\n");
//         return 0;
//     }

//     mem->memory = ptr;
//     memcpy(&(mem->memory[mem->size]), contents, realsize);
//     mem->size += realsize;
//     mem->memory[mem->size] = 0;

//     return realsize;
// }

int main(int argc, char**argv) {
    if (argc > 1) {

        try {
            // Connect to the database.
            pqxx::connection C;
            std::cout << "Connected to " << C.dbname() << '\n';

            // Start a transaction.
            pqxx::work W{C};

            // Perform a query and retrieve all results.
            pqxx::result R{W.exec("SELECT name FROM employee")};

            // Iterate over results.
            std::cout << "Found " << R.size() << "employees:\n";
            for (auto row: R)
                std::cout << row[0].c_str() << '\n';

            // Perform a query and check that it returns no result.
            std::cout << "Doubling all employees' salaries...\n";
            W.exec("UPDATE employee SET salary = salary*2");

            // Commit the transaction.
            std::cout << "Making changes definite: ";
            W.commit();
            std::cout << "OK.\n";
        } catch (std::exception const &e) {
            std::cerr << e.what() << '\n';
            return 1;
        }

        CURL *curl;
        CURLcode res;

        curl = curl_easy_init();
        if(curl) {
            curl_easy_setopt(curl, CURLOPT_URL, "http://www.google.com/search?q=curl");

            /* example.com is redirected, so we tell libcurl to follow redirection */
            curl_easy_setopt(curl, CURLOPT_FOLLOWLOCATION, 1L);

            /* Perform the request, res will get the return code */
            res = curl_easy_perform(curl);
            /* Check for errors */
            if(res != CURLE_OK)
            fprintf(stderr, "curl_easy_perform() failed: %s\n",
                    curl_easy_strerror(res));

            /* always cleanup */
            curl_easy_cleanup(curl);
            Console::Log(SUCCESS, "Curl retrieved!");
            std::cout << res << std::endl;
        }


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

