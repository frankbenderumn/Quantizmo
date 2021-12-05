#ifndef HANDLER_H_
#define HANDLER_H_

#include "entity/actor.h"
#include <vector>
#include "vec3.h"
    
class Handler {
    public:
        Handler() {}

        ~Handler() {}

        void Handle(int press, int keyCode) {
            if (press) {
                Press(keyCode);
            } else {
                Release(keyCode);
            }
        }

        Vec3 GetPosMove() { return posMove; }

        Vec3 GetNegMove() { return negMove; }

        void Press(int keyCode) {
            if (keyCode == 65) { // KeyA
                negMove.SetX(-1);
            } else if (keyCode == 83) { // KeyS
                posMove.SetZ(1);
            } else if (keyCode == 68) { // KeyD
                posMove.SetX(1);
            } else if (keyCode == 87) { // KeyW
                negMove.SetZ(-1);
            // } else if (keyCode == 37) { // ArrowLeft
            //     a->SetTurn()
            // } else if (keyCode == 87) { // ArrowRight
            //     a-SetTurn()
            } else if (keyCode == 38) { // ArrowUp
                posMove.SetY(1);
            } else if (keyCode == 40) { // ArrowDown
                negMove.SetY(-1);
            }
        }

        /* @brief interprets released key for actor */
        void Release(int keyCode) {
            // if (!a) return;
            if (keyCode == 65) { // KeyA
                negMove.SetX(0);
            } else if (keyCode == 83) { // KeyS
                posMove.SetZ(0);
            } else if (keyCode == 68) { // KeyD
                posMove.SetX(0);
            } else if (keyCode == 87) { // KeyW
                negMove.SetZ(0);
            // } else if (keyCode == 37) { // ArrowLeft
            //     a->SetTurn()
            // } else if (keyCode == 87) { // ArrowRight
            //     a-SetTurn()
            } else if (keyCode == 38) { // ArrowUp
                posMove.SetY(0);
            } else if (keyCode == 40) { // ArrowDown
                negMove.SetY(0);
            }
        } 

    private:
        /* @brief positive direction key press */
        Vec3 posMove;

        /* @brief negative direction key press */
        Vec3 negMove;

        // /* @brief positive turn key press */
        // std::vector<int> posTurn = {0, 0};

        // /* @brief negative turn key press */
        // std::vector<int> negTurn = {0, 0};
};

#endif