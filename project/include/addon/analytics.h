#ifndef ANALYTICS_H_
#define ANALYTICS_H_

#include <string>
#include <map>
#include <vector>
#include <iostream>

namespace csci3081 {
    class Analytics {
      public:

        static Analytics* instance(){
            static Analytics *instance = new Analytics();
            std::map<std::string, std::vector<float>> cachedOutput = {};
            return instance;
        }


        //Analytics() {}
        //virtual ~Analytics() { printf("destroying analytics!\n"); }

        void WriteRuntimesToCache(const std::map<std::string, float>& runtimes){
            for (const auto& it : runtimes) {
                auto itt = GetDroneRecord(it.first);
                itt->second[COL_DRONE_RUNTIME] += it.second;
            }
        }

        // void InitCachedOutput() {
        //     //  Currently does nothing, available if some form of initialization is necessary
        // }

      private:
        // void InitCachedOutput();
        Analytics() {}

        std::map<std::string, std::vector<float>>::iterator GetDroneRecord(const std::string& drone_model)
        {
            auto it = cachedOutput.find(drone_model);
            if (it == cachedOutput.end()){
                cachedOutput.insert({drone_model, std::vector<float>(NUM_DATA_COLUMNS, 0.0)});
                it = cachedOutput.find(drone_model);
            }
            it->second.reserve(NUM_DATA_COLUMNS);
            return it;
        }

        /**
        * Map representing cached output csv. Format:\n
        *  key -> model\n
        *  val -> number of Packages, distance travelled, etc.\n
        */
        static std::map<std::string, std::vector<float>> cachedOutput;

        enum columnIndices {  // List of data columns in output CSV file.
            //COL_NUM_PACKAGES_DELIVERED,
            COL_DRONE_RUNTIME,
            //COL_DISTANCE_TRAVELLED,
            //COL_SPIN,
            NUM_DATA_COLUMNS  // This will evaluate correctly on any standards-compliant compiler provided
        };                  // that no enums have explicitly defined values.

        const std::string columnTitles = "Drone, Drone Runtime (seconds)\n";
                //"Drone, Packages Delivered, Drone Runtime (seconds), Drone Distance Travelled (meters), Total Spin (rad)\n";
    };
}

#endif