#ifndef API_H_
#define API_H_

#include <curl/curl.h>
#include "util/console.h"

#define LOG_FAIL Console::Log(FAILURE,

class Api {
  public:

    static size_t WriteCallback(char *contents, size_t size, size_t nmemb, void *userp) {
        ((std::string*)userp)->append((char*)contents, size * nmemb);
        return size * nmemb;
    }

    static const std::string Get(const std::string url, const std::string route, const std::string token) {
        try {
            CURL *curl;
            CURLcode res;
            // // std::string base = "https://sandbox.iexapis.com/stable/stock/aapl/quote?token=";
            // std::string base = "https://sandbox.iexapis.com/stable/stock/aapl/chart/1m/20211201?token=";
            // std::string base = url;
            std::string base = url;
            base += route;
            base += "?token=";
            base += token;
            // Console::Log(INFO, "Base");
            // std::cout << base << std::endl;
            std::string response;
            curl = curl_easy_init();
            if(curl) {
                curl_easy_setopt(curl, CURLOPT_URL, base.c_str());

                /* example.com is redirected, so we tell libcurl to follow redirection */
                curl_easy_setopt(curl, CURLOPT_FOLLOWLOCATION, 1L);
                curl_easy_setopt(curl, CURLOPT_WRITEFUNCTION, WriteCallback);
                curl_easy_setopt(curl, CURLOPT_WRITEDATA, &response);
                // dangerous to add... but iex not responding without it
                curl_easy_setopt(curl, CURLOPT_SSL_VERIFYPEER, false);

                /* Perform the request, res will get the return code */
                res = curl_easy_perform(curl);
                /* Check for errors */
                if(res != CURLE_OK)
                fprintf(stderr, "curl_easy_perform() failed: %s\n",
                        curl_easy_strerror(res));


                /* always cleanup */
                curl_easy_cleanup(curl);
                Console::Log(SUCCESS, "Curl retrieved!");
                // std::cout << response << std::endl;
                return response;
            } else {
                Console::Log(FAILURE, "Invalid Curl call");
            }
        }
        
        catch (std::exception const &e) {
            LOG_FAIL "Api:Parse -- Failed to parse");
            std::cerr << e.what() << '\n';
        }
    }
};

#endif 