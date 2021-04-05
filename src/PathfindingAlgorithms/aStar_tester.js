// Performs a* algorithm; returns *all* nodes in the order
// in which they were visited. Also makes nodes point back to their
// previous node, effectively allowing us to compute the shortest path
// by backtracking from the finish node.
// This is a modified Disjkstra's, with very similar code,
// and is not optimal in terms of time complexity given that we're not implementing
// a priority queue as a 'frontier,' but rather a list, and we're sorting this list
// every loop... terribly inefficient.
// For a more efficient version, check out my github numbers puzzle code:
// https://github.com/annarekow/Artificial-Intelligence/blob/master/puzzle.py

export function aStar(grid, startNode, finishNode) {
    const visitedNodesInOrder = [];
    startNode.distance = 0;
    calculateTotalCost(startNode, finishNode);
    const unvisitedNodes = getAllNodes(grid);
    while (!!unvisitedNodes.length) {
        sortNodesByTotalCost(unvisitedNodes);
        const closestNode = unvisitedNodes.shift();
        if (closestNode.isWall) continue;
        // if closest node has distance of infinity - ie there's no path to finish node,
        // we are trapped, and must stop
        if (closestNode.distance === Infinity) return visitedNodesInOrder;
        closestNode.isVisited = true;
        visitedNodesInOrder.push(closestNode);
        if (closestNode === finishNode) {
            return visitedNodesInOrder;
        }
        updateUnvisitedNeighbors(closestNode, grid, finishNode);
    }
}


function sortNodesByTotalCost(unvisitedNodes) {
    // rather than distance from start, like dijkstra's, we're sorting by total cost now
    unvisitedNodes.sort((nodeA, nodeB) => nodeA.totalCost - nodeB.totalCost);
}

function updateUnvisitedNeighbors(node, grid, finishNode) {
    const unvisitedNeighbors = getUnvisitedNeighbors(node, grid);
    for (const neighbor of unvisitedNeighbors) {
        neighbor.distance = node.distance + 1;
        neighbor.previousNode = node;
        calculateTotalCost(neighbor, finishNode);
    }
}

function getUnvisitedNeighbors(node, grid) {
    const neighbors = [];
    const {col, row} = node;
    if (row > 0) neighbors.push(grid[row - 1][col]);
    if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
    if (col > 0) neighbors.push(grid[row][col - 1]);
    if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);
    return neighbors.filter(neighbor => !neighbor.isVisited);
}

export function getAllNodes(grid) {
    const nodes = [];
    for (const row of grid) {
        for (const node of row) {
            nodes.push(node);
        }
    }
    return nodes;
}

// function resetNode(node) {
//     const newNode = {
//         ...node,
//         distance: node.isStart ? 0 : Infinity,
//         isVisited: false,
//         transitioning: false,
//     };
//     return newNode
// }

// Backtracks from the finish node to find the shortest path
export function getNodesInShortestPathOrder(finishNode) {
    const nodesInShortestPathOrder = [];
    let currentNode = finishNode;
    while (currentNode !== null) {
        nodesInShortestPathOrder.unshift(currentNode);
        currentNode = currentNode.previousNode;
    }
    return nodesInShortestPathOrder;
}

function calculateTotalCost(node, finishNode) {
    // calculates the manhattan distance of a node to the finish node - this is an estimate and doesn't account for the presence of walls
    if (!(node.isWall)) {
        node.distToEnd = Math.abs(finishNode.row - node.row) + Math.abs(finishNode.col - node.col);
    }
    calculateHeuristics(node);
}
function calculateHeuristics(node) {
    // adds Manhattan distance to node's distance
    // only call after given node's distance from start and manhattan distance have been updated
    const dist = node.distance + node.distToEnd;
    node.totalCost =  dist;
}