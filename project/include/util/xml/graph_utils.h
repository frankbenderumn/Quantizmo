#ifndef GRAPH_UTILS_H_
#define GRAPH_UTILS_H_

#include <unordered_map>

#include "util/graph.h"
#include "util/osm_graph.h"

using std::string;
using std::unordered_map;


namespace csci3081
{
class GraphUtils {
    public :  
        static unordered_map<string, int>* ConnectedComponents(const IGraph* graph);
        static OSMGraph* Filter(const IGraph* original, const unordered_map<string, bool>* filter);
        static OSMGraph* FilterToLargestConnectedComponent(const IGraph* graph);
    private:
        static void dfs_visit(const IGraphNode* n, unordered_map<string, int>* record, int index);
};
} // namespace csci3081


#endif // ITERATION2_SOLN_SRC_XML_TOOLS_GRAPH_UTILS_H_