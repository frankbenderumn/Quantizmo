//
// Created by corey on 10/24/21.
//

#ifndef CANNY_DETECT_H
#define CANNY_DETECT_H

#include "image.h"
#include "filter.h"

class CannyDetect {
public:
    bool detect(Image input);

private:
    GreyScaleFilter grey;
    GaussianBlurFilter gauss = GaussianBlurFilter(5, 2.0); // kernel size of 5x5, sigma of 2 (larger sigma = more blur)
    SobelFilter sb = SobelFilter();
    NonMaxSuppressionFilter nm = NonMaxSuppressionFilter();
    DoubleThreshFilter dt = DoubleThreshFilter(.4, .25, 1, .1);
    HysteresisFilter hf = HysteresisFilter(1,.1);
    ColorFilter colorFilter = ColorFilter(206 / 255.0, 152 / 255.0, 64 / 255.0, .25);
    float ratioThresh = 3;

};

#endif //INSTRUCTOR_REPO_CANNYDETECT_H