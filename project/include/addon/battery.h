#ifndef BATTERY_H_
#define BATTERY_H_

namespace csci3081 {
    class Battery {
      public:
        Battery() {}
        Battery(float charge, float max_charge) : charge(charge), max_charge(max_charge) {}
        ~Battery() { printf("destroying battery!\n"); }
        bool IsFull() { return (charge == max_charge); }
        bool IsLow() { return (charge / max_charge <= 0.25f) ? true : false; }
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
      private:
        float charge = 10.f;
        float max_charge = 20.f;
        float charge_rate = 1.f;
        float deplete_rate = 0.5f;
    };
}

#endif