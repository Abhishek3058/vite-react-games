import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../App.css"; // Import the external CSS file

const TicTacToe = () => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [winner, setWinner] = useState(null);

  useEffect(() => {
    console.log("Current Board State:", board);
    const gameWinner = calculateWinner(board);
    if (gameWinner) {
      setWinner(gameWinner);
    }
  }, [board]);

  const calculateWinner = (squares) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], 
      [0, 3, 6], [1, 4, 7], [2, 5, 8], 
      [0, 4, 8], [2, 4, 6]
    ];

    for (let [a, b, c] of lines) {
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  };

  const handleClick = (index) => {
    if (board[index] || winner) return;
    const newBoard = [...board];
    newBoard[index] = isXNext ? "X" : "O";
    setBoard(newBoard);
    setIsXNext(!isXNext);
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setWinner(null);
  };

  return (
    <div className="tic-tac-toe-container">
      <h2 className="mb-3">Tic-Tac-Toe</h2>

      {winner && (
        <div className="alert alert-success d-flex align-items-center" role="alert">
          <i className="bi bi-trophy-fill me-2"></i>
          <strong>Winner: {winner} 🎉</strong>
        </div>
      )}

      <h4 className="game-status">
        {!winner ? `Next Player: ${isXNext ? "X" : "O"}` : ""}
      </h4>

      <div className="board">
        {board.map((value, index) => (
          <button key={index} className="cell" onClick={() => handleClick(index)}>
            {value}
          </button>
        ))}
      </div>

      <button className="btn btn-danger mt-3" onClick={resetGame}>
        Reset Game
      </button>
    </div>
  );
};

export default TicTacToe;
