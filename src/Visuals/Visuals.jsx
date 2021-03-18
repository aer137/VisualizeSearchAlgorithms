
import React, {Component} from 'react';
import Node from './Node/Node';
import {dijkstra, getAllNodes, getNodesInShortestPathOrder} from '../PathfindingAlgorithms/dijkstra';
import {aStar} from '../PathfindingAlgorithms/aStar_tester';
import {dfs} from '../PathfindingAlgorithms/dfs';
import {bfs} from '../PathfindingAlgorithms/bfs';

import './Visuals.css';

let START_NODE_ROW = 6;
let START_NODE_COL = 8;
let FINISH_NODE_ROW = 6;
let FINISH_NODE_COL = 37;
const BOARD_HEIGHT = 15;
const BOARD_WIDTH = 45;
/// for before an algorithm has run:
let CAN_DRAW = true;
let ALG_DONE = true;
let TRANSITIONING = false; // bool for moving start/finish nodes BEFORE alg is on board
let START = false; // bool specifying whether node is start or finish, if we're trying to move them
/// for after we have a path on the board:
let ALG_ON_BOARD = false;  // switches to true if we've run an algorithm
let PREVIOUS_ALG = null; // will be a string specifying the algorithm we just completed, e.g. 'dijkstra' or 'astar'
let MOVING_PATH = false; // switches to true when we click on the start or finish node when path is on board

export default class Visuals extends Component {
    constructor() {
        super();
        this.state = {
            grid: [],
            mouseIsPressed: false,
            gridHistory: [{
                history: []
            }],
        };
    }

    componentDidMount() {
        const grid = getInitialGrid();
        this.setState({
            grid: grid,
            gridHistory: this.state.gridHistory.concat([{
                history: grid
            }])
        });
    }

    handleMouseDown(row, col, isStart, isFinish) {
        // moving start/finish nodes when there's a path on the board
        if (ALG_ON_BOARD === true && (isStart === true || isFinish === true)) {
            //START specifies start or finish node
            START = !!isStart;
            // switch moving path to true to be used in handleMouseEnter - dealing w/click and drag when we haven't clicked start/finish nodes
            MOVING_PATH = true;
            // change every node in path to class 'node instant-path' 'and 'node instant-visited'
            // potentially change node prop instant -> true
            // set state
            this.setState({mouseIsPressed: true});
        }
        // for when there's no path on the board
        else if (CAN_DRAW === true) {
            //drawing a wall
            if (isStart === false && isFinish === false) {
                const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
                this.setState({grid: newGrid, mouseIsPressed: true});
            }
            // moving start/finish position
            else if (isStart === true || isFinish === true) {
                TRANSITIONING = true;
                START = !!isStart;
                const newGrid = getNewGridWithNewStartFinish(this.state.grid, row, col);
                this.setState({grid: newGrid, mouseIsPressed: true});
            }
        }
    }

    handleMouseEnter(row, col, isStart, isFinish, transitioning) {
        // moving start/finish nodes when there's a path on the board
        if (ALG_ON_BOARD === true && MOVING_PATH === true) {
            // assign start node to this current node - change global vars too
            this.newInstantGrid(this.state.grid, row, col);
            this.setState({grid: this.state.grid});

        }
        // for when there's no path on the board
        else if (CAN_DRAW === true) {
            // moving start/finish position
            if (TRANSITIONING === true) {
                if (!this.state.mouseIsPressed) return;
                const newGrid = getNewGridWithNewStartFinish(this.state.grid, row, col);
                this.setState({grid: newGrid});
            }
            //drawing a wall
            else if (isStart === false && isFinish === false) {
                if (!this.state.mouseIsPressed) return;
                if (transitioning === false) {
                    const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
                    this.setState({grid: newGrid});
                }
            }
        }
    }

    handleMouseUp(row, col, isStart, isFinish, transitioning) {
        // moving start/finish nodes when there's a path on the board
        if (ALG_ON_BOARD === true) {
            // no longer moving the path
            MOVING_PATH = false;
        }
        // for when there's no path on the board
        else if (CAN_DRAW === true) {
            // moving start/finish position
            if (TRANSITIONING === true) {
                const newGrid = changeStartFinish(this.state.grid, row, col); // change all nodes to not transitioning, change start/finish node
                this.setState({grid: newGrid, mouseIsPressed: false});
            }
            //drawing a wall
            else if (transitioning === false && isStart === false && isFinish === false) {
                this.setState({mouseIsPressed: false});
            }
        }
        TRANSITIONING = false;
    }

    animateAlgorithm(visitedNodesInOrder, nodesInShortestPathOrder) {
        // if we're moving a path that's already on the board - no timeout/animation
        if (ALG_ON_BOARD === true) {
            console.log('alg on board')
            unInstantGrid();
            for (let i = 1; i < visitedNodesInOrder.length - 1; i++) {
                const node = visitedNodesInOrder[i];
                console.log('CREATING NODES VISITED');
                document.getElementById(`node-${node.row}-${node.col}`).className = 'node instant-visited';
            }
            this.animateShortestPath(nodesInShortestPathOrder);
        } else {
            // animating a 'fresh' path from cleared board - with timeout/animation
            for (let i = 1; i <= visitedNodesInOrder.length - 1; i++) {
                if (i === visitedNodesInOrder.length - 1) {
                    setTimeout(() => {
                        this.animateShortestPath(nodesInShortestPathOrder);
                    }, 10 * i);
                    return;
                }
                setTimeout(() => {
                    const node = visitedNodesInOrder[i];
                    document.getElementById(`node-${node.row}-${node.col}`).className =
                        'node node-visited';
                }, 10 * i);
            }
        }
    }

    animateShortestPath(nodesInShortestPathOrder) {
        // if we're moving a path that's already on the board:
        if (ALG_ON_BOARD === true) {
            console.log('alg on board')
            for (let i = 1; i < nodesInShortestPathOrder.length - 1; i++) {
                const node = nodesInShortestPathOrder[i];
                document.getElementById(`node-${node.row}-${node.col}`).className = 'node instant-shortest-path';
            }
            ALG_DONE = true;
        }
        else {  //new path, w animation
            let timeout = 0;
            for (let i = 1; i < nodesInShortestPathOrder.length - 1; i++) {
                timeout++;
                setTimeout(() => {
                    const node = nodesInShortestPathOrder[i];
                    document.getElementById(`node-${node.row}-${node.col}`).className =
                        'node node-shortest-path';
                }, 50 * i);
            }
            setTimeout(() => {ALG_DONE = true; ALG_ON_BOARD = true;}, 50*(timeout) + 10);
        }
    }

    visualize(alg) {
        if (CAN_DRAW) {
            ALG_DONE = false;
            CAN_DRAW = false;
            const {grid} = this.state;
            if (!ALG_ON_BOARD) {  //we'll save the state w/ wall config before animating a path, if we want to clear path but not walls
                console.log('no alg on board, remembering history');
                this.handleClick(grid);
            }
            const startNode = grid[START_NODE_ROW][START_NODE_COL];
            const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
            const visitedNodesInOrder = alg === 'dijkstra'
                ? dijkstra(grid, startNode, finishNode)
                : alg === 'astar'
                    ? aStar(grid, startNode, finishNode)
                    : alg === 'dfs'
                        ? dfs(grid, startNode, finishNode)
                        : bfs(grid, startNode, finishNode);
            const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
            this.animateAlgorithm(visitedNodesInOrder, nodesInShortestPathOrder);
            PREVIOUS_ALG = alg;
        }
    }

    resetNodes() {
        // reset all nodes to simply 'node' to undo the animations, leaving only the walls
        let nodesVisited = document.getElementsByClassName('node node-visited');
        let nodesPath = document.getElementsByClassName('node node-shortest-path');
        console.log('resetting nodes')
        while (!!nodesVisited.length || !!nodesPath.length) {
            console.log(nodesVisited.length)
            let i = 0
            for (const node of nodesVisited) {
                node.className = 'node';
                console.log(i);
                i = i+1;
            }
            for (let i = 0; i < nodesPath.length; i++) {
                nodesPath[i].className = 'node';
            }
            nodesVisited = document.getElementsByClassName('node node-visited');
            nodesPath = document.getElementsByClassName('node node-shortest-path');

        }
        CAN_DRAW = true;
        document.getElementById(`node-${START_NODE_ROW}-${START_NODE_COL}`).className =
            'node node-start';
        document.getElementById(`node-${FINISH_NODE_ROW}-${FINISH_NODE_COL}`).className =
            'node node-finish';
    }

    unvisitNodes() {
        // toggles isVisited param to false on all nodes
        const nodes = getAllNodes(this.state.grid);
        for (const node of nodes) {
            if (node.isVisited) {
                console.log('true');
                node.isVisited = false;
            }
            node.previousNode = null;
            node.distance = Infinity;
            node.distToEnd = Infinity;
            node.totalCost = Infinity;
            node.status = null;
            node.isStart = node.row === START_NODE_ROW && node.col === START_NODE_COL;
            node.isFinish = node.row === FINISH_NODE_ROW && node.col === FINISH_NODE_COL;
        }
    }


    resetPath() {
        console.log(ALG_DONE);
        console.log('resetting path - alg done ^^')
        if (ALG_DONE === true) {
            // clears any search algorithm, keeps walls
            const gridBefore = this.state.gridHistory[this.state.gridHistory.length - 1].history;
            unInstantGrid(); //////
            this.resetNodes();
            this.unvisitNodes();
            this.setState({grid: gridBefore});
        }
        ALG_ON_BOARD = false;
    }

    handleClick(grid) {
        this.setState({
            gridHistory: this.state.gridHistory.concat([{
                history: grid.slice()
            }])
        });
    }

    newInstantGrid(grid, row, col) {
        // assign start/finish node to this current node - change global vars too
        if (START) {
            START_NODE_ROW = row;
            START_NODE_COL = col;
        } else {
            FINISH_NODE_ROW = row;
            FINISH_NODE_COL = col;
        }
        unInstantGrid();
        this.resetPath();
        // re-call alg, re-render page
        ALG_ON_BOARD = true;
        this.visualize(PREVIOUS_ALG);
    }


    render() {
        const {grid, mouseIsPressed} = this.state;
        return (
            <>
                <div className="title">
                    <h1>PATHS</h1>
                </div>
                <div>
                    <h3>Click and drag to create barriers, or to move the start/finish nodes</h3>
                    <h2>* :) *</h2>
                </div>
                <div className="algo">
                    <button onClick={() => this.visualize('dijkstra')}>
                        Visualize Dijkstra's
                    </button>
                    <button onClick={() => this.visualize('astar')}>
                        Visualize A*
                    </button>
                    <button onClick={() => this.visualize('dfs')}>
                        Visualize DFS
                    </button>
                    <button onClick={() => this.visualize('bfs')}>
                        Visualize BFS
                    </button>
                </div>
                <div className="reload">
                    <button onClick={() => window.location.reload(false)}>Clear Board</button>
                    <button onClick={() => this.resetPath()}>Clear Path</button>
                </div>
                <div className="grid">
                    {grid.map((row, rowIdx) => {
                        return (
                            <div key={rowIdx}>
                                {row.map((node, nodeIdx) => {
                                    const {row, col, isFinish, isStart, isWall, transitioning} = node;
                                    return (
                                        <Node
                                            key={nodeIdx}
                                            col={col}
                                            isFinish={isFinish}
                                            isStart={isStart}
                                            isWall={isWall}
                                            mouseIsPressed={mouseIsPressed}
                                            transitioning={transitioning}
                                            onMouseDown={(row, col) => this.handleMouseDown(row, col, isStart, isFinish)}
                                            onMouseEnter={(row, col) =>
                                                this.handleMouseEnter(row, col, isStart, isFinish, transitioning)
                                            }
                                            onMouseUp={() => this.handleMouseUp(row, col, isStart, isFinish, transitioning)}
                                            row={row}></Node>
                                    );
                                })}
                            </div>
                        );
                    })}
                </div>
            </>
        );
    }
}
const getInitialGrid = () => {
    const grid = [];
    for (let row = 0; row < BOARD_HEIGHT; row++) {
        const currentRow = [];
        for (let col = 0; col < BOARD_WIDTH; col++) {
            currentRow.push(createNode(col, row));
        }
        grid.push(currentRow);
    }
    return grid;
};
const createNode = (col, row) => {
    return {
        col,
        row,
        isStart: row === START_NODE_ROW && col === START_NODE_COL,
        isFinish: row === FINISH_NODE_ROW && col === FINISH_NODE_COL,
        distance: Infinity,
        distToEnd: Infinity,
        totalCost: Infinity,
        status: null,
        isVisited: false,
        isWall: false,
        previousNode: null,
        transitioning: false,
    };
};
const getNewGridWithWallToggled = (grid, row, col) => {
    const newGrid = grid.slice();
    const node = newGrid[row][col];
    const newNode = {
        ...node,
        isWall: !node.isWall,
    };
    newGrid[row][col] = newNode;
    return newGrid;
};

const getNewGridWithNewStartFinish = (grid, row, col) => {
    // function for moving start/finish node
    // 'start' is a boolean - if true, is start; if false, is finish.
    const newGrid = grid.slice();
    const node = newGrid[row][col];
    let newNode;
    if (START) {
        newNode = {
            ...node,
            transitioning: true,
            isStart: false,
        };
    }
    else {
        newNode = {
            ...node,
            transitioning: true,
            isFinish: false,
        };
    }
    newGrid[row][col] = newNode;
    return newGrid;
};

const unInstantGrid = () => {
    //toggles all nodes back to their original class names before we moved the start or finish
    let nodesVisited = document.getElementsByClassName('node instant-visited');
    let nodesPath = document.getElementsByClassName('node instant-shortest-path');
    while (!!nodesVisited.length || !!nodesPath.length) {
        for (const node of nodesVisited) {
            node.className = 'node';
        }
        for (const node of nodesPath) {
            node.className = 'node';
        }
        nodesVisited = document.getElementsByClassName('node node-visited');
        nodesPath = document.getElementsByClassName('node node-shortest-path');
    }
}

const changeStartFinish = (grid, row, col, transitioning=true) => {
    // change all nodes to not transitioning, change start/finish node
    // 'start' is a boolean - if true, is start; if false, is finish.
    const newGrid = grid.slice();
    if (transitioning) {
        for (let _row of newGrid) {
            for (let node of _row) {
                node.transitioning = false;
            }
        }
    }

    if (START) {
        START_NODE_ROW = row;
        START_NODE_COL = col;
    } else {
        FINISH_NODE_ROW = row;
        FINISH_NODE_COL = col;
    }
    const nodeStart = newGrid[START_NODE_ROW][START_NODE_COL];
    const newStart = {
        ...nodeStart,
        isStart: true,
    };
    const nodeFinish = newGrid[FINISH_NODE_ROW][FINISH_NODE_COL];
    const newFinish = {
        ...nodeFinish,
        isFinish: true,
    };

    newGrid[START_NODE_ROW][START_NODE_COL] = newStart;
    newGrid[FINISH_NODE_ROW][FINISH_NODE_COL] = newFinish;

    return newGrid;
};