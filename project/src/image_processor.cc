
#include <iostream>
using namespace std;

#include "image/image_processor.h"
#include "image/image.h"
#include "image/filter.h"

namespace csci3081 {

int ImageProcessor::run(int argc, char* argv[]) {
//    // Problem 1 is setting up the environment
//
//    // Problem 2
//    Image statue("data/statue.png");
//    Image dog("data/dog.png");
//
//    cout << statue.getWidth() << " " << statue.getHeight() << endl;
//    statue.saveAs("data/results/statue_copy.png");
//
//    Image red(256,256);
//    for (int x = 0; x < red.getWidth(); x++) {
//        for (int y = 0; y < red.getHeight(); y++) {
//            red.setPixel(x, y, Color(1,0,0,1));
//        }
//    }
//    red.saveAs("data/results/red.png");
//
//
//    Image greenGradient(256,32);
//    for (int x = 0; x < greenGradient.getWidth(); x++) {
//        for (int y = 0; y < greenGradient.getHeight(); y++) {
//            greenGradient.setPixel(x, y, Color(0,1.0*x/greenGradient.getWidth(),0,1));
//        }
//    }
//    greenGradient.saveAs("data/results/green_gradient.png");
//
//    //Problem 3
//    Image thresholdStatue;
//    ThresholdFilter f(0.5);
//    Image* inputs[1] = {&statue};
//    Image* outputs[1] = {&thresholdStatue};
//    f.apply(*inputs, *outputs);
//    thresholdStatue.saveAs("data/results/statue_threshold.png");
//
//    //Problem 4
//    Image blurDog;
//    GaussianBlurFilter f2(5, 2.0);
//    Image* inputs2[] = {&dog};
//    Image* outputs2[] = {&blurDog};
//    f2.apply(*inputs2, *outputs2);
//    blurDog.saveAs("data/results/dog_blur.png");

//    //Problem 5 (edge detection)
//
//    Image greyStatue;
//    GreyScaleFilter grey;
//    Image* inputs3[] = {&statue};
//    Image* outputs3[] = {&greyStatue};
//    grey.apply(*inputs3, *outputs3);
//    greyStatue.saveAs("data/results/statue_greyscale.png");
//
//    Image blurStatue;
//    GaussianBlurFilter gauss(5, 2.0); // kernel size of 5x5, sigma of 2 (larger sigma = more blur)
//    Image* inputs4[] = {&greyStatue};
//    Image* outputs4[] = {&blurStatue};
//    gauss.apply(*inputs4, *outputs4);
//    blurStatue.normalize(); // image gets darker after blur, so let's normalize it to make it back to original brightness
//    blurStatue.saveAs("data/results/statue_blur.png");
//
//    Image sobelStatueIntensity;
//    Image sobelStatueDirection;
//    SobelFilter sf;
//    Image* inputs5[] = {&blurStatue};
//    Image* outputs5[] = {&sobelStatueIntensity, &sobelStatueDirection};
//    sf.apply(*inputs5, *outputs5);
//    sobelStatueIntensity.saveAs("data/results/statue_intensity.png", true);
//    sobelStatueDirection.saveAs("data/results/statue_direction.png", true);
//
//    Image statueSuppressed;
//    NonMaxSuppressionFilter suppress;
//    Image* inputs6[] = {&sobelStatueIntensity, &sobelStatueDirection};
//    Image* outputs6[] = {&statueSuppressed};
//    suppress.apply(*inputs6, *outputs6);
//    statueSuppressed.saveAs("data/results/statue_suppressed.png", true);
//
//    Image statueDoubleThresh;
////    DoubleThreshFilter dthresh(.1, .35, 1, .1);
//    DoubleThreshFilter dthresh(.4, .25, 1, .1);
//    Image* inputs7[] = {&statueSuppressed};
//    Image* outputs7[] = {&statueDoubleThresh};
//    dthresh.apply(*inputs7, *outputs7);
//    statueDoubleThresh.saveAs("data/results/statue_double_thresh.png");
//
//    Image statueHysteresis;
//    HysteresisFilter hysteresis(1,.1);
//    Image* inputs8[] = {&statueDoubleThresh};
//    Image* outputs8[] = {&statueHysteresis};
//    hysteresis.apply(*inputs8, *outputs8);
//    statueHysteresis.saveAs("data/results/statue_edges.png");
//
//    // Iteration 2: blob detection using canny edge detector
//
//    Image robot("data/robot.jpg");
//    Image colorFilterRobot;
//    Image* inputs9[] = {&robot};
//    Image* outputs9[] = {&colorFilterRobot};
//    ColorFilter colorFilter(206/255.0,152/255.0,64/255.0, .25);
//    colorFilter.apply(*inputs9, *outputs9);
//    colorFilterRobot.saveAs("data/results/robot_color_filter.png");
//
//    int blobArea = colorFilterRobot.getNumBrightPixels(.5);
//    int blobEdgePixels = robotHysteresis.getNumBrightPixels(.5);
//
//    cout << "blob area: " << blobArea << endl;
//    cout << "blob edge pixels: " << blobEdgePixels << endl;
//    cout << "area/edge ratio: " << (double) blobArea / blobEdgePixels << endl;
//
//    Image finalBlob;
//    finalBlob = robot;
//
//    for (int i = 0; i < robot.getWidth(); ++i){
//        for (int j = 0; j < robot.getHeight(); ++j){
//            Color area_p = colorFilterRobot.getPixel(i,j);
//            Color edge_p = robotHysteresis.getPixel(i,j);
//            if (area_p.red() > .5 && area_p.green() > .5 && area_p.blue() > .5){
//                finalBlob.setPixel(i,j, Color(0,0,.8, 1));
//            }
//            else if (edge_p.red() > .5 && edge_p.green() > .5 && edge_p.blue() > .5){
//                finalBlob.setPixel(i,j, Color(0,.8,0, 1));
//            } else{
//                finalBlob.setPixel(i,j, robot.getPixel(i,j));
//            }
//        }
//    }
//
//    finalBlob.saveAs("data/results/robot_blobs_edges.png");

    return 0;
}

}