#ifndef ANALYTICS_H_
#define ANALYTICS_H_

namespace csci3081 {
    class Analytics {
      public:
        Analytics() {}
        virtual ~Analytics() { printf("destroying analytics!\n"); }
    };
}

#endif