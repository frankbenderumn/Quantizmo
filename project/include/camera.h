#ifndef CAMERA_H_
#define CAMERA_H_

namespace csci3081 {
    class Camera {
        Camera() {}
        virtual ~Camera() { printf("destroying entity!\n"); }
    };
}

#endif