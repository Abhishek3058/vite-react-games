import React, { useState, useEffect, useRef } from 'react';
import './SnakeGame.css';

const BOARD_SIZE = 20;
const CELL_SIZE = 20; // in pixels
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const INITIAL_FOOD = { x: 15, y: 15 };
const INITIAL_DIRECTION = { x: 0, y: 0 };
const GAME_SPEED = 200; // milliseconds

function SnakeGame() {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [food, setFood] = useState(INITIAL_FOOD);
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [isPlaying, setIsPlaying] = useState(false);
  const gameLoopRef = useRef(null);

  useEffect(() => {
    if (isPlaying) {
      gameLoopRef.current = setInterval(moveSnake, GAME_SPEED);
    } else {
      clearInterval(gameLoopRef.current);
    }

    return () => clearInterval(gameLoopRef.current);
  }, [isPlaying, snake]); // Added snake as dependency to ensure the effect re-runs when snake updates

  useEffect(() => {
    const handleKeyDown = (e) => {
      switch (e.key) {
        case 'ArrowUp':
          if (direction.y === 0) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
          if (direction.y === 0) setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
          if (direction.x === 0) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
          if (direction.x === 0) setDirection({ x: 1, y: 0 });
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [direction]); // Added direction as dependency

  const moveSnake = () => {
    setSnake(prevSnake => {
      const head = { x: prevSnake[0].x + direction.x, y: prevSnake[0].y + direction.y };

      // Check for boundary collision
      if (head.x < 0 || head.x >= BOARD_SIZE || head.y < 0 || head.y >= BOARD_SIZE) {
        endGame();
        return prevSnake;
      }

      // Check for self-collision
      for (let i = 1; i < prevSnake.length; i++) {
        if (head.x === prevSnake[i].x && head.y === prevSnake[i].y) {
          endGame();
          return prevSnake;
        }
      }

      const newSnake = [head, ...prevSnake];

      // Check for food collision
      if (head.x === food.x && head.y === food.y) {
        // Food eaten, generate new food (implementation for new food placement can be added later)
        // For now, snake just grows
      } else {
        // Remove tail if no food eaten
        newSnake.pop();
      }

      return newSnake;
    });
  };

  const startGame = () => {
    setSnake(INITIAL_SNAKE);
    setFood(INITIAL_FOOD);
    setDirection(INITIAL_DIRECTION);
    setIsPlaying(true);
  };

  const endGame = () => {
    setIsPlaying(false);
    alert("Game Over!"); // Simple alert for now
  };

  return (
    <div className="snake-game-container">
      <h2>Snake Game</h2>
      <div
        className="game-board"
        style={{
          width: BOARD_SIZE * CELL_SIZE,
          height: BOARD_SIZE * CELL_SIZE,
        }}
      >
        {snake.map((segment, index) => (
          <div
            key={index}
            className="snake-segment"
            style={{
              top: segment.y * CELL_SIZE,
              left: segment.x * CELL_SIZE,
              width: CELL_SIZE,
              height: CELL_SIZE,
            }}
          ></div>
        ))}
        <div
          className="food"
          style={{
            top: food.y * CELL_SIZE,
            left: food.x * CELL_SIZE,
            width: CELL_SIZE,
            height: CELL_SIZE,
          }}
        ></div>
      </div>
      {!isPlaying && (
        <button onClick={startGame}>Start Game</button>
      )}
    </div>
  );
}

export default SnakeGame;