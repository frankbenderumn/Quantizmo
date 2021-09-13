#include "web_app.h"

namespace csci3081 {

void WebApp::receiveJSON(picojson::value& val) {
    picojson::object data = val.get<picojson::object>();
    std::string cmd = data["command"].get<std::string>();
    picojson::object returnValue;
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

        // printf("LINK TO BACK END ESTABLISHED!");
        // std::cout << data << std::endl;

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
    else if (cmd == "addEntity") {
//         const std::string& position = ;
//         const std::string& direction = ;
//         const std::string& name = ;
//         double radius = ;
//         double speed = ;
//         const std::string& type = ;

//           static const picojson::array& GetArray(const picojson::object& obj, std::string key) {
//       return GetValue(obj, key).get<picojson::array>();
//   }

//   static bool ContainsKey(const picojson::object& obj, std::string key) {
//       return obj.find(key) != obj.end();
//   }

//   static void PrintKeyValues(const picojson::object& obj, std::string prefix = "  ") {
//       for (picojson::object::const_iterator it = obj.begin(); it != obj.end(); it++) {
//           std::cout << prefix << it->first << ": " << it->second << std::endl;
//       }
//   }

//   static std::vector<float> CastVector(const picojson::object& obj, std::string name) {
//     std::vector<float> result(3, 0);
//     if (name == "pos") {
//       const picojson::array& jPos = GetArray(obj, "position");
//       for (int i = 0; i < jPos.size(); i++) {
//         result.at(i) = static_cast<float>(jPos[i].get<double>());
//       }
//         AddEntity();
//     }
        printf("attempting to add entity!\n");
    } else {
        std::cout << "Unknown command: " << cmd << " - " << picojson::value(data).serialize() << std::endl;
    }
}

void WebApp::Update(double dt, picojson::object& returnValue) {
}

void WebApp::KeyUp(const std::string& key, int keyCode) {
}

void WebApp::KeyDown(const std::string& key, int keyCode) {
}

}
