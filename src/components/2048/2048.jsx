import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./2048.css";

const GRID_SIZE = 4;

const getEmptyBoard = () => Array(GRID_SIZE).fill().map(() => Array(GRID_SIZE).fill(null));

const addRandomTile = (board) => {
  let emptyCells = [];
  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      if (!board[row][col]) emptyCells.push({ row, col });
    }
  }
  if (emptyCells.length === 0) return board;

  const { row, col } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
  board[row][col] = Math.random() > 0.9 ? 4 : 2;
  return board;
};

const moveAndMerge = (board, direction) => {
  let newBoard = board.map(row => [...row]);

  const slide = (arr) => {
    console.log('arr==>',arr);
    
    let filtered = arr.filter(val => val !== null);
    for (let i = 0; i < filtered.length - 1; i++) {
      if (filtered[i] === filtered[i + 1]) {
        filtered[i] *= 2;
        filtered[i + 1] = null;
      }
    }
    return [...filtered.filter(val => val !== null), ...Array(GRID_SIZE - filtered.filter(val => val !== null).length).fill(null)];
  };

  if (direction === "left") {
    newBoard = newBoard.map(row => slide(row));
  } else if (direction === "right") {
    newBoard = newBoard.map(row => slide(row.reverse()).reverse());
  } else if (direction === "up") {
    for (let col = 0; col < GRID_SIZE; col++) {
      let colArray = newBoard.map(row => row[col]);
      let mergedCol = slide(colArray);
      for (let row = 0; row < GRID_SIZE; row++) newBoard[row][col] = mergedCol[row];
    }
  } else if (direction === "down") {
    for (let col = 0; col < GRID_SIZE; col++) {
      let colArray = newBoard.map(row => row[col]);
      let mergedCol = slide(colArray.reverse()).reverse();
      for (let row = 0; row < GRID_SIZE; row++) newBoard[row][col] = mergedCol[row];
    }
  }
  return newBoard;
};

const isGameOver = (board) => {
  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      if (!board[row][col]) return false;
      if (col < GRID_SIZE - 1 && board[row][col] === board[row][col + 1]) return false;
      if (row < GRID_SIZE - 1 && board[row][col] === board[row + 1][col]) return false;
    }
  }
  return true;
};

const Game2048 = () => {
  const [board, setBoard] = useState(() => addRandomTile(addRandomTile(getEmptyBoard())));
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => Number(localStorage.getItem("highScore")) || 0);

  useEffect(() => {
    const handleKeyDown = (event) => {
      const keyMap = { ArrowLeft: "left", ArrowRight: "right", ArrowUp: "up", ArrowDown: "down" };
      if (!keyMap[event.key]) return;
      
      let newBoard = moveAndMerge(board, keyMap[event.key]);
      if (JSON.stringify(newBoard) !== JSON.stringify(board)) {
        newBoard = addRandomTile(newBoard);
        setBoard(newBoard);
        setScore(prevScore => {
          const newScore = prevScore + 10;
          if (newScore > highScore) {
            setHighScore(newScore);
            localStorage.setItem("highScore", newScore);
          }
          return newScore;
        });
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [board, highScore]);

  useEffect(() => {
    if (isGameOver(board)) {
      alert(`Game Over! Your score: ${score}\nHigh Score: ${highScore}`);
    }
  }, [board, score, highScore]);

  return (
    <div className="text-center mt-4">
      <h2>2048 Game</h2>
      <h4 className="mb-3">Score: <span className="badge bg-primary">{score}</span></h4>
      <h4 className="mb-3">High Score: <span className="badge bg-success">{highScore}</span></h4>

      <div className="grid-container">
        {board.map((row, rowIndex) => (
          <div key={rowIndex} className="d-flex justify-content-center">
            {row.map((cell, colIndex) => (
              <div key={colIndex} className={`grid-cell ${cell ? "filled" : ""}`}>
                {cell}
              </div>
            ))}
          </div>
        ))}
      </div><br />

      <button className="btn btn-danger mt-3" onClick={() => {
        setBoard(addRandomTile(addRandomTile(getEmptyBoard())));
        setScore(0);
      }}>
        Restart Game
      </button>
    </div>
  );
};

export default Game2048;
