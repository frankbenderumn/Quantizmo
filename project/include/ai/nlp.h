#ifndef NLP_H_
#define NLP_H_

#include <unordered_set>
#include <unordered_map>
#include <string>
#include <vector>
#include <algorithm>
#include "structure/trie.h"

enum NLPCommand { SHOW, PORTFOLIO, CHART, NONE };

class NLP {
  public:
    NLP() {
        _fillerWords = std::unordered_set<std::string>{"I", "ME", "HEY", "WHAT", "UM", "LET", "OKAY",
        "LOOKS", "LIKE", "LET'S", "WELL", "ABOUT"};
    }

    const bool Contains(std::unordered_set<std::string> words, std::string element) {
        // std::cout << "TESTING ELEMENT: " << element << std::endl;
        return (words.find(element) != words.end());
    }

    const bool Contains(std::unordered_map<std::string, std::string> words, std::string element) {
        Console::Log(WARNING, "element is: " + element);
        // std::cout << "TESTING ELEMENT: " << element << std::endl;
        return (words.find(element) != words.end());
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
                if(!Contains(_fillerWords, word)) {
                    words.push_back(word);
                    std::cout << word << std::endl;
                }
                word = "";
            }
            else {
                word = word + x;
            }
        }
        std::cout << "end word is: " << word << std::endl;
        words.push_back(word);
        bool command = false;
        for (auto w : words) {
            Console::Log(INFO, "Word is: "+ w);
            if (Contains(_commandWords, w)) {
                command = true;
                Console::Log(FAILURE, "Command found: "+w);
                // continue;
            }

            Console::Log(INFO, "Size is: ");
            std::cout << w.size() << std::endl;

            if (_stockWords.find(w) != _stockWords.end()) {
                text = _stockWords[w];
                Console::Log(SUCCESS, text);
                break;
            }
        }
        std::cout << "Resulting text is: " << text << std::endl;
        return text;
    }

  private:
    std::unordered_set<std::string> _fillerWords;
    std::unordered_set<std::string> _commandWords{"SHOW", "PORTFOLIO"};
    std::unordered_map<std::string, std::string> _stockWords{
        { "ROYAL", "RCL" },
        { "CARNIVAL", "CCL" },
        { "TESLA", "TSLA" },
        { "RIVIAN", "RIVN" },
        { "VISA", "V" },
        { "NORWEIGAN", "NCLH" },
        { "DELTA", "DAL" },
        { "AMERICAN", "AAL" },
        { "NVIDIA", "NVDA"},
        { "AMD", "AMD"},
        { "SOUTHWEST", "LUV"},
        { "XELA", "XELA"},
        { "TOYOTA", "TOYOTA"}
    };
};

#endif