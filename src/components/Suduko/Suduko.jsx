import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Suduko.css";

const DEFAULT_SIZE = 6;
const EASY_MODE_RATIO = 0.4;

const createEmptyBoard = (size) =>
    Array.from({ length: size }, () => Array(size).fill(null));

const isValidMove = (board, row, col, num) => {
    const size = board.length;
    const boxRows = 2;
    const boxCols = 3;

    for (let i = 0; i < size; i++) {
        if (board[row][i] === num || board[i][col] === num) return false;
    }

    const boxRow = Math.floor(row / boxRows) * boxRows;
    const boxCol = Math.floor(col / boxCols) * boxCols;

    for (let i = 0; i < boxRows; i++) {
        for (let j = 0; j < boxCols; j++) {
            if (board[boxRow + i][boxCol + j] === num) return false;
        }
    }
    return true;
};

const solveSudoku = (board) => {
    const size = board.length;
    for (let row = 0; row < size; row++) {
        for (let col = 0; col < size; col++) {
            if (!board[row][col]) {
                for (let num = 1; num <= size; num++) {
                    if (isValidMove(board, row, col, num)) {
                        board[row][col] = num;
                        if (solveSudoku(board)) return true;
                        board[row][col] = null;
                    }
                }
                return false;
            }
        }
    }
    return true;
};

const generateCompleteSudoku = (size) => {
    let board = createEmptyBoard(size);
    solveSudoku(board);
    return board;
};

const generateSudoku = (size = DEFAULT_SIZE, difficulty = "easy") => {
    let fullBoard = generateCompleteSudoku(size);
    let board = fullBoard.map(row => [...row]);
    let fillRatio = difficulty === "easy" ? EASY_MODE_RATIO : 0.2;
    let totalRemove = Math.floor(size * size * (1 - fillRatio));

    while (totalRemove > 0) {
        let row = Math.floor(Math.random() * size);
        let col = Math.floor(Math.random() * size);
        if (board[row][col] !== null) {
            board[row][col] = null;
            totalRemove--;
        }
    }
    return { board, solution: fullBoard };
};

const Sudoku = ({ size = DEFAULT_SIZE, difficulty = "easy" }) => {
    const { board: initialBoard, solution } = generateSudoku(size, difficulty);
    const [board, setBoard] = useState(initialBoard);
    const [userInputs, setUserInputs] = useState(createEmptyBoard(size));
    const [gameCompleted, setGameCompleted] = useState(false);
    const [score, setScore] = useState(0);

    const handleInputChange = (row, col, value) => {
        let num = parseInt(value, 10);
        if (isNaN(num) || num < 1 || num > size) {
            setUserInputs((prevInputs) => {
                const newInputs = prevInputs.map((rowArr) => [...rowArr]);
                newInputs[row][col] = "";
                return newInputs;
            });
            return;
        }

        setUserInputs((prevInputs) => {
            const newInputs = prevInputs.map((rowArr) => [...rowArr]);
            newInputs[row][col] = num;
            return newInputs;
        });

        checkGameCompletion();
    };

    const checkGameCompletion = () => {
        let correctInputs = 0;
        for (let row = 0; row < size; row++) {
            for (let col = 0; col < size; col++) {
                const userValue = userInputs[row][col];
                const solutionValue = solution[row][col];

                if (board[row][col] === null) {
                    if (userValue === solutionValue) {
                        correctInputs++;
                    } else {
                        setGameCompleted(false);
                        return;
                    }
                }
            }
        }
        setScore(correctInputs);
        setGameCompleted(true);
    };

    const giveHint = () => {
        let emptyCells = [];
        for (let row = 0; row < size; row++) {
            for (let col = 0; col < size; col++) {
                if (!board[row][col] && !userInputs[row][col]) {
                    emptyCells.push({ row, col });
                }
            }
        }

        if (emptyCells.length === 0) return;

        const { row, col } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        setUserInputs((prevInputs) => {
            const newInputs = prevInputs.map((rowArr) => [...rowArr]);
            newInputs[row][col] = solution[row][col];
            return newInputs;
        });
    };

    useEffect(() => {
        checkGameCompletion();
    }, [userInputs]);

    return (
        <div className="sudoku-container text-center mt-4">
            <h2>Sudoku Game (Easy Mode)</h2>
            {gameCompleted && (
                <div className="alert alert-success" role="alert">
                    Congratulations! You completed the Sudoku puzzle!<br />
                    Your Score: {score}
                </div>
            )}
            <div className="sudoku-grid">
                {board.map((row, rowIndex) =>
                    row.map((cell, colIndex) => (
                        <input
                            key={`${rowIndex}-${colIndex}`}
                            type="text"
                            maxLength="1"
                            className={`sudoku-cell ${cell ? "pre-filled" : userInputs[rowIndex][colIndex] ? "user-filled" : ""}`}
                            value={userInputs[rowIndex][colIndex] || cell || ""}
                            onChange={(e) => handleInputChange(rowIndex, colIndex, e.target.value)}
                            readOnly={cell !== null}
                        />
                    ))
                )}
            </div>
            <button
                className="btn btn-danger mt-3 me-2"
                onClick={() => {
                    const { board: newBoard, solution: newSolution } = generateSudoku(size, difficulty);
                    setBoard(newBoard);
                    setUserInputs(createEmptyBoard(size));
                    setGameCompleted(false);
                    setScore(0);
                }}
            >
                Restart Game
            </button>
            <button className="btn btn-primary mt-3" onClick={giveHint}>Get Hint</button>
        </div>
    );
};

export default Sudoku;
