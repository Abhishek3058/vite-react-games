import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Suduko.css";

const DEFAULT_SIZE = 6;
const DIFFICULTY_LEVELS = {
    easy: 0.5,
    medium: 0.35,
    hard: 0.2,
};

const createEmptyBoard = (size) =>
    Array.from({ length: size }, () => Array(size).fill(null));

const isValidMove = (board, row, col, num) => {
    const size = board.length;
    const boxRows = Math.floor(Math.sqrt(size));
    const boxCols = size / boxRows;

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
                // Create an array of numbers to try and shuffle it
                let numbers = Array.from({ length: size }, (_, i) => i + 1);
                for (let i = numbers.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [numbers[i], numbers[j]] = [numbers[j], numbers[i]]; // Fisher-Yates Shuffle
                }
                for (let num of numbers) {
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
    let fillRatio = DIFFICULTY_LEVELS[difficulty] || 0.4;
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

const Sudoku = () => {
    const [difficulty, setDifficulty] = useState("easy");
    const [sizeGrid, setSizeGrid] = useState(DEFAULT_SIZE);
    const [board, setBoard] = useState([]);
    const [solution, setSolution] = useState([]);
    const [userInputs, setUserInputs] = useState([]);
    const [gameCompleted, setGameCompleted] = useState(false);
    const [score, setScore] = useState(0);

    const gridStyle = {
        display: "grid",
        gridTemplateColumns: `repeat(${sizeGrid}, 40px)`,
        gap: "2px",
        border: "2px solid black",
        padding: "5px",
        margin: "10px auto",
        width: "fit-content",
      };


    useEffect(() => {
        restartGame(sizeGrid, difficulty);
    }, [sizeGrid, difficulty]);

    const restartGame = (size, difficulty) => {
        const { board: newBoard, solution: newSolution } = generateSudoku(sizeGrid, difficulty);
console.log("Generated Board:", newBoard);
console.log("Generated Solution:", newSolution);

        setBoard(newBoard);
        setSolution(newSolution);
        setUserInputs(createEmptyBoard(size));
        setGameCompleted(false);
        setScore(0);
    };

    const handleInputChange = (row, col, value) => {
        let num = parseInt(value, 10);
        if (isNaN(num) || num < 1 || num > sizeGrid) {
            setUserInputs(prev => {
                const newInputs = prev.map(rowArr => [...rowArr]);
                newInputs[row][col] = "";
                return newInputs;
            });
            return;
        }

        setUserInputs(prev => {
            const newInputs = prev.map(rowArr => [...rowArr]);
            newInputs[row][col] = num;
            return newInputs;
        });
    };

    useEffect(() => {
        if (board.length > 0) {
            checkGameCompletion();  // Call only when board is updated
        }
    }, [board, userInputs]);
    

    const checkGameCompletion = () => {
        console.log('board==>',board);
        
        let correctInputs = 0;
        for (let row = 0; row < sizeGrid; row++) {
            for (let col = 0; col < sizeGrid; col++) {
                if (board[row][col] === null) {
                    if (userInputs[row][col] === solution[row][col]) {
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
        for (let row = 0; row < sizeGrid; row++) {
            for (let col = 0; col < sizeGrid; col++) {
                if (!board[row][col] && !userInputs[row][col]) {
                    emptyCells.push({ row, col });
                }
            }
        }

        if (emptyCells.length === 0) return;

        const { row, col } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        setUserInputs(prev => {
            const newInputs = prev.map(rowArr => [...rowArr]);
            newInputs[row][col] = solution[row][col];
            return newInputs;
        });
    };

    return (
        <div className="sudoku-container text-center mt-4">
            <h2>Sudoku Game</h2>
            <div className="difficulty-selector">
                <label>Select Size:</label>
                <select className="form-select w-auto d-inline-block ms-2"
                    value={sizeGrid}
                    onChange={(e) => setSizeGrid(parseInt(e.target.value, 10))}>
                    <option value={4}>4x4</option>
                    <option value={6}>6x6</option>
                    <option value={9}>9x9</option>
                </select>
            </div>
            <div className="difficulty-selector">
                <label>Select Difficulty:</label>
                <select className="form-select w-auto d-inline-block ms-2"
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}>
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                </select>
            </div>
            {gameCompleted && <div className="alert alert-success">🎉 You completed the puzzle! Score: {score}</div>}
            <div style={gridStyle}>
                {board.map((row, rowIndex) => row.map((cell, colIndex) => (
                    <input key={`${rowIndex}-${colIndex}`} type="text"
                    className={`sudoku-cell ${cell ? "pre-filled" : userInputs[rowIndex][colIndex] ? "user-filled" : ""}`}
                        value={userInputs[rowIndex][colIndex] || cell || ""}
                        onChange={(e) => handleInputChange(rowIndex, colIndex, e.target.value)}
                        readOnly={cell !== null} />
                )))}
            </div>
            <button className="btn btn-danger mt-3 me-2" onClick={() => restartGame(sizeGrid, difficulty)}>Restart</button>
            <button className="btn btn-primary mt-3" onClick={giveHint}>Get Hint</button>
        </div>
    );
};

export default Sudoku;
