
#include <math.h>
#include <stdlib.h>
#include <cassert>

#ifndef VEC3_H_
#define VEC3_H_

namespace csci3081 {
    class Vec3 {
      public:
        float e[3] = {0.0f, 0.0f, 0.0f};
        const int size = 2;

        // default constructor
        Vec3(){}

        // float based constructor
        Vec3(float e0, float e1, float e2) {e[0] = e0; e[1] = e1; e[2] = e2;}

        // copy constructor
        Vec3 (const Vec3 &v) {e[0] = v.e[0]; e[1] = v.e[1]; e[2] = v.e[2];}

        Vec3 (std::vector<float> input) {
            e[0] = input.at(0);
            e[1] = input.at(1);
            e[2] = input.at(2);
        }

        Vec3& operator=(const Vec3 &v) {e[0] = v.e[0]; e[1] = v.e[1]; e[2] = v.e[2];}

        Vec3& operator=(const std::vector<float>& rhs) {
            this->e[0] = rhs.at(0);
            this->e[1] = rhs.at(1);
            this->e[2] = rhs.at(2);
            return *this;
        }

        // destructor
        ~Vec3(){}

        inline float GetX() const { return e[0]; }
        inline float GetY() const { return e[1]; }
        inline float GetZ() const { return e[2]; }

        const Vec3& operator+() const { return *this; }

        inline Vec3 operator-() const {
            return Vec3(-e[0], -e[1], -e[2]);
        }

        inline float& operator[](int x) {
            // assert(x <= 2 && x > 0);
            return e[x];
        }

        inline Vec3& operator-=(const Vec3& v) {
            e[0] -= v.e[0];
            e[1] -= v.e[1];
            e[2] -= v.e[2];
            return *this;
        }

        inline Vec3& operator*=(const Vec3& v) {
            e[0] *= v.e[0];
            e[1] *= v.e[1];
            e[2] *= v.e[2];
            return *this;
        }

        inline Vec3& operator/=(const Vec3& v) {
            e[0] /= v.e[0];
            e[1] /= v.e[1];
            e[2] /= v.e[2];
            return *this;
        }

        inline Vec3& operator*=(const float t) {
            e[0] *= t;
            e[1] *= t;
            e[2] *= t;
            return *this;
        }

        inline Vec3& operator/=(const float t) {
            e[0] *= (1.0f / t);
            e[1] *= (1.0f / t);
            e[2] *= (1.0f / t);
            return *this;
        }

        inline float Magnitude() const {
            return sqrt(e[0] * e[0] + e[1] * e[1] + e[2] * e[2]);
        }

        inline float MagnitudeSquared() const {
            return this->Magnitude() * this->Magnitude();
        }

        // given a vector, return its unit vector
        // making the unit vector in the same direction as the input vector
        inline Vec3 Normalize() {
            e[0] /= this->Magnitude();
            e[1] /= this->Magnitude();
            e[2] /= this->Magnitude();
            return *this;
        }

        inline float DistanceTo(const Vec3& b) {
            float x = pow((this->e[0] - b.e[0]), 2);
            float y = pow((this->e[1] - b.e[1]), 2);
            float z = pow((this->e[2] - b.e[2]), 2);
            return sqrt(x + y + z);
        }
    };

    // basic matrix addition,
    inline Vec3 operator+(const Vec3& v1, const Vec3& v2) {
        return Vec3(v1.e[0] + v2.e[0],
            v1.e[1] + v2.e[1],
            v1.e[2] + v2.e[2]);
    }

    // subtraction,
    inline Vec3 operator-(const Vec3& v1, const Vec3& v2) {
        return Vec3(v1.e[0] - v2.e[0],
            v1.e[1] - v2.e[1],
            v1.e[2] - v2.e[2]);
    }

    // multiplication,
    inline Vec3 operator*(const Vec3& v, const float n) {
        return Vec3(v.e[0] * n,
            v.e[1] * n,
            v.e[2] * n);
    }

    inline Vec3 operator*(const float n, const Vec3& v) {
        return Vec3(v.e[0] * n,
            v.e[1] * n,
            v.e[2] * n);
    }

    // inner product?
    inline Vec3 operator*(const Vec3& v1, const Vec3& v2) {
        return Vec3(v1.e[0] * v2.e[0],
            v1.e[1] * v2.e[1],
            v1.e[2] * v2.e[2]);
    }

    // and division
    inline Vec3 operator/(const Vec3& v, const float n) {
        return Vec3(v.e[0] / n,
            v.e[1] / n,
            v.e[2] / n);
    }

    inline Vec3 operator/(const float n, const Vec3& v) {
        return Vec3(v.e[0] / n,
            v.e[1] / n,
            v.e[2] / n);
    }

    inline Vec3 operator/ (const Vec3& v1, const Vec3& v2) {
        return Vec3(v1.e[0] / v2.e[0],
            v1.e[1] / v2.e[1],
            v1.e[2] / v2.e[2]);
    }

    inline float Distance(const Vec3& a, const Vec3& b) {
        float x = pow((a.e[0] - b.e[0]), 2);
        float y = pow((a.e[1] - b.e[1]), 2);
        float z = pow((a.e[2] - b.e[2]), 2);
        return sqrt(x + y + z);
    }

    // dot product
    inline float Dot(const Vec3& v1, const Vec3& v2) {
        return v1.e[0] * v2.e[0] +
            v1.e[1] * v2.e[1] +
            v1.e[2] * v2.e[2];
    }

    // cross product
    inline Vec3 Cross(const Vec3& v1, const Vec3& v2) {
        return Vec3((v1.e[1] * v2.e[2] - v1.e[2] * v2.e[1]),
            (-(v1.e[0] * v2.e[2] - v1.e[2] * v2.e[0])),
            (v1.e[0] * v2.e[1] - v1.e[1] * v2.e[0]));
    }
}

#endif