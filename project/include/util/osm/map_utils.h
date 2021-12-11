#include <unordered_map>
#include <limits.h>

using std::unordered_map;

template <class T, class V>
unordered_map<V, int>* count_value_occurrences(const unordered_map<T, V>* to_count) {
    unordered_map<V, int>* result = new unordered_map<V, int>();

    for (auto kv : *to_count) {
        auto existing_info = result->find(kv.second);
        if (existing_info == result->end()) {
            result->insert({kv.second, 1});
        } else {
            existing_info->second += 1;
        }
    }

    return result;
};

template <class T>
T argmax(const unordered_map<T, int>* mapping) {
    // this iterates through the list twice
    // because T max_found; isn't always valid
    // if T doesn't define a default constructor
    int max = INT_MIN;

    for (auto kv: *mapping) {
        if(kv.second > max) {
            max = kv.second;
        }
    }

    for (auto kv: *mapping) {
        if(kv.second == max) {
            return kv.first;
        }
    }
};

template <class T, class V>
unordered_map<T, bool>* where_equal(const unordered_map<T, int>* mapping, V equal_to){
    unordered_map<T, bool>* result = new unordered_map<T, bool>();

    for (auto kv: *mapping) {
        result->insert({
            kv.first,
            kv.second == equal_to});
    }

    return result;
};