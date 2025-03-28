import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Tictactoe.css";

const TicTacToe = () => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [winner, setWinner] = useState(null);
  const [gameMode, setGameMode] = useState(null);

  useEffect(() => {
    const gameWinner = calculateWinner(board);
    if (gameWinner) {
      setWinner(gameWinner);
    } else if (!board.includes(null)) {
      setWinner("Draw");
    } else if (!isXNext && gameMode === "computer") {
      setTimeout(() => makeComputerMove(), 500);
    }
  }, [board, isXNext, gameMode]);

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
    if (board[index] || winner || !gameMode) return;
    const newBoard = [...board];
    newBoard[index] = isXNext ? "X" : "O";
    setBoard(newBoard);
    setIsXNext(!isXNext);
  };

  const makeComputerMove = () => {
    const availableMoves = board.map((v, i) => (v === null ? i : null)).filter(v => v !== null);
    if (availableMoves.length === 0) return;

    // Try to win or block opponent first
    for (let move of availableMoves) {
      const tempBoard = [...board];
      tempBoard[move] = "O";
      if (calculateWinner(tempBoard) === "O") {
        return handleClick(move);
      }
    }
    for (let move of availableMoves) {
      const tempBoard = [...board];
      tempBoard[move] = "X";
      if (calculateWinner(tempBoard) === "X") {
        return handleClick(move);
      }
    }

    // Otherwise, play a random move
    const randomMove = availableMoves[Math.floor(Math.random() * availableMoves.length)];
    handleClick(randomMove);
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setWinner(null);
    setGameMode(null);
  };

  return (
    <div className="tic-tac-toe-container">
      <h2 className="mb-3">Tic-Tac-Toe</h2>

      {!gameMode ? (
        <div className="game-mode-selection">
          <button className="btn btn-primary me-2" onClick={() => setGameMode("player")}>Play vs Player</button>
          <button className="btn btn-secondary" onClick={() => setGameMode("computer")}>Play vs Computer</button>
        </div>
      ) : (
        <>
          {winner && (
            <div className="alert alert-success d-flex align-items-center" role="alert">
              <strong>{winner === "Draw" ? "It's a Draw! 🤝" : `Winner: ${winner} 🎉`}</strong>
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

          <button className="btn btn-danger mt-3" onClick={resetGame}>Reset Game</button>
        </>
      )}
    </div>
  );
};

export default TicTacToe;
