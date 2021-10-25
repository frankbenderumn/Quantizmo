#ifndef IMAGE_H_
#define IMAGE_H_

#include <string>
using namespace std;

namespace csci3081 {

class Color {
public:
    Color(float r, float g, float b, float a);

    float red() const;
    float green() const;
    float blue() const;
    float alpha() const;

    float getLuminance() const;
    Color clamp(float min, float max) const;
    static float clamp(float val, float min, float max);
    Color opaque() const;

    Color m_sqrt() const;
    Color m_atan2(Color c) const;

    Color operator*(float f) const;
    Color operator/(float f) const;
    Color operator*(Color c) const;
    Color operator+(Color c) const;
    Color operator+(float f) const;

private:
    float r,g,b,a;
};

//class Blob {
//public:
//    Blob(float r, float g, float b);
//
//    void setPerimeter(const unsigned char* perimeter);
//    void setBody(const unsigned char* body);
//    void getPerimeter();
//    void getPerimeterLength();
//    void getArea();
//
//private:
//    unsigned char* perimeter;
//    unsigned char* body;
//    Color primaryColor = Color(0,0,0,0);
//    int perimeterLength;
//    int area;
//};

class Image {
public:
    // constructors
    Image();
    Image(string filename);
    Image(int width, int height);
    Image(const Image& image);
    ~Image();

    // methods
    int getWidth() const;
    int getHeight() const;
    void saveAs(string filename, bool asFloat = false) const;

    Color getPixel(int x, int y) const;
    void setPixel(int x, int y, Color color);
    float getPixelFloat(int x, int y) const;
    void setPixelFloat(int x, int y, float value);

    Color getFloatAsColor(int x, int y) const;
    void charImageToFloatImage();
    void floatImageToCharImage();

    void hypot(const Image& imageY, Image& result) const; // calculates sqrt(x^2 + y^2) between each pixel in the two images and returns an image of the results
    void m_atan2(const Image& image, Image& result) const;
//    void intensity(Image& result) const;
    void normalize(bool asFloat = false);
    int getNumBrightPixels(float thresh) const;
    // operators
    void operator=(const Image &image);
    Image operator*(float val) const;

private:
    int width;
    int height;
    unsigned char* pixels;
};



class Kernel {
public:
    Kernel();
    ~Kernel();

    void setSize(int size);
    float getValue(int x, int y) const;
    void setValue(int x, int y, float val);

    void convolv(const Image& image, Image& filtered, bool asFloat = false) const;

private:
    int size;
    float* kernel;
};

}

#endif // IMAGE_H_