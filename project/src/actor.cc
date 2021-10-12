#include "entity/actor.h"

namespace csci3081 {

    Actor::Actor(const picojson::object& data) : Entity(data) {
        if (data.find("speed") != data.end()) {
            this->speed = data.find("speed")->second.get<double>();
        }
        this->strategy = new Automatic();
        this->type = ACTOR;
    }

    Actor::~Actor() { printf("destroying actor!\n"); }

    void Actor::SetStrategy(Strategy* strategy) {
        this->strategy = strategy;
    }

    void Actor::SetTarget(Actee* e) {
        this->target = e;
        SetStrategy(new Target(*e));
    }

    void Actor::SetDestination(Destination* dest) {
        this->dest = dest;
    }

    void Actor::AABB(double a, double b, double width, double height) {

    }

    void Actor::Update(float dt) {
        if (strategy) {
            this->strategy->Move(this->direction, 0.1, 0.1);
            Console::Log(INFO, "strategy moving!");
        } else {
            Console::Log(WARNING, "No strategy selected");
        }
        std::cout << "Actor y position is " << this->position[1] << std::endl;
        if (this->position[1] >= -0.1) {
            this->Notify("alert");
        }

        if (this->GetRadius() - target->GetRadius() <= 1.f) {
            printf("collision detected\n");
            this->SetStrategy(new Manual());
        }

        if (strategy->GetType() == MANUAL) {
            theta += (posTurn[0] + negTurn[0]) * turnSpeed * dt;
            phi += (posTurn[1] + negTurn[1]) * turnSpeed * dt;
            strategy->Move(this->direction, theta, phi);
            position[0] += (posMove[0] + negMove[0]) * this->direction[0] * speed * dt;
            position[1] += (posMove[1] + negMove[1]) * this->direction[1] * speed * dt;
            position[2] += (posMove[2] + negMove[2]) * this->direction[2] * speed * dt;
        } else if (strategy->GetType() == AUTOMATIC) {
            // strategy->Move(this->direction, theta, phi);
            position[0] += direction[0] * speed * dt;
        } else if (strategy->GetType() == TARGET) {
            position[0] += direction[0] * speed * dt;
        }
        // printf("direction is: ");
        // std::cout << direction[0] << direction[1] << direction[2] << std::endl;
    }

    void Actor::Press(const std::string& key, int keyCode) {
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
        } else if (keyCode == 03) { // dummy var for middle mouse click
            // posMove.z = 1;
        }
    }

    void Actor::Release(const std::string& key, int keyCode) {
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
        } else if (keyCode == 03) { // dummy var for middle mouse click
            // posMove.z = 1;
        }
    }

    void Actor::PolarToCartesian(double theta, double phi) {
        // theta += (turnSpeed * (positiveTurn.x + negativeTurn.x)) * dt;
        // phi += (turnSpeed * (positiveTurn.y + negativeTurn.y)) * dt;
        // float maxAngleInRadians = 85 * M_PI / 180;
        // phi = std::min( maxAngleInRadians, std::max( -maxAngleInRadians, phi + turnSpeed * ( negativeTurn.y + positiveTurn.y ) * dt * 0.5f ) );
        // float t = theta + M_PI / 2;
        // float p = phi + M_PI / 2;
        // forwardDir = glm::vec3( sin( p ) * cos( t ),   cos( p ),   -sin( p ) * sin ( t ) );
        // upDir      = glm::vec3( sin( phi ) * cos( t ), cos( phi ), -sin( t ) * sin( phi ) );
        // rightDir   = glm::vec3( cos( theta ), 0, -sin( theta ) );

        // if (orbital) {
        //     position += glm::normalize(rightDir) * (speed * dt * (positiveMovement.x + negativeMovement.x));
        //     position += glm::normalize(upDir) * (speed * dt * (negativeMovement.y + positiveMovement.y));
        //     position += glm::normalize(forwardDir) * (speed * dt * (positiveMovement.z + negativeMovement.z));
        // } 
        // else {
        //     position += glm::normalize(glm::vec3(rightDir.x, rightDir.y, rightDir.z)) * (speed * dt * (positiveMovement.x + negativeMovement.x));
        //     position += glm::normalize(glm::vec3(upDir.x, upDir.y, upDir.z)) * (speed * dt * (negativeMovement.y + positiveMovement.y));
        //     position += glm::normalize(glm::vec3(forwardDir.x, 0.f, forwardDir.z)) * (speed * dt * (positiveMovement.z + negativeMovement.z));
        // }
    }
}