#ifndef BENCHMARK_H_
#define BENCHMARK_H_

// FOR TESTING ONLY CPPLINT THROWS C++11 ERROR
#include <chrono>  // NOLINT
#include <iostream>

namespace csci3081 {

/* @brief used to time function execution */
class Benchmark {
 public:
    void Start() {
        this->start = std::chrono::high_resolution_clock::now();
    }

    void Stop() {
        this->stop = std::chrono::high_resolution_clock::now();
        this->duration = this->stop - this->start;
        std::cout << "Time elapsed: " << this->duration.count() << std::endl;
    }

 private:
  std::chrono::high_resolution_clock::time_point start =
 std::chrono::high_resolution_clock::now();
  std::chrono::high_resolution_clock::time_point stop =
 std::chrono::high_resolution_clock::now();
  std::chrono::duration<double> duration;
};

}  // namespace csci3081
#endif