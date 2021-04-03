import React, {Component} from 'react';
import './Node.css'

export default class Node extends Component {
    render() {
        const {
            col,
            isFinish,
            isStart,
            isWall,
            onMouseDown,
            onMouseEnter,
            onMouseUp,
            row,
            transitioning,
            classs,
        } = this.props;
        const trans = (transitioning === true)
            ? 'trans'
            : '';

        const extraClassName = isFinish
            ? 'node-finish'
            : isStart
                ? 'node-start'
                : isWall
                    ? 'node-wall'
                    : classs;
        return (
            <div
                id={`node-${row}-${col}`}
                className={`node ${extraClassName} ${trans}`}
                onMouseDown={() => onMouseDown(row, col)}
                onMouseEnter={() => onMouseEnter(row, col)}
                onMouseUp={() => onMouseUp()}></div>
        );
    }
}