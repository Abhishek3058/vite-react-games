import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./RockPaperScissors.css";

const choices = ["rock", "paper", "scissors"];
const icons = {
  rock: "fa-fist-raised",      // Rock icon
  paper: "fa-hand-paper",      // Paper icon
  scissors: "fa-hand-scissors" // Scissors icon
};

const RockPaperScissors = () => {
  const [playerChoice, setPlayerChoice] = useState(null);
  const [opponentChoice, setOpponentChoice] = useState(null);
  const [winner, setWinner] = useState(null);
  const [gameMode, setGameMode] = useState(null);

  useEffect(() => {
    if (playerChoice && gameMode === "computer") {
      setTimeout(() => makeComputerMove(), 500);
    }
  }, [playerChoice, gameMode]);

  const determineWinner = (player, opponent) => {
    if (player === opponent) return "It's a Draw! 🤝";
    if (
      (player === "rock" && opponent === "scissors") ||
      (player === "paper" && opponent === "rock") ||
      (player === "scissors" && opponent === "paper")
    ) {
      return "Player Wins! 🎉";
    }
    return gameMode === "player" ? "Player 2 Wins! 🏆" : "Computer Wins! 🤖";
  };

  const handleChoice = (choice) => {
    if (!gameMode) return;
    setPlayerChoice(choice);

    if (gameMode === "player") {
      if (!opponentChoice) {
        setOpponentChoice(choice);
      } else {
        setWinner(determineWinner(opponentChoice, choice));
        setOpponentChoice(null);
      }
    }
  };

  const makeComputerMove = () => {
    const randomChoice = choices[Math.floor(Math.random() * choices.length)];
    setOpponentChoice(randomChoice);
    setWinner(determineWinner(playerChoice, randomChoice));
  };

  const resetGame = () => {
    setPlayerChoice(null);
    setOpponentChoice(null);
    setWinner(null);
    setGameMode(null);
  };

  return (
    <div className="rock-paper-scissors-container text-center">
      <h2 className="mb-3">Rock Paper Scissors</h2>

      {!gameMode ? (
        <div className="game-mode-selection">
          <button className="btn btn-primary me-2" onClick={() => setGameMode("player")}>
            Play vs Player
          </button>
          <button className="btn btn-secondary" onClick={() => setGameMode("computer")}>
            Play vs Computer
          </button>
        </div>
      ) : (
        <>
          {winner && (
            <div className="alert alert-success" role="alert">
              <strong>{winner}</strong>
            </div>
          )}

          <h4 className="game-status">
            {!winner ? `Choose your move:` : ""}
          </h4>

          <div className="choices my-3">
            {choices.map((choice) => (
              <i
                key={choice}
                className={`material-icons choice-icon`}
                onClick={() => handleChoice(choice)}
              >
                {choice}
              </i>
            ))}
          </div>

          {playerChoice && (
            <div className="game-result mt-3">
              <p>Player Chose: <span className="material-icons">{playerChoice}</span></p>
              {opponentChoice && (
                <p>Opponent Chose: <span className="material-icons">{opponentChoice}</span></p>
              )}
            </div>
          )}

          <button className="btn btn-danger" onClick={resetGame}>
            Reset Game
          </button>
        </>
      )}
    </div>
  );
};

export default RockPaperScissors;
