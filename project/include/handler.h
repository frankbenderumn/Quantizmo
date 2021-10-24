#ifndef HANDLER_H_
#define HANDLER_H_

#include "entity/actor.h"

namespace csci3081 {
    class Handler {
        public:
            Handler() {}

            void SetActor(Actor* a) {
                this->a = a;
            }

            void Press(const std::string& key, int keyCode) {
                if (!a) return;
                if (keyCode == 65) { // KeyA
                    a->SetAxis(0, -1);
                } else if (keyCode == 83) { // KeyS
                    a->SetAxis(2, 1);
                } else if (keyCode == 68) { // KeyD
                    a->SetAxis(0, 1);
                } else if (keyCode == 87) { // KeyW
                    a->SetAxis(2, -1);
                // } else if (keyCode == 37) { // ArrowLeft
                //     a->SetTurn()
                // } else if (keyCode == 87) { // ArrowRight
                //     a-SetTurn()
                } else if (keyCode == 38) { // ArrowUp
                    a->SetAxis(1, 1);
                } else if (keyCode == 40) { // ArrowDown
                    a->SetAxis(1, -1);

                // for mouse controls
                // } else if (keyCode == 01) { // dummy var for left mouse click
                //     // posMove.z = 1;
                // } else if (keyCode == 02) { // dummy var for right mouse click
                //     // posMove.z = 1;
                // } else if (keyCode == 03) { // dummy var for middle mouse click
                //     // posMove.z = 1;
                }
            }

            /* @brief interprets released key for actor */
            void Release(const std::string& key, int keyCode) {
                if (!a) return;
                if (keyCode == 65) { // KeyA
                    a->ClearAxis(0, -1);
                } else if (keyCode == 83) { // KeyS
                    a->ClearAxis(2, 1);
                } else if (keyCode == 68) { // KeyD
                    a->ClearAxis(0, 1);
                } else if (keyCode == 87) { // KeyW
                    a->ClearAxis(2, -1);
                // } else if (keyCode == 37) { // ArrowLeft
                //     a->SetTurn()
                // } else if (keyCode == 87) { // ArrowRight
                //     a-SetTurn()
                } else if (keyCode == 38) { // ArrowUp
                    a->ClearAxis(1, 1);
                } else if (keyCode == 40) { // ArrowDown
                    a->ClearAxis(1, -1);

                // for mouse controls
                // } else if (keyCode == 01) { // dummy var for left mouse click
                //     // posMove.z = 1;
                // } else if (keyCode == 02) { // dummy var for right mouse click
                //     // posMove.z = 1;
                // } else if (keyCode == 03) { // dummy var for middle mouse click
                //     // posMove.z = 1;
                }
            }

        private:
            Actor* a;
    };
}

#endif