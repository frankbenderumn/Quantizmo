#ifndef FILTER_H_
#define FILTER_H_

#define M_PI           3.14159265358979323846  /* pi */

#include "image.h"
#include <fstream>
#include <math.h>
#include <vector>

namespace csci3081 {

class Filter{
public:
    virtual std::vector<Image*> apply(std::vector<Image*> original) = 0;
};

class ThresholdFilter: public Filter{
public:
    ThresholdFilter(float x) {
        val = x;
    }
    std::vector<Image*> apply(std::vector<Image*> original) override {
        Image filtered = *original[0];

        for (int x = 0; x < original[0]->getWidth(); x++) {
            for (int y = 0; y < original[0]->getHeight(); y++) {
                if (original[0]->getPixel(x, y).getLuminance() < val) {
                    filtered.setPixel(x,y, Color(0,0,0,1));
                }
                else {
                    filtered.setPixel(x,y, Color(1,1,1,1));

                }
            }
        }
        std::vector<Image*> list = {&filtered};
        return list;
    }
private:
    float val;
};

class GaussianBlurFilter: public Filter {
public:
    GaussianBlurFilter(int size, float sigma){
        if (size % 2 == 0){ // can't have an even size gauss kernel, needs to be odd
            std::cout << "Error: Gaussian kernel size must be odd, adding 1 to make a kernal of size " << size + 1 << std::endl;
            size = size + 1;
        }
        gauss_kernel.setSize(size);
        std::cout << "gauss kernel: " << std::endl;
        for (int i = 0; i < size; ++i){
            for (int j = 0; j < size; ++j){
                float xsquare = pow(i - ((size - 1)/2), 2);
                float ysquare = pow(j - ((size - 1)/2), 2);
                float val = 1.0 / (2.0 * M_PI * pow(sigma, 2)) * exp(-1.0 * (xsquare + ysquare)/(2.0 * pow(sigma, 2)));
                gauss_kernel.setValue(i,j,val);
                std::cout << val << ", ";
            }
            std::cout<<std::endl;
        }
    }
    std::vector<Image*> apply(std::vector<Image*> original) override {
        Image filtered = *original[0];
        gauss_kernel.convolv(*original[0], filtered);
        std::vector<Image*> list = {&filtered};
        return list;
    }
private:
    Kernel gauss_kernel;
};

class GreyScaleFilter: public Filter {
public:
    GreyScaleFilter(){}
    std::vector<Image*> apply(std::vector<Image*> original) override {
        Image filtered = *original[0];
        float max = 0;
        for (int i = 0; i < original[0]->getWidth(); ++i){
            for (int j = 0; j < original[0]->getHeight(); ++j){
                Color p = original[0]->getPixel(i,j);
                float thisValue = (p.red() + p.green() + p.blue()) * p.alpha();
                if (thisValue > max){
                    max = thisValue;
                }
            }
        }
        for (int i = 0; i < original[0]->getWidth(); ++i){
            for (int j = 0; j < original[0]->getHeight(); ++j){
                Color p = original[0]->getPixel(i,j);
                float thisValue = (((p.red() + p.green() + p.blue()) * p.alpha())/max);
                filtered.setPixel(i,j, Color(thisValue, thisValue, thisValue, 1));
            }
        }
        std::vector<Image*> list = {&filtered};
        return list;
    }

};

class ColorFilter: public Filter{
public:
    ColorFilter(float r, float g, float b, float dist){
        cout << r << g << b << endl;
        c = Color(r,g,b,1);
        this->dist = dist;
    }
    std::vector<Image*> apply(std::vector<Image*> original) override{
        Image filtered = *original[0];
        for (int i = 0; i < filtered.getWidth(); ++i){
            for (int j = 0; j < filtered.getHeight(); ++j){
                Color p = original[0]->getPixel(i,j);
                if (c.red() - dist <= p.red() && p.red() <= c.red() + dist &&
                    c.green() - dist <= p.green() && p.green() <= c.green() + dist &&
                    c.blue() - dist <= p.blue() && p.blue() <= c.blue() + dist){
                    filtered.setPixel(i,j, Color(1,1,1,1));
                } else{
                    filtered.setPixel(i,j,Color(0,0,0,1));
                }
            }
        }
        std::vector<Image*> list = {&filtered};
        return list;
    }
private:
    Color c = Color(0,0,0,0);
    float dist = 0;
};

class SobelFilter: public Filter {
public:
    SobelFilter(){
        kernelX.setSize(3);
        int kernelXValues[3][3] = {{1, 0, -1},
                                   {2, 0, -2},
                                   {1, 0, -1}};
        for (int i = 0; i < 3; ++i){
            for (int j = 0; j < 3; ++j){
                kernelX.setValue(i,j, (float)kernelXValues[i][j]);
            }
        }
        kernelY.setSize(3);
        int kernelYValues[3][3] = {{1, 2, 1},
                                   {0, 0, 0},
                                   {-1, -2, -1}};
        for (int i = 0; i < 3; ++i){
            for (int j = 0; j < 3; ++j){
                kernelY.setValue(i,j, (float)kernelYValues[i][j]);
            }
        }

    }
    std::vector<Image*> apply(std::vector<Image*> original) override{
        Image filtered1 = *original[0];
        Image filtered2 = *original[0];
        Image iX = *original[0];
        Image iY = *original[0];
        Image intensity = *original[0];
        Image direction = *original[1];

        iX.charImageToFloatImage();
        iY.charImageToFloatImage();
        original[0]->charImageToFloatImage();

        kernelX.convolv(*original[0], iX, true);
        kernelY.convolv(*original[0], iY, true);

        iX.saveAs("data/results/statue_iX.png", true);
        iY.saveAs("data/results/statue_iY.png", true);

        iX.hypot(iY, intensity);
        iY.m_atan2(iX, direction);

        intensity.normalize(true);
        direction.normalize(true);

        filtered1 = intensity;
        filtered2 = direction;

        std::vector<Image*> list = {&filtered1, &filtered2};
        return list;


    }
private:
    Kernel kernelX;
    Kernel kernelY;
};

class NonMaxSuppressionFilter: public Filter {
public:
    NonMaxSuppressionFilter() = default;
    std::vector<Image*> apply(std::vector<Image*> original) override{ // (intensity, direction), (filtered)
        Image filtered = *original[0];
        Image intensity = *original[0];
        Image direction = *original[1];

        for (int i = 0; i < filtered.getWidth(); ++i){
            for (int j = 0; j < filtered.getHeight(); ++j){

                float x1 = 1;
                float x2 = 1;

                float this_angle = direction.getPixelFloat(i,j) * 180.0/M_PI; // each channel is the angle
                if (this_angle < 0) this_angle += 180;
                float this_inten = intensity.getPixelFloat(i,j); // each channel is the intensity


                // 0*
                if ((this_angle >= 0 && this_angle < 22.5) || (this_angle >= 157.5 && this_angle <= 180)){
                        x1 = intensity.getPixelFloat(i, j+1);
                        x2 = intensity.getPixelFloat(i, j-1);
                }
                    // 45*
                else if (this_angle >= 22.5 && this_angle < 67.5){
                        x1 = intensity.getPixelFloat(i+1, j-1);
                        x2 = intensity.getPixelFloat(i-1, j+1);
                }
                    // 90*
                else if (this_angle >= 67.5 && this_angle < 112.5){
                        x1 = intensity.getPixelFloat(i+1, j);
                        x2 = intensity.getPixelFloat(i-1, j);
                }
                    // 135*
                else if (this_angle >= 112.5 && this_angle < 157.5){
                        x1 = intensity.getPixelFloat(i-1, j-1);
                        x2 = intensity.getPixelFloat(i+1, j+1);
                }


                if (this_inten >= x1 && this_inten >= x2){
                    filtered.setPixelFloat(i,j, intensity.getPixelFloat(i,j));
                } else{
                    filtered.setPixelFloat(i,j,0);
                }
            }
        }
        std::vector<Image*> list = {&filtered};
        return list;
    }
};

class DoubleThreshFilter: public Filter {
public:
    DoubleThreshFilter(float lowThreshRatio, float highThreshRatio, float strong, float weak){
        this->lowThreshRatio = lowThreshRatio;
        this->highThreshRatio = highThreshRatio;
        this->strong = strong;
        this->weak = weak;
    }
    std::vector<Image*> apply(std::vector<Image*> original) override {
        Image filtered = *original[0];
        float max = 0;

        for (int i = 0; i < original[0]->getWidth(); ++i){
            for (int j = 0; j < original[0]->getHeight(); ++j){
                float current = original[0]->getPixelFloat(i,j);
                if (current > max){
                    max = current;
                }
            }
        }

        float highThresh = max * highThreshRatio;
        float lowThresh = highThresh * lowThreshRatio;

        for (int i = 0; i < original[0]->getWidth(); ++i){
            for (int j = 0; j < original[0]->getHeight(); ++j){
                float current = original[0]->getPixelFloat(i,j);
                if (current >= highThresh){
                    filtered.setPixel(i,j, Color(strong, strong, strong, 1));
                } else if (current >= lowThresh && current < highThresh){
                    filtered.setPixel(i,j, Color(weak, weak, weak, 1));
                }
                else{
                    filtered.setPixel(i,j, Color(0, 0, 0, 1));
                }
            }
        }
        std::vector<Image*> list = {&filtered};
        return list;
    }
private:
    float lowThreshRatio;
    float highThreshRatio;
    float strong;
    float weak;
};

class HysteresisFilter: public Filter {
public:
    HysteresisFilter(float strong, float weak){
        this->strong = strong;
        this->weak = weak;
    }
    std::vector<Image*> apply(std::vector<Image*> original) override {

        Image filtered = *original[0];

        for (int i = 0; i < original[0]->getWidth(); ++i) {
            for (int j = 0; j < original[0]->getHeight(); ++j) {
                if (original[0]->getPixel(i,j).red() > 0 && original[0]->getPixel(i,j).red() <= weak){
                    if ((i - 1 > 0 && j - 1 > 0) && (original[0]->getPixel(i-1,j-1).red() > weak && original[0]->getPixel(i-1,j-1).red() <= strong)){ // sw corner
                        filtered.setPixel(i,j, Color(1,1,1,1));
                    }
                    else if ((i - 1 > 0) && (original[0]->getPixel(i-1,j).red() > weak && original[0]->getPixel(i-1,j).red() <= strong)){ // west
                        filtered.setPixel(i,j, Color(1,1,1,1));
                    }
                    else if ((i - 1 > 0 && j + 1 <= original[0]->getHeight()) && (original[0]->getPixel(i-1,j+1).red() > weak && original[0]->getPixel(i-1,j+1).red() <= strong)){ // nw corner
                        filtered.setPixel(i,j, Color(1,1,1,1));
                    }
                    else if ((j + 1 <= original[0]->getHeight()) && (original[0]->getPixel(i,j+1).red() > weak && original[0]->getPixel(i,j+1).red() <= strong)){ // north
                        filtered.setPixel(i,j, Color(1,1,1,1));
                    }
                    else if ((i + 1 <= original[0]->getWidth() && j + 1 <= original[0]->getHeight()) && (original[0]->getPixel(i+1,j+1).red() > weak && original[0]->getPixel(i+1,j+1).red() <= strong)){ // ne corner
                        filtered.setPixel(i,j, Color(1,1,1,1));
                    }
                    else if ((i + 1 <= original[0]->getWidth()) && (original[0]->getPixel(i+1,j).red() > weak && original[0]->getPixel(i+1,j).red() <= strong)){ // east
                        filtered.setPixel(i,j, Color(1,1,1,1));
                    }
                    else if ((i + 1 <= original[0]->getWidth() && j - 1 > 0) && (original[0]->getPixel(i+1,j-1).red() > weak && original[0]->getPixel(i+1,j-1).red() <= strong)){ // se corner
                        filtered.setPixel(i,j, Color(1,1,1,1));
                    }
                    else if ((j - 1 > 0) && (original[0]->getPixel(i,j-1).red() > weak && original[0]->getPixel(i,j-1).red() <= strong)){ // south
                        filtered.setPixel(i,j, Color(1,1,1,1));
                    }
                    else{
                        filtered.setPixel(i,j, Color(0,0,0,1));
                    }
                }
            }
        }
        std::vector<Image*> list = {&filtered};
        return list;
    }
private:
    float strong;
    float weak;
};

}

#endif // THRESHOLD_FILTER_H_