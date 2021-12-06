#ifndef NLP_H_
#define NLP_H_

#include <unordered_set>
#include <string>
#include <vector>
#include <algorithm>

class NLP {
  public:
    NLP() {
        _fillerWords = std::unordered_set<std::string>{"I", "ME", "HEY", "WHAT", "UM", "LET", "OKAY",
        "LOOKS", "LIKE"};
    }

    const bool Contains(std::string element) {
        // std::cout << "TESTING ELEMENT: " << element << std::endl;
        return _fillerWords.find(element) != _fillerWords.end();
    }

    const std::string Parse(std::string text) {
        // string text = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. "
        //             "Sed laoreet sem leo, in posuere orci elementum.";
        for (auto & c: text) c = toupper(c);
        std::cout << "Upcase String: " << text << std::endl;
        std::string delim = " ";
        std::vector<std::string> words{};

        std::string word = "";
        // std::cout << _fillerWords.size() << std::endl;
        // std::cout << "----" << std::endl;
        for (auto x : text) {
            if (x == ' ') {
                if(!Contains(word)) {
                    words.push_back(word);
                    std::cout << word << std::endl;
                }
                word = "";
            }
            else {
                word = word + x;
            }
        }
        return text;
    }

  private:
    std::unordered_set<std::string> _fillerWords;
};

#endif