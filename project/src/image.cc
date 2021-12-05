#include "image/image.h"

#include <algorithm>
#include <cmath>

// #define STB_IMAGE_IMPLEMENTATION
#include "image/stb_image.h"

// #define STBI_MSC_SECURE_CRT
// #define STB_IMAGE_WRITE_IMPLEMENTATION
#include "image/stb_image_write.h"

Color::Color(float r, float g, float b, float a) : r(r), g(g), b(b), a(a) {
}

float Color::red() const { return r; }

float Color::green() const { return g; }

float Color::blue() const { return b; }

float Color::alpha() const { return a; }

float Color::getLuminance() const { return 0.2126*r + 0.7152*g + 0.0722*b; }

float Color::clamp(float val, float min, float max){
    if (val < min) return min;
    if (val > max) return max;
    return val;
}

Color Color::clamp(float min, float max) const {
        float nr = abs(r), ng = abs(g), nb = abs(b), na = abs(a);
        if (nr < min) { nr = min; }
        if (ng < min) { ng = min; }
        if (nb < min) { nb = min; }
        if (na < min) { na = min; }

        if (nr > max) { nr = max; }
        if (ng > max) { ng = max; }
        if (nb > max) { nb = max; }
        if (na > max) { na = max; }
        return Color(nr, ng, nb, na);
}

Color Color::opaque() const { return Color(r, g, b, 1); }

Color Color::operator*(float f) const { return Color(f*r, f*g, f*b, f*a); }

Color Color::operator*(Color c) const { return Color(c.r*r, c.g*g, c.b*b, c.a*a); }

Color Color::operator/(float f) const { return Color(r/f, g/f, b/f, a/f); }

Color Color::operator+(Color c) const { return Color(r + c.r, g + c.g, b + c.b, a + c.a); }

Color Color::operator+(float f) const { return Color(r + f, g + f, b + f, a + f); }

Color Color::m_sqrt() const { return Color(sqrt(r), sqrt(g), sqrt(b), sqrt(a)); }

Color Color::m_atan2(Color c) const {
    return Color(atan2(r, c.r), atan2(g, c.g), atan2(b, c.b), atan2(a, c.a));
}

Image::Image() : width(0), height(0), pixels(NULL) {
}

Image::Image(string filename) {
    int components;
	unsigned char *data = stbi_load(filename.c_str(), &width, &height, &components, STBI_rgb_alpha);
	components = 4;
	pixels = new unsigned char[width*height*components];
	std::copy(data, data+width*height*components, pixels);
	stbi_image_free(data);
}

Image::Image(int width, int height) : width(width), height(height) {
    pixels = new unsigned char[width*height*4];
}

Image::Image(const Image& image) : pixels(NULL) {
    *this = image;
}

int Image::getNumBrightPixels(float thresh) const {
    int count = 0;
    for (int i = 0; i < this->width; ++i){
        for (int j = 0; j < this->height; ++j){
            Color p = this->getPixel(i,j);
            if (p.red() >= thresh && p.green() >= thresh && p.blue() >= thresh){
                ++count;
            }
        }
    }
    return count;
}

void Image::operator=(const Image &image) {
    if (pixels) {
        delete[] pixels;
    }
    width = image.width;
    height = image.height;
    pixels = new unsigned char[width*height*4];
    std::copy(image.pixels, image.pixels+width*height*4, pixels);
}

Image Image::operator*(float val) const {
    Image result;
    result = *this;
    for (int i = 0; i < this->width; ++i){
        for (int j = 0; j < this->height; ++j){
            result.setPixel(i,j, this->getPixel(i,j) * val);
        }
    }
    return result;
}

Image::~Image() {
    delete[] pixels;
}

int Image::getWidth() const {
    return width;
}

int Image::getHeight() const {
    return height;
}

Color Image::getPixel(int x, int y) const {

    if (x < 0) { x = 0; }
    if (x >= width) { x = width - 1; }
    if (y < 0) { y = 0; }
    if (y >= height) { y = height - 1; }

    unsigned char* pixel = &pixels[(x + width*y)*4];
    Color c(
            1.0* pixel[0] / 255.0, // red
            1.0* pixel[1] / 255.0, // green
            1.0* pixel[2] / 255.0, // blue
            1.0* pixel[3] / 255.0 // alpha);
         );
    return c;
 /*   return Color(
        );*/
}

void Image::setPixel(int x, int y, Color color) {
    unsigned char* pixel = &pixels[(x + width*y)*4];
    pixel[0] = color.red() *255.0;
    pixel[1] = color.green() *255.0;
    pixel[2] = color.blue() *255.0;
    pixel[3] = color.alpha() *255.0;
}

float Image::getPixelFloat(int x, int y) const {
    if (x < 0) { x = 0; }
    if (x >= width) { x = width - 1; }
    if (y < 0) { y = 0; }
    if (y >= height) { y = height - 1; }

    unsigned char* pixel = &pixels[(x + width*y)*4];
    return *reinterpret_cast<float*>(pixel);
}
void Image::setPixelFloat(int x, int y, float value){
    unsigned char* pixel = &pixels[(x + width*y)*4];
    *reinterpret_cast<float*>(pixel) = value;
}

void Image::hypot(const Image& imageY, Image& result) const {
    result = imageY;

    for (int i = 0; i < width; ++i){
        for (int j = 0; j < height; ++j){

            float value = (this->getPixelFloat(i,j) * this->getPixelFloat(i,j) + imageY.getPixelFloat(i,j) * imageY.getPixelFloat(i,j));
            Color hypot = Color(value, value, value, 1);


            hypot = hypot.m_sqrt();
            result.setPixelFloat(i, j, hypot.red());
        }
    }
}

void Image::m_atan2(const Image& image, Image& result) const {
    result = image;
    for (int i = 0; i < image.getWidth(); ++i){
        for (int j = 0; j < image.getHeight(); ++j){

            result.setPixelFloat(i,j, atan2(this->getPixelFloat(i,j), image.getPixelFloat(i,j)));

        }
    }
}

void Image::normalize(bool asFloat){
    float maxR = 0;
    float maxG = 0;
    float maxB = 0;
    float maxA = 0;
    for (int i = 0; i < width; ++i){
        for (int j = 0; j < height; ++j){
            float thisMaxR, thisMaxG, thisMaxB, thisMaxA;
            if (asFloat){
                thisMaxR = this->getPixelFloat(i,j);
                thisMaxG = this->getPixelFloat(i,j);
                thisMaxB = this->getPixelFloat(i,j);
                thisMaxA = this->getPixelFloat(i,j);
            }
            else{
                thisMaxR = this->getPixel(i,j).red();
                thisMaxG = this->getPixel(i,j).green();
                thisMaxB = this->getPixel(i,j).blue();
                thisMaxA = this->getPixel(i,j).alpha();
            }
            if (thisMaxR > maxR){
                maxR = thisMaxR;
            }
            if (thisMaxG > maxG){
                maxG = thisMaxG;
            }
            if (thisMaxB > maxB){
                maxB = thisMaxB;
            }
            if (thisMaxA > maxA){
                maxA = thisMaxA;
            }
        }
    }
    for (int i = 0; i < width; ++i){
        for (int j = 0; j < height; ++j){
            if (asFloat){
                float current = this->getPixelFloat(i,j);
                this->setPixelFloat(i,j,current/maxR);
            } else{
                Color current = this->getPixel(i,j);
                this->setPixel(i,j, Color(current.red() / maxR, current.green() / maxG, current.blue() / maxB, 1));
            }
        }
    }
}
Color Image::getFloatAsColor(int x, int y) const{
    unsigned char* pixel = &pixels[(x + width*y)*4];
    float val = *reinterpret_cast<float*>(pixel);
    return Color(val,val,val,1);
}

void Image::charImageToFloatImage(){
    for (int i=0; i < width; ++i){
        for (int j=0; j < height; ++j){
            Color c = this->getPixel(i,j);
            this->setPixelFloat(i,j,c.red());
        }
    }
}
void Image::floatImageToCharImage() {
    for (int i=0; i < width; ++i){
        for (int j=0; j < height; ++j){
            float c = this->getPixelFloat(i,j);
            this->setPixel(i,j,Color(c,c,c,1));
        }
    }
}

void Image::saveAs(string filename, bool asFloat) const{
    if (asFloat){

        unsigned char* tmp = new unsigned char[width*height*4];
        for (int x = 0; x < this->getWidth(); x++) {
            for (int y = 0; y < this->getHeight(); y++) {
                float val = this->getPixelFloat(x, y);

                unsigned char* pixel = &tmp[(x + width*y)*4];
                Color color(val, val, val, 1);
                color = color.clamp(0, 1);

                pixel[0] = color.red() *255.0;
                pixel[1] = color.green() *255.0;
                pixel[2] = color.blue() *255.0;
                pixel[3] = 255.0;
            }
        }
        stbi_write_png(filename.c_str(), width, height, 4, tmp, width*4);
    } else {
        stbi_write_png(filename.c_str(), width, height, 4, pixels, width*4);
    }
}

Kernel::Kernel() : size(0), kernel(NULL) {
}

Kernel::~Kernel() {
    if (kernel) {
        delete[] kernel;
    }
}

void Kernel::setSize(int size) {
    this->size = size;
    if (kernel) {
        delete[] kernel;
    }

    kernel = new float[size*size];
}

float Kernel::getValue(int x, int y) const {
    return kernel[x + size*y];
}

void Kernel::setValue(int x, int y, float val) {
    kernel[x + size*y] = val;
}

void Kernel::convolv(const Image& image, Image& filtered, bool asFloat) const{
    for (int x = 0; x < image.getWidth(); x++) {
        for (int y = 0; y < image.getHeight(); y++) {

            Color pixelColor(0,0,0,0);
            // calculate pixel value

            for (int i = 0; i < size; ++i) {
                for (int j =0; j < size; ++j) {
                    if (asFloat)
                        pixelColor = pixelColor + image.getPixelFloat(x+i - size/2, y+j - size/2)*getValue(i, j);
                    else
                        pixelColor = pixelColor + image.getPixel(x+i - size/2, y+j - size/2)*getValue(i, j);
                }
            }

            if (asFloat)
                filtered.setPixelFloat(x, y, pixelColor.red());
            else
                filtered.setPixel(x, y, pixelColor.opaque());

        }
    }
}