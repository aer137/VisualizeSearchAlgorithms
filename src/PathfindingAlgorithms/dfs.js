// Performs Depth First Search

export function dfs(grid, startNode, finishNode) {
    const stack = [];
    const visited = [];
    startNode.distance = 0;
    stack.push(startNode);
    while (!!stack.length) {
        // pop stack
        const node = stack.pop();
        if (node.isWall) continue;
        node.isVisited = true;
        visited.push(node);
        if (node === finishNode) {
            return visited;
        }
        // push unvisited neighbors on stack
        const neighbors = updateAndReturnUnvisitedNeighbors(node, grid);
        for (let neighbor of neighbors) {
            if (!neighbor.isVisited) {
                stack.push(neighbor);
            }
        }
    }
}

function updateAndReturnUnvisitedNeighbors(node, grid) {
    const unvisitedNeighbors = getUnvisitedNeighbors(node, grid);
    for (const neighbor of unvisitedNeighbors) {
        neighbor.distance = node.distance + 1;
        neighbor.previousNode = node;
    }
    return unvisitedNeighbors;
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

// Backtracks from the finish node to find the shortest path
export function getNodesInShortestPathOrder(finishNode) {
    const nodesInShortestPathOrder = [];
    let currentNode = finishNode;
    console.log('nodes in shortest path order');
    console.log(currentNode);
    while (currentNode !== null) {
        console.log('in while');
        nodesInShortestPathOrder.unshift(currentNode);
        currentNode = currentNode.previousNode;
    }
    console.log('out while');
    return nodesInShortestPathOrder;
}