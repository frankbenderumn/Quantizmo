#ifndef AUTOMATIC_H_
#define AUTOMATIC_H_

#include "json_helper.h"
#include <vector>
#include <string>
#include "console.h"

namespace csci3081 {
    class Automatic : public Strategy {
      public:
        Automatic() {}
        ~Automatic() { printf("destroying entity!\n"); }
        void Move(const std::vector<float>& dir, float theta, float phi) {
            // TODO: computes actor direction so that it maintains a consistent circular path
            std::vector<float>& newDir = const_cast<std::vector<float>&>(dir);
            // may want to use vec3 class
            newDir[0] = newDir[0]
        }
    };
}

#endif