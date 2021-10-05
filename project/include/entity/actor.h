#ifndef ACTOR_H_
#define ACTOR_H_

#include "entity.h"
#include "strategy/automatic.h"
#include "strategy/manual.h"
#include "strategy/target.h"
#include "util/console.h"
#include "observer/observer.h"
#include <stdexcept>

namespace csci3081 {
    class Actor : public Entity {
      public:
        Actor(const picojson::object& data) : Entity(data) {
            if (data.find("speed") != data.end()) {
                this->speed = data.find("speed")->second.get<double>();
            }
            this->strategy = new Automatic();
        }

        ~Actor() { printf("destroying actor!\n"); }

        void SetStrategy(Strategy* strategy) {
            this->strategy = strategy;
        }

        void Update(float dt) {
            if (strategy != nullptr) {
                // may need circle helper function or class to calculate next point on circumference given automated route radius
                this->strategy->Move(this->direction, 0.1, 0.1);
            } else {
                Console::Log(WARNING, "No strategy selected");
            }
            std::cout << "Actor y position is" << this->position[1] << std::endl;
            if (this->position[1] >= 12) {
                this->Notify("alert");
            }
            this->Compute(dt);
        }

        bool Attach(Observer* observer) {
            for (auto o : observers) {
                if (o == observer) return false;
            }
            observers.push_back(observer);
            return true;
        }

        bool Detach(Observer* observer) {
            for (int i = 0; i < observers.size(); i++) {
                if (observers[i] == observer) {
                    observers.erase(observers.begin()+i);
                    return true;
                }
            }
            return false;
        }

        void Notify(std::string event, float timestamp = 0.f) {
            Console::Log(INFO, "NOTIFYING!");
            picojson::object o;
            o["test"] = picojson::value("this is a test");
            if (event == "analytics") {
                o["type"] = picojson::value("anayltics");
                o["time"] = picojson::value(0.f);
            } else if (event == "alert") {
                o["type"] = picojson::value("alert");
            } else {
                Console::Log(FAILURE, "Invalid observer call type");
                exit(0);
            }
            picojson::value v(o);
            this->NotifyObservers(v, *this);
        }

        void NotifyObservers(const picojson::value& event, const Entity& e) {
            for (auto o : this->observers) {
                o->OnEvent(event, e);
            }
        }

        void Press(const std::string& key, int keyCode) {
            if (strategy->GetType() != MANUAL) return;
            if (keyCode == 65) { // KeyA
                negMove[0] = -1;
            } else if (keyCode == 87) { // KeyW
                posMove[2] = 1;
            } else if (keyCode == 68) { // KeyD
                posMove[0] = 1;
            } else if (keyCode == 83) { // KeyS
                negMove[2] = -1;
            } else if (keyCode == 37) { // ArrowLeft
                negTurn[0] = -1;
            } else if (keyCode == 87) { // ArrowRight
                posTurn[0] = 1;
            } else if (keyCode == 87) { // ArrowUp
                posTurn[1] = 1;
            } else if (keyCode == 87) { // ArrowDown
                negTurn[1] = -1;
            } else if (keyCode == 01) { // dummy var for left mouse click
                // posMove.z = 1;
            } else if (keyCode == 02) { // dummy var for right mouse click
                // posMove.z = 1;
            } else if (keyCode == 02) { // dummy var for middle mouse click
                // posMove.z = 1;
            }
        }

        void Release(const std::string& key, int keyCode) {
            if (strategy->GetType() != MANUAL) return;
            if (keyCode == 65) { // KeyA
                negMove[0] = 0;
            } else if (keyCode == 87) { // KeyW
                posMove[2] = 0;
            } else if (keyCode == 68) { // KeyD
                posMove[0] = 0;
            } else if (keyCode == 83) { // KeyS
                negMove[2] = 0;
            } else if (keyCode == 37) { // ArrowLeft
                negTurn[0] = 0;
            } else if (keyCode == 87) { // ArrowRight
                posTurn[0] = 0;
            } else if (keyCode == 87) { // ArrowUp
                posTurn[1] = 0;
            } else if (keyCode == 87) { // ArrowDown
                negTurn[1] = 0;
            } else if (keyCode == 01) { // dummy var for left mouse click
                // posMove.z = 1;
            } else if (keyCode == 02) { // dummy var for right mouse click
                // posMove.z = 1;
            } else if (keyCode == 02) { // dummy var for middle mouse click
                // posMove.z = 1;
            }
        }

        void Compute(float dt) {
            if (strategy->GetType() == MANUAL) {
                theta += (posTurn[0] + negTurn[0]) * turnSpeed * dt;
                phi += (posTurn[1] + negTurn[1]) * turnSpeed * dt;
                strategy->Move(this->direction, theta, phi);
                position[0] += (posMove[0] + negMove[0]) * this->direction[0] * speed * dt;
                position[1] += (posMove[1] + negMove[1]) * this->direction[1] * speed * dt;
                position[2] += (posMove[2] + negMove[2]) * this->direction[2] * speed * dt;
            } else {
                // strategy->Move(this->direction, theta, phi);
                position[1] += 1.0 * speed * dt;
            }
        }
    
      private:
        std::vector<int> posMove;
        std::vector<int> negMove;
        std::vector<int> posTurn;
        std::vector<int> negTurn;
        double theta = 0;
        double phi = 0;
        double turnSpeed = 1;
        double speed = 1;
        std::vector<Observer*> observers;
        Strategy* strategy; 
    };
}

#endif