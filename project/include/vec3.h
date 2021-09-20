
#include <math.h>
#include <stdlib.h>

#ifndef VEC3_H_
#define VEC3_H_

namespace csci3081 {
    class Vec3 {
      public:
        float e[3] = {0.0f, 0.0f, 0.0f};

        // default constructor
        Vec3(){}

        // float based constructor
        Vec3(float e0, float e1, float e2) {e[0] = e0; e[1] = e1; e[2] = e2;}

        // copy constructor
        Vec3 (const Vec3 &v) {e[0] = v.e[0]; e[1] = v.e[1]; e[1] = v.e[2];}

        Vec3 &operator= (const Vec3 &v) {e[0] = v.e[0]; e[1] = v.e[1]; e[1] = v.e[2];}

        // destructor
        ~Vec3(){}

        inline float x() const { return e[0]; }
        inline float y() const { return e[1]; }
        inline float z() const { return e[2]; }

        inline float r() const { return e[0]; }
        inline float g() const { return e[1]; }
        inline float b() const { return e[2]; }

        const Vec3& operator+() const { return *this; }

        inline Vec3 operator-() const {
            return Vec3(-e[0], -e[1], e[2]);
        }

        inline float operator[](int x) const {
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

        inline float Length() const {
            return sqrt(e[0] * e[0] + e[1] * e[1] + e[2] * e[2]);
        }

        inline float SquaredLength() const {
            return this->Length() * this->Length();
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

    // given a vector, return its unit vector
    // making the unit vector in the same direction as the input vector
    inline Vec3 Normalize(Vec3 v) {
        return v / v.Length();
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