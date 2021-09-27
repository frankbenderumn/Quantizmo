#ifndef MANUAL_H_
#define MANUAL_H_

#include "json_helper.h"
#include <vector>
#include <string>
#include "console.h"

namespace csci3081 {
    class Manual : public Strategy {
      public:
        Manual() {}
        ~Manual() { printf("destroying entity!\n"); }
        std::vector<float> Move(const std::vector<float>& dir, float theta, float phi) {
            // TODO: computes actor direction so that it maintains a consistent circular path
        }
    };
}

#endif