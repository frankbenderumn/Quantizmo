#ifndef OSM_GRAPH_H_
#define OSM_GRAPH_H_

#include <string>
#include <vector>
#include <unordered_map>
#include "graph.h"
#include "json_helper.h"
#include <fstream>

using std::string;
using std::vector;
using std::unordered_map;
using std::invalid_argument;
using std::out_of_range;
using std::numeric_limits;

struct Point {
  float p[3];

  Point(float x, float y, float z) {
  p[0] = x;
  p[1] = y;
  p[2] = z;
  }

  Point(const std::vector<float>& arr) {
    // guess we just hope that it has legnth of at least 3
    p[0] = arr[0];
    p[1] = arr[1];
    p[2] = arr[2];
  }

  float operator[](int index) const { return p[index]; }

  bool operator==(const Point& other) {
    return this->p[0] == other[0] && this->p[1] == other[1] && this->p[2] == other[2];
  }

  vector<float> toVec() const {
      vector<float> result(std::begin(p), std::end(p));
      return result;
  }
};

/*
virtual const std::string& GetName() const = 0;
	/// Gets the node's neighbors
	virtual const std::vector<IGraphNode*>& GetNeighbors() const = 0;
	/// Gets the node's position
	virtual const std::vector<float> GetPosition() const = 0;
*/

class OSMNode: public IGraphNode {
    public:
        OSMNode(Point loc, string name) : name_(name), loc_(loc) {
            picojson::object o;
            picojson::object pos;
            pos["x"] = picojson::value(static_cast<double>(loc.p[0]));
            pos["y"] = picojson::value(static_cast<double>(loc.p[1]));
            pos["z"] = picojson::value(static_cast<double>(loc.p[2]));
            o["position"] = picojson::value(pos);
            o["id"] = picojson::value(name);
            node = o;
        };
        Point GetLoc() const { return loc_; };
        const string& GetName() const override { return name_; };
        void AddNeighbour(OSMNode* other) { 
            neighbours_.push_back(other); 
            edges_.push_back(other->node);
        };
        const std::vector<IGraphNode*>& GetNeighbors() const override {
            return neighbours_;
        };
        const std::vector<picojson::object> GetEdges() const override {
            return edges_;
        };
        const std::vector<float> GetPosition() const override {
            return loc_.toVec();
        }
        picojson::object node;
        
    private:
        string name_;
        Point loc_;
        vector<IGraphNode*> neighbours_; 
        vector<picojson::object> edges_;
        // will only ever contain OSMNodes, but  casting to vector<IGraphNode*>& from vector<OSMNode*>
        // is nasty
};

class OSMGraph : public IGraph {
    public:
        ~OSMGraph() {
            for (auto kv: lookup_) {
                delete kv.second; // delete the associated node
            }
        };

        void AddNode(OSMNode* node) {
            const string name = node->GetName();
            if(lookup_.find(name) != lookup_.end()) {
                // attempting to add duplicate Node
                throw invalid_argument(name);
            }
            lookup_.insert({name, node});
            nodes_.push_back(node);
            jsonNodes_.push_back(node->node);
        };

        void AddEdge(const string name1, const string name2) {
            OSMNode* node1 = node_named(name1);
            OSMNode* node2 = node_named(name2);
            node1->AddNeighbour(node2);
        };

        const OSMNode* NodeNamed(const string name) const {
            return node_named(name);
        };

        bool Contains(const string name) const {
            return !(lookup_.find(name) == lookup_.end());
        };

        const IGraphNode* GetNode(const std::string& name) const override 
            { return Contains(name) ? NodeNamed(name) : NULL; }

        const std::vector<IGraphNode*>& GetNodes() const override
            { return nodes_; }

        void WriteGraph() const override {
            std::ofstream edgeFile("edges.json");
            std::ofstream nodeFile("nodes.json");
            nodeFile << "[" << std::endl;
            edgeFile << "[" << std::endl;
            for(int i = 0; i < nodes_.size(); i++) {
                OSMNode* node = dynamic_cast<OSMNode*>(nodes_.at(i));
                std::vector<picojson::object> edges = node->GetEdges();
                nodeFile << "\t{ \"" << node->GetName() << "\": { ";
                nodeFile << "\"position\": " << picojson::value(node->node.find("position")->second.get<picojson::object>()).serialize() << " } "; 
                (i != nodes_.size() - 1) ? nodeFile << "}," << std::endl : nodeFile << "}" << std::endl;
                edgeFile << "\t{ \"" << nodes_.at(i)->GetName() << "\": [";
                for(int j = 0; j < edges.size(); j++) {
                    edgeFile << picojson::value(edges.at(j).find("id")->second.get<std::string>()).serialize(); 
                    (j != edges.size() - 1) ? edgeFile << ", " : edgeFile << "] ";
                }
                (i != nodes_.size() - 1) ? edgeFile << "}," << std::endl : edgeFile << "}" << std::endl;
            }
            edgeFile << "]" << std::endl;
            nodeFile << "]" << std::endl;
            nodeFile.close();
            edgeFile.close();
        }

        picojson::value WriteComposite() const override {
            std::ofstream myfile("graph.json");
            myfile << "[" << "\n";
            picojson::object graph;
            for(int i = 0; i < nodes_.size(); i++) {
                picojson::object unit;
                int ct = -1;
                OSMNode* node = dynamic_cast<OSMNode*>(nodes_.at(i));
                myfile << "\t{" << std::endl;
                myfile << "\t\t\"node\": {" << std::endl;
                myfile << "\t\t\t" << "\"id\": " << picojson::value(node->node.find("id")->second.get<std::string>()).serialize() << "," << std::endl;
                unit["position"] = picojson::value(node->node.find("position")->second.get<picojson::object>());
                myfile << "\t\t\t" << "\"position\": " << picojson::value(node->node.find("position")->second.get<picojson::object>()).serialize() << "," << std::endl;
                std::vector<picojson::object> edges = node->GetEdges();
                picojson::object jsonEdge;
                myfile << "\t\t\t" << "\"edges\": {" << std::endl;
                for (int j = 0; j < edges.size(); j++) {
                    ct++;
                    jsonEdge["edge-"+std::to_string(ct)] = picojson::value(edges.at(j));
                    myfile << "\t\t\t\t" << "\"edge-"+std::to_string(ct)+"\": " << picojson::value(edges.at(j));
                    if (j != edges.size() - 1) {
                        myfile << ", " << std::endl;
                    } else {
                        myfile << std::endl;
                    }
                }
                unit["edges"] = picojson::value(jsonEdge);
                myfile << "\t\t\t}" << std::endl;
                myfile << "\t\t}" << std::endl;
                (i != nodes_.size() - 1) ? myfile << "\t}," << std::endl : myfile << "\t}" << std::endl;
                graph[node->node.find("id")->second.get<std::string>()] = picojson::value(unit);
            }
            picojson::value v = picojson::value(graph); 
            myfile << "]" << "\n";
            myfile.close();
            return v;
        }

    private:
        vector<IGraphNode*> nodes_;
        vector<picojson::object> jsonNodes_;
        unordered_map<string, OSMNode*> lookup_;
        OSMNode* node_named(const string name) const {
            auto result = lookup_.find(name);
            if (result == lookup_.end()) {
                throw invalid_argument(name);
            }
            return result->second;
        };
};

#endif