// WORKING

// import React, {Component} from 'react';
// import Node from './Node/Node';
// import {dijkstra, getAllNodes, getNodesInShortestPathOrder} from '../PathfindingAlgorithms/dijkstra';
// import {aStar} from '../PathfindingAlgorithms/aStar_tester';
// import {dfs} from '../PathfindingAlgorithms/dfs';
// import {bfs} from '../PathfindingAlgorithms/bfs';
//
// import './Visuals.css';
// //import './zapp.js'
// //import {Helmet} from "react-helmet";
//
// let START_NODE_ROW = 2;
// let START_NODE_COL = 1;
// let FINISH_NODE_ROW = 7;
// let FINISH_NODE_COL = 28;
// const BOARD_HEIGHT = 11;
// const BOARD_WIDTH = 30;
// ///
// let CAN_DRAW = true;
// let ALG_DONE = true;
// let TRANSITIONING = false; // bool for moving start/finish nodes
// let START = false; // bool specifying whether node is start or finish, if we're moving either of them
// ///
// let ALG_ON_BOARD = false;  // switches to true if we've run an algorithm
// let PREVIOUS_ALG = null; // will be a string specifying the algorithm we just completed
//
// export default class Visuals extends Component {
//     constructor() {
//         super();
//         this.state = {
//             grid: [],
//             mouseIsPressed: false,
//             gridHistory: [{
//                 history: []
//             }],
//             // time: 1,
//         };
//     }
//
//     componentDidMount() {
//         const grid = getInitialGrid();
//         this.setState({
//             grid: grid,
//             gridHistory: this.state.gridHistory.concat([{
//                 history: grid
//             }])
//         });
//         // const script = document.createElement('script');
//         // script.src = './zapp.js'
//         // script.async = true;
//         // document.body.appendChild(script);
//     }
//
//     handleMouseDown(row, col, isStart, isFinish) {
//         // moving start/finish nodes when there's a path on the board
//
//         // for when there's no path on the board
//         if (CAN_DRAW === true) {
//             //drawing a wall
//             if (isStart === false && isFinish === false) {
//                 const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
//                 this.setState({grid: newGrid, mouseIsPressed: true});
//             }
//             // moving start/finish position
//             else if (isStart === true || isFinish === true) {
//                 TRANSITIONING = true;
//                 START = !!isStart;
//                 const newGrid = getNewGridWithNewStartFinish(this.state.grid, row, col);
//                 this.setState({grid: newGrid, mouseIsPressed: true});
//             }
//         }
//     }
//
//     handleMouseEnter(row, col, isStart, isFinish, transitioning) {
//         if (CAN_DRAW === true) {
//             // moving start/finish position
//             if (TRANSITIONING === true) {
//                 if (!this.state.mouseIsPressed) return;
//                 // temporarily change global vars
//                 // START_NODE_ROW = row;
//                 // START_NODE_COL = col;
//                 const newGrid = getNewGridWithNewStartFinish(this.state.grid, row, col);
//                 this.setState({grid: newGrid});
//             }
//             //drawing a wall
//             else if (isStart === false && isFinish === false) {
//                 if (!this.state.mouseIsPressed) return;
//                 if (transitioning === false) {
//                     const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
//                     this.setState({grid: newGrid});
//                 }
//             }
//         }
//     }
//
//     handleMouseUp(row, col, isStart, isFinish, transitioning) {
//         if (CAN_DRAW === true) {
//             // moving start/finish position
//             if (TRANSITIONING === true) {
//                 const newGrid = changeStartFinish(this.state.grid, row, col); // change all nodes to not transitioning, change start/finish node
//                 this.setState({grid: newGrid, mouseIsPressed: false});
//             }
//             //drawing a wall
//             else if (transitioning === false && isStart === false && isFinish === false) {
//                 this.setState({mouseIsPressed: false});
//             }
//         }
//         TRANSITIONING = false;
//     }
//
//     animateAlgorithm(visitedNodesInOrder, nodesInShortestPathOrder) {
//         //console.log('animating algo')
//         for (let i = 1; i <= visitedNodesInOrder.length - 1; i++) {
//             if (i === visitedNodesInOrder.length - 1) {
//                 setTimeout(() => {
//                     this.animateShortestPath(nodesInShortestPathOrder);
//                 }, 10 * i);
//                 return;
//             }
//             setTimeout(() => {
//                 const node = visitedNodesInOrder[i];
//                 document.getElementById(`node-${node.row}-${node.col}`).className =
//                     'node node-visited';
//             }, 10 * i);
//         }
//     }
//
//     animateShortestPath(nodesInShortestPathOrder) {
//         //console.log('animating shortest path')
//         let timeout = 0;
//         for (let i = 1; i < nodesInShortestPathOrder.length - 1; i++) {
//             timeout++;
//             setTimeout(() => {
//                 const node = nodesInShortestPathOrder[i];
//                 document.getElementById(`node-${node.row}-${node.col}`).className =
//                     'node node-shortest-path';
//             }, 50 * i);
//         }
//         setTimeout(() => {ALG_DONE = true;}, 50*(timeout) + 10);
//     }
//
//     // TODO: CLEAN UP VISUALIZE FUNCTIONS - MAKE THEM ONE
//     visualizeDijkstra() {
//         if (CAN_DRAW) {
//             ALG_DONE = false;
//             CAN_DRAW = false;
//             const {grid} = this.state;
//             this.handleClick(grid);
//             const startNode = grid[START_NODE_ROW][START_NODE_COL];
//             const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
//             const visitedNodesInOrder = dijkstra(grid, startNode, finishNode);
//             const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
//             this.animateAlgorithm(visitedNodesInOrder, nodesInShortestPathOrder);
//             //ALG_DONE = true;
//         }
//     }
//
//     visualizeAStar() {
//         if (CAN_DRAW) {
//             ALG_DONE = false;
//             CAN_DRAW = false;
//             const {grid} = this.state;
//             this.handleClick(grid);
//             // console.log('in astar:');
//             // console.log(this.state.grid);
//             // console.log(this.state.mouseIsPressed);
//             const startNode = grid[START_NODE_ROW][START_NODE_COL];
//             const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
//             const visitedNodesInOrder = aStar(grid, startNode, finishNode);
//             // console.log('VISITED NODES IN ORDER:')
//             // console.log(visitedNodesInOrder)
//             const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
//             // console.log('NODES IN SHORTEST PATH ORDER:')
//             // console.log('nodesInShortestPathOrder')
//             this.animateAlgorithm(visitedNodesInOrder, nodesInShortestPathOrder);
//         }
//     }
//
//     visualizeDFS() {
//         if (CAN_DRAW) {
//             ALG_DONE = false;
//             CAN_DRAW = false;
//             const {grid} = this.state;
//             this.handleClick(grid);
//             const startNode = grid[START_NODE_ROW][START_NODE_COL];
//             const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
//             const visitedNodesInOrder = dfs(grid, startNode, finishNode);
//             const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
//             this.animateAlgorithm(visitedNodesInOrder, nodesInShortestPathOrder);
//             //ALG_DONE = true;
//         }
//     }
//
//     visualizeBFS() {
//         if (CAN_DRAW) {
//             ALG_DONE = false;
//             CAN_DRAW = false;
//             const {grid} = this.state;
//             this.handleClick(grid);
//             const startNode = grid[START_NODE_ROW][START_NODE_COL];
//             const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
//             const visitedNodesInOrder = bfs(grid, startNode, finishNode);
//             const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
//             this.animateAlgorithm(visitedNodesInOrder, nodesInShortestPathOrder);
//             //ALG_DONE = true;
//         }
//     }
//
//     resetNodes() {
//         // reset all nodes to simply 'node' to undo the animations, leaving only the walls
//         let nodesVisited = document.getElementsByClassName('node node-visited');
//         let nodesPath = document.getElementsByClassName('node node-shortest-path');
//         // reset start and finish nodes
//         // const start = nodesPath[0];
//         // start.className = 'node-start';
//         // const finish = nodesPath[nodesPath.length - 1];
//         // finish.className = 'node-finish';
//         console.log('resetting nodes')
//         //TODO: why doesn't this select all elements of these class names?
//         while (!!nodesVisited.length || !!nodesPath.length) {
//             console.log(nodesVisited.length)
//             let i = 0
//             for (const node of nodesVisited) {
//                 node.className = 'node';
//                 console.log(i);
//                 i = i+1;
//             }
//             for (let i = 0; i < nodesPath.length; i++) {
//                 nodesPath[i].className = 'node';
//             }
//             nodesVisited = document.getElementsByClassName('node node-visited');
//             nodesPath = document.getElementsByClassName('node node-shortest-path');
//
//         }
//         CAN_DRAW = true;
//         document.getElementById(`node-${START_NODE_ROW}-${START_NODE_COL}`).className =
//             'node node-start';
//         document.getElementById(`node-${FINISH_NODE_ROW}-${FINISH_NODE_COL}`).className =
//             'node node-finish';
//     }
//
//     unvisitNodes() {
//         // toggles isVisited param to false on all nodes
//         const nodes = getAllNodes(this.state.grid);
//         for (const node of nodes) {
//             //console.log(node.isVisited);
//             //
//             if (node.isVisited) {
//                 console.log('true');
//                 node.isVisited = false;
//             }
//             node.previousNode = null;
//             node.distance = Infinity;
//             node.distToEnd = Infinity;
//             node.totalCost = Infinity;
//             node.status = null;
//             node.isStart = node.row === START_NODE_ROW && node.col === START_NODE_COL;
//             node.isFinish = node.row === FINISH_NODE_ROW && node.col === FINISH_NODE_COL;
//         }
//     }
//
//
//     resetPath() {
//         console.log(ALG_DONE);
//         console.log('resetting path - alg done ^^')
//         if (ALG_DONE === true) {
//             // clears any search algorithm, keeps walls
//             // console.log('reset path');
//             // console.log(this.state.gridHistory);
//             //this.state.time = this.state.gridHistory.length - 1;
//             const gridBefore = this.state.gridHistory[this.state.gridHistory.length - 1].history;
//             this.resetNodes();
//             this.unvisitNodes();
//             this.setState({grid: gridBefore});
//         }
//     }
//
//     handleClick(grid) {
//         this.setState({
//             gridHistory: this.state.gridHistory.concat([{
//                 history: grid.slice()
//             }])
//         });
//         // console.log('handled click');
//         // console.log(grid.slice());
//         // console.log(this.state.gridHistory);
//     }
//
//     render() {
//         const {grid, mouseIsPressed, gridHistory} = this.state;
//         //const grid = this.state.gridHistory[this.state.gridHistory.length - 1].history;
//         // console.log('in render:');
//         // console.log(grid);
//         // console.log(mouseIsPressed);
//         // console.log(gridHistory);
//         return (
//             <>
//                 <div className="title">
//                     <h1>Welcome to the place where we search and find paths</h1>
//                     <h3>**Click and drag to create barriers or move the start and finish nodes**</h3>
//                     <h2>* :) *</h2>
//                 </div>
//                 <div className="reload">
//                     <button onClick={() => window.location.reload(false)}>Clear Board</button>
//                     <button onClick={() => this.resetPath()}>Clear Path</button>
//                 </div>
//                 <div class="container">
//                     <div class="card">
//                         <div className="grid">
//                             {grid.map((row, rowIdx) => {
//                                 return (
//                                     <div key={rowIdx}>
//                                         {row.map((node, nodeIdx) => {
//                                             const {row, col, isFinish, isStart, isWall, transitioning} = node;
//                                             return (
//                                                 <Node
//                                                     key={nodeIdx}
//                                                     col={col}
//                                                     isFinish={isFinish}
//                                                     isStart={isStart}
//                                                     isWall={isWall}
//                                                     mouseIsPressed={mouseIsPressed}
//                                                     transitioning={transitioning}
//                                                     onMouseDown={(row, col) => this.handleMouseDown(row, col, isStart, isFinish)}
//                                                     onMouseEnter={(row, col) =>
//                                                         this.handleMouseEnter(row, col, isStart, isFinish, transitioning)
//                                                     }
//                                                     onMouseUp={() => this.handleMouseUp(row, col, isStart, isFinish, transitioning)}
//                                                     row={row}></Node>
//                                             );
//                                         })}
//                                     </div>
//                                 );
//                             })}
//                         </div>
//                         <div class="algo">
//                             <button onClick={() => this.visualizeDijkstra()}>
//                                 Visualize Dijkstra's
//                             </button>
//                             <button onClick={() => this.visualizeAStar()}>
//                                 Visualize A*
//                             </button>
//                             <button onClick={() => this.visualizeDFS()}>
//                                 Visualize DFS
//                             </button>
//                             <button onClick={() => this.visualizeBFS()}>
//                                 Visualize BFS
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             </>
//         );
//     }
// }
// const getInitialGrid = () => {
//     const grid = [];
//     for (let row = 0; row < BOARD_HEIGHT; row++) {
//         const currentRow = [];
//         for (let col = 0; col < BOARD_WIDTH; col++) {
//             currentRow.push(createNode(col, row));
//         }
//         grid.push(currentRow);
//     }
//     return grid;
// };
// const createNode = (col, row) => {
//     return {
//         col,
//         row,
//         isStart: row === START_NODE_ROW && col === START_NODE_COL,
//         isFinish: row === FINISH_NODE_ROW && col === FINISH_NODE_COL,
//         distance: Infinity,
//         distToEnd: Infinity,
//         totalCost: Infinity,
//         status: null,
//         isVisited: false,
//         isWall: false,
//         previousNode: null,
//         transitioning: false,
//     };
// };
// const getNewGridWithWallToggled = (grid, row, col) => {
//     const newGrid = grid.slice();
//     const node = newGrid[row][col];
//     const newNode = {
//         ...node,
//         isWall: !node.isWall,
//     };
//     newGrid[row][col] = newNode;
//     return newGrid;
// };
//
// const getNewGridWithNewStartFinish = (grid, row, col) => {
//     // function for moving start/finish node
//     // 'start' is a boolean - if true, is start; if false, is finish.
//     const newGrid = grid.slice();
//     const node = newGrid[row][col];
//     let newNode;
//     //if (!node.isWall)
//     if (START) {
//         newNode = {
//             ...node,
//             transitioning: true,
//             isStart: false,
//         };
//     }
//     else {
//         newNode = {
//             ...node,
//             transitioning: true,
//             isFinish: false,
//         };
//     }
//     newGrid[row][col] = newNode;
//     return newGrid;
// };
//
// const changeStartFinish = (grid, row, col) => {
//     // change all nodes to not transitioning, change start/finish node
//     // 'start' is a boolean - if true, is start; if false, is finish.
//     const newGrid = grid.slice();
//     for (let _row of newGrid) {
//         for (let node of _row) {
//             node.transitioning = false;
//             // node.start = false;
//             // node.finish = false;
//             // const newNode = {
//             //     ...node,
//             //     transitioning: false,
//             // };
//
//         }
//     }
//     console.log('START');
//     console.log(START);
//     if (START) {
//         START_NODE_ROW = row;
//         START_NODE_COL = col;
//     } else {
//         FINISH_NODE_ROW = row;
//         FINISH_NODE_COL = col;
//     }
//     const nodeStart = newGrid[START_NODE_ROW][START_NODE_COL];
//     const newStart = {
//         ...nodeStart,
//         isStart: true,
//     };
//     const nodeFinish = newGrid[FINISH_NODE_ROW][FINISH_NODE_COL];
//     const newFinish = {
//         ...nodeFinish,
//         isFinish: true,
//     };
//
//     newGrid[START_NODE_ROW][START_NODE_COL] = newStart;
//     newGrid[FINISH_NODE_ROW][FINISH_NODE_COL] = newFinish;
//     // //const nodeFinish = newGrid[FINISH_NODE_ROW][FINISH_NODE_COL];
//     // const newNodeFinish = {
//     //     ...nodeFinish,
//     //     isFinish: true,
//     // };
//     // newGrid[FINISH_NODE_ROW][FINISH_NODE_COL] = newNodeFinish;
//     // TODO: reset all distances?
//     // document.getElementById(`node-${START_NODE_ROW}-${START_NODE_COL}`).className =
//     //     'node node-start';
//     // document.getElementById(`node-${FINISH_NODE_ROW}-${FINISH_NODE_COL}`).className =
//     //     'node node-finish';
//     return newGrid;
// };


// IN PROGRESS

import React, {Component} from 'react';
import Node from './Node/Node';
import {dijkstra, getAllNodes, getNodesInShortestPathOrder} from '../PathfindingAlgorithms/dijkstra';
import {aStar} from '../PathfindingAlgorithms/aStar_tester';
import {dfs} from '../PathfindingAlgorithms/dfs';
import {bfs} from '../PathfindingAlgorithms/bfs';

import './Visuals.css';
//import './zapp.js'
//import {Helmet} from "react-helmet";

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
            // time: 1,
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
            //instantGrid(this.state.grid, row, col);  // might not need to do this
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
            // potentially fix other nodes - switch other start node 'off'?
            const newGrid = newInstantGrid(this.state.grid, row, col);
            this.setState({grid: newGrid});  //mouseIsPressed should already be true
        }
        // for when there's no path on the board
        if (CAN_DRAW === true) {
            // moving start/finish position
            if (TRANSITIONING === true) {
                if (!this.state.mouseIsPressed) return;
                // temporarily change global vars
                // START_NODE_ROW = row;
                // START_NODE_COL = col;
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
            // take away 'instant' class tags on all visited/path nodes?
            // unInstantGrid(this.state.grid, row, col);
        }
        // for when there's no path on the board
        if (CAN_DRAW === true) {
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
            this.animateShortestPath(nodesInShortestPathOrder);
            for (let i = 1; i <= visitedNodesInOrder.length - 1; i++) {
                const node = visitedNodesInOrder[i];
                document.getElementById(`node-${node.row}-${node.col}`).className = 'node instant-visited';
            }
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
            for (let i = 1; i < nodesInShortestPathOrder.length - 1; i++) {
                const node = nodesInShortestPathOrder[i];
                document.getElementById(`node-${node.row}-${node.col}`).className = 'node instant-shortest-path';
            }
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

    // TODO: CLEAN UP VISUALIZE FUNCTIONS - MAKE THEM ONE
    visualize(alg) {
        if (CAN_DRAW) {
            ALG_DONE = false;
            CAN_DRAW = false;
            const {grid} = this.state;
            if (!ALG_ON_BOARD) {  //we'll save the state w/ wall config before animating a path, if we want to clear path but not walls
                console.log('no alg on board, remembering history');
                this.handleClick(grid);
            }
            //this.handleClick(grid);
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
            //ALG_DONE = true;
            PREVIOUS_ALG = alg;
        }
    }

    resetNodes() {
        // reset all nodes to simply 'node' to undo the animations, leaving only the walls
        let nodesVisited = document.getElementsByClassName('node node-visited');
        let nodesPath = document.getElementsByClassName('node node-shortest-path');
        // reset start and finish nodes
        // const start = nodesPath[0];
        // start.className = 'node-start';
        // const finish = nodesPath[nodesPath.length - 1];
        // finish.className = 'node-finish';
        console.log('resetting nodes')
        //TODO: why doesn't this select all elements of these class names?
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
            //console.log(node.isVisited);
            //
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
            // console.log('reset path');
            // console.log(this.state.gridHistory);
            //this.state.time = this.state.gridHistory.length - 1;
            const gridBefore = this.state.gridHistory[this.state.gridHistory.length - 1].history;
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
        // console.log('handled click');
        // console.log(grid.slice());
        // console.log(this.state.gridHistory);
    }

    render() {
        const {grid, mouseIsPressed} = this.state;
        //const grid = this.state.gridHistory[this.state.gridHistory.length - 1].history;
        // console.log('in render:');
        // console.log(grid);
        // console.log(mouseIsPressed);
        // console.log(gridHistory);
        return (
            <>
                {/*<div className="return">*/}
                {/*    <button onClick={() => window.location.reload(false)}>Home</button>*/}
                {/*</div>*/}
                <div className="title">
                    <h1>PATHS</h1>
                </div>
                <div>
                    <h3>Click and drag -> create barriers, move the start/finish nodes</h3>
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
                {/*<div class="container">*/}
                {/*<div class="card">*/}
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
                {/*</div>*/}
                {/*</div>*/}
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
    //if (!node.isWall)
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

const newInstantGrid = (grid, row, col) => {
    // assign start/finish node to this current node - change global vars too
    //const newGrid = changeStartFinish(grid, row, col, false);  // maybe just change global vars for row/col:
    ALG_ON_BOARD = true;  // might not need
    if (START) {
        START_NODE_ROW = row;
        START_NODE_COL = col;
    } else {
        FINISH_NODE_ROW = row;
        FINISH_NODE_COL = col;
    }
    const newGrid = grid.slice();
    // potentially fix other nodes - switch other start node 'off'?
    // newGrid.unvisitNodes();  // changes nodes props
    // newGrid.resetNodes(); // changes node classes in html
    /// OR INSTEAD OF ABOVE TWO LINES
    newGrid.resetPath();
    // re-call alg, re-render page
    newGrid.visualize(PREVIOUS_ALG);
    return newGrid;
    // in animate functions:
    // new 'if' clause for ALG-ON-BOARD
    // when rendering animations, set classes to 'node instant-path' 'and 'node instant-visited'

}

const instantGrid = (grid, row, col) => {
    //takes all nodes from visited and path and converts their classes to 'node instant'
    let nodesVisited = document.getElementsByClassName('node node-visited');
    let nodesPath = document.getElementsByClassName('node node-shortest-path');
    while (!!nodesVisited.length || !!nodesPath.length) {
        for (const node of nodesVisited) {
            node.className = 'node instant-visited';
        }
        for (const node of nodesPath) {
            node.className = 'node instant-shortest-path';
        }
        nodesVisited = document.getElementsByClassName('node node-visited');
        nodesPath = document.getElementsByClassName('node node-shortest-path');

    }

    //TODO: return a grid?
    //CAN_DRAW = true;
    // document.getElementById(`node-${START_NODE_ROW}-${START_NODE_COL}`).className =
    //     'node node-start';
    // document.getElementById(`node-${FINISH_NODE_ROW}-${FINISH_NODE_COL}`).className =
    //     'node node-finish';
}

const unInstantGrid = (grid, row, col) => {
    //toggles all nodes back to their original class names before we moved the start or finish
    let nodesVisited = document.getElementsByClassName('node instant-visited');
    let nodesPath = document.getElementsByClassName('node instant-shortest-path');
    while (!!nodesVisited.length || !!nodesPath.length) {
        for (const node of nodesVisited) {
            node.className = 'node node-visited';
        }
        for (const node of nodesPath) {
            node.className = 'node node-shortest-path';
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
                // node.start = false;
                // node.finish = false;
                // const newNode = {
                //     ...node,
                //     transitioning: false,
                // };

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
    // //const nodeFinish = newGrid[FINISH_NODE_ROW][FINISH_NODE_COL];
    // const newNodeFinish = {
    //     ...nodeFinish,
    //     isFinish: true,
    // };
    // newGrid[FINISH_NODE_ROW][FINISH_NODE_COL] = newNodeFinish;
    // TODO: reset all distances?
    // document.getElementById(`node-${START_NODE_ROW}-${START_NODE_COL}`).className =
    //     'node node-start';
    // document.getElementById(`node-${FINISH_NODE_ROW}-${FINISH_NODE_COL}`).className =
    //     'node node-finish';
    return newGrid;
};