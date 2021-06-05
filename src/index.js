import React, { Fragment } from 'react'
import ReactDOM from 'react-dom'
import './index.css'

function Square({ value, onClick, color }) {
    return (
        <button className="square" onClick={onClick} >
            <div className={color ? 'highlight-square' : ''}> {value}</div>
        </button>
    )
}

class Board extends React.Component {

    renderSquare(index) {
        const { winner } = this.props
        let color = false
        if (winner) {
            const [first, second, third] = winner.moves
            if (first === index || second === index || third === index) {
                color = true
            }
            //   color = first === index ? true : second === index ? true : third === index ? true : false
        }
        return (
            <Square value={this.props.sqaures[index]} color={color}
                onClick={() => this.props.onClick(index)} />
        )
    }

    render() {
        let counter = -1
        const array = Array(3).fill(0).map((row) => {

            const bow = Array(3).fill(null)
            // .map((column) => {
            //     column = counter;
            //     counter++

            // })
            return bow
        })
        const board = array.map((row) => {
            return row.map((column) => {
                counter++;
                return column = counter
            })
        })
        // console.log(bo)
        // console.log('bor :>> ', bor);
        // const board = [[0, 1, 2], [3, 4, 5], [6, 7, 8]]
        return (
            <div>
                {board.map((row) =>
                    <div key={row} className="board-row">
                        {row.map((column) =>
                            <Fragment key={column}>
                                {this.renderSquare(column)}
                            </Fragment>)}
                    </div>)}
            </div>
        )
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [
                {
                    squares: Array(9).fill(null),
                    row: 0,
                    column: 0
                }
            ],
            stepNumber: 0,
            xIsNext: true,
            ascending: true,
            btnVisible: false
        }
    }

    handleClick(index) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1)
        const current = history[history.length - 1]
        const squares = current.squares.slice()
        if (calculatewinner(squares) || squares[index]) {
            return
        }
        squares[index] = this.state.xIsNext ? 'X' : 'O'
        this.setState({
            history: history.concat([{
                squares: squares,
                column: (index + 1) % 3 === 0 ? 3 : ((index + 1) % 3 === 1 ? 1 : 2),
                row: index <= 2 ? 1 : (index > 2 && index <= 5 ? 2 : 3)
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
            btnVisible: true
        })
    }
    jumpTo(step) {
        this.setState((state) => ({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
            ascending: true,
            btnVisible: step === 0 ? false : true
        }))
    }

    sortMoves(history) {
        const sliced = history.slice(1, history.length)
        const descendingSort = sliced.sort((item, nextItem) => {
            return sliced.indexOf(nextItem) - sliced.indexOf(item)
        })
        const ascendingSort = sliced.sort((item, nextItem) => {
            return sliced.indexOf(item) - sliced.indexOf(nextItem)
        })
        const sortedHistory = this.state.ascending ? descendingSort : ascendingSort
        this.setState((state) => ({
            history: [
                {
                    squares: Array(9).fill(null),
                    row: 0,
                    column: 0
                },
                ...sortedHistory
            ],
            ascending: !state.ascending,
        }))
    }

    render() {
        let history = this.state.history
        const current = history[this.state.stepNumber]
        const winner = calculatewinner(current.squares)
        const moves = history.map((step, move) => {
            const desc = move ?
                (move === this.state.stepNumber ? <b>Go to the move# {move} played on ({step.column},{step.row}) </b> :
                    'Got to the move# ' + (move) + ' played on (' + (step.column) + ',' + (step.row) + ')') :
                'Go to game start'

            return (
                <li key={move}>
                    <button
                        onClick={() => this.jumpTo(move)}
                    >{desc}</button>
                </li>
            )
        })
        let status
        if (winner) {
            status = 'Winner : ' + winner.player
        } else if (history.length === 10) {
            status = 'Its a Draw! Please click on "Go to game start" button'
        }
        else {
            status = `Next player: ${this.state.xIsNext ? 'X' : 'O'}`
        }
        return (
            <div className="game">
                <div className="game-board">
                    <Board sqaures={current.squares} onClick={(i) => this.handleClick(i)} winner={winner} />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <ol>{moves}</ol>
                    {this.state.btnVisible && (
                        <button className="sort-moves"
                            onClick={() => this.sortMoves(history)}>Sort in {this.state.ascending ? 'descending ' : 'ascending '}order</button>
                    )}

                </div>
            </div>
        )
    }
}
// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);

function calculatewinner(squares) {
    const values = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ]
    for (let i = 0; i < values.length; i++) {
        const [a, b, c] = values[i]
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            const winner = {
                player: squares[a],
                moves: values[i]
            }
            return winner
        }
    }
    return null
}