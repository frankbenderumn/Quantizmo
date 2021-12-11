#ifndef BATTERY_H_
#define BATTERY_H_

class Battery {
  public:
    Battery() {}
    Battery(float charge, float max_charge) : charge(charge), max_charge(max_charge) {}
    ~Battery() { printf("destroying battery!\n"); }
    bool IsFull() { return (charge == max_charge); }
    bool IsLow() { return (charge / max_charge <= 0.25f) ? true : false; }
    bool IsDead() { return (charge == 0.f); }
    void Deplete(float dt) {
        if (charge == 0) return;
        charge -= deplete_rate * dt;
        if (charge < 0) charge = 0;
    }
    void Charge(float dt) {
        if (charge == max_charge) return;
        charge += charge_rate * dt;
        if (charge > max_charge) charge = max_charge;
    }
    void Print() {
        std::cout << "charge is: " << charge << std::endl;
    }
    float GetLife() { return charge / max_charge; }

    private:
    float charge = 10.f;
    float max_charge = 20.f;
    float charge_rate = 20.f;
    float deplete_rate = 0.5f;
};

#endif