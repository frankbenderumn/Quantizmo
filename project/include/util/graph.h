#ifndef GRAPH_H_
#define GRAPH_H_

#include <string>
#include <vector>
#include <picojson.h>

namespace csci3081 {

class IGraphNode;

/// Represents a read only graph object
class IGraph {
public:
	/// Destructor
	virtual ~IGraph() {}
	/// Gets a node in the graph by name
	virtual const IGraphNode* GetNode(const std::string& name) const = 0;
	/// Gets all nodes in the graph
	virtual const std::vector<IGraphNode*>& GetNodes() const = 0;

	virtual void WriteGraph() const = 0;

    virtual picojson::value WriteComposite() const = 0;

};

/// Represents a node in a graph object
class IGraphNode {
public:
	/// Destructor
	virtual ~IGraphNode() {}
	/// Gets the node name
	virtual const std::string& GetName() const = 0;
	/// Gets the node's neighbors
	virtual const std::vector<IGraphNode*>& GetNeighbors() const = 0;
	/// Gets the node's position
	virtual const std::vector<float> GetPosition() const = 0;
	// Gets the node's edges
	virtual const std::vector<picojson::object> GetEdges() const = 0;

};

}

#endif