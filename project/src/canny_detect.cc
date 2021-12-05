#include <iostream>
using namespace std;

#include "image/canny_detect.h"
#include "image/image.h"
#include "image/filter.h"

bool CannyDetect::detect(Image input) {

    // grey
    // gaussianblur
    // sobel
    // non max
    // dbl thresh
    // hys
    // colorFilter

    vector<Image*> inputImage = {&input};
    vector<Image*> results = grey.apply(inputImage);

    vector<Image*> results2 = gauss.apply(results);
    results2[0]->normalize();

    vector<Image*> results3 = sb.apply(results2);

    vector<Image*> results4 = nm.apply(results3);

    vector<Image*> results5 = dt.apply(results4);

    vector<Image*> results6 = hf.apply(results5); // edge detected image

// Iteration 2: blob detection using canny edge detector
    vector<Image*> results7 = colorFilter.apply(inputImage); // color thresholded image


//    Image robot("data/robot.jpg");
//    Image *inputs9[] = {&robot};
//    Image *outputs9[] = {&colorFilterRobot};
    //colorFilterRobot.saveAs("data/results/robot_color_filter.png");

    int blobArea = results7[0]->getNumBrightPixels(.5);
    int blobEdgePixels = results6[0]->getNumBrightPixels(.5);

    cout << "blob area: " << blobArea << endl;
    cout << "blob edge pixels: " << blobEdgePixels << endl;
    cout << "area/edge ratio: " << (double) blobArea / blobEdgePixels << endl;

    // Generate a pretty image to visually evaluate
    Image finalBlob;
    finalBlob = input;

    for (int i = 0; i < input.getWidth(); ++i) {
        for (int j = 0; j < input.getHeight(); ++j) {
            Color area_p = results7[0]->getPixel(i, j);
            Color edge_p = results6[0]->getPixel(i, j);
            if (area_p.red() > .5 && area_p.green() > .5 && area_p.blue() > .5) {
                finalBlob.setPixel(i, j, Color(0, 0, .8, 1));
            } else if (edge_p.red() > .5 && edge_p.green() > .5 && edge_p.blue() > .5) {
                finalBlob.setPixel(i, j, Color(0, .8, 0, 1));
            } else {
                finalBlob.setPixel(i, j, input.getPixel(i, j));
            }

            finalBlob.saveAs("data/results/robot_blobs_edges.png");
        }
    }


    if ((double) blobArea / blobEdgePixels > ratioThresh){
        return true;
    }
    return false;

}
