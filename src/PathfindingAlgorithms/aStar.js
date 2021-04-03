// Performs Dijkstra's algorithm; returns *all* nodes in the order
// in which they were visited. Also makes nodes point back to their
// previous node, effectively allowing us to compute the shortest path
// by backtracking from the finish node.
//
import Heapify from "heapify";

export function aStar(grid, startNode, finishNode) {
    console.log('a star *****************');
    console.log(startNode);
    console.log(finishNode);
    const frontier = {};
    const frontierOrder = [];
    const explored = [];
    startNode.distance = 0;
    calculateTotalCost(startNode, finishNode);
    frontier[startNode.totalCost] = startNode;
    frontierOrder.push(startNode.totalCost);
    console.log(startNode);
    explored.push(startNode);
    console.log(explored[0]);
    console.log('OUT WHILE');
    console.log(frontier);
    console.log(frontierOrder);
    while (!!frontierOrder.length) {
        frontierOrder.sort((nodeA, nodeB) => nodeA.distance - nodeB.distance);
        const currentNode = frontier[frontierOrder[0]];
        frontierOrder.shift();
        if (currentNode.isWall) continue;
        if (currentNode.distance === Infinity) {
            console.log('done!');
            console.log(explored[0]);
            console.log(explored);
            return explored;
        }
        currentNode.isVisited = true;
        explored.push(currentNode);
        if (currentNode === finishNode) {
            console.log('done!');
            console.log(explored[0]);
            console.log(explored);
            return explored;
        }
        const neighbors = getNeighbors(currentNode, grid);
        for (const nextNode of neighbors) {
            const new_cost = currentNode.distance + 1;
            if (!(nextNode in explored) || new_cost < nextNode.distance)  {
                nextNode.distance = new_cost;
                calculateTotalCost(nextNode, finishNode);
                frontier[nextNode.totalCost] = nextNode;
                frontierOrder.push(nextNode.totalCost);
                nextNode.previousNode = currentNode;
            }
        }
    }
}

function getNeighbors(node, grid) {
    const neighbors = [];
    const {col, row} = node;
    if (row > 0) neighbors.push(grid[row - 1][col]);
    if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
    if (col > 0) neighbors.push(grid[row][col - 1]);
    if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);
    return neighbors;
}



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

