import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Sidebar from "./layout/sidebar";
import TicTacToe from "./components/TicTacToe/TicTacToe";
import Puzzle2048 from "./components/2048/2048";
import Sudoku from "./components/Suduko/Suduko";
import RockPaperScissors from "./components/RockPaperScissors/RockPaperScissors";

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <Router>
      <div className="d-flex">
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        
        {/* Main Content Area */}
        <div
          className="container-fluid"
          style={{
            marginLeft: isSidebarOpen ? "260px" : "0px",
            padding: "30px",
            minHeight: "100vh",
            backgroundColor: "#f8f9fa",
            transition: "margin-left 0.3s ease",
            width: isSidebarOpen ? "calc(100% - 260px)" : "100%",
          }}
        >
          <Routes>
            <Route path="/" element={<h1 className="text-center mt-5 text-dark">Welcome to the Game Zone 🎮</h1>} />
            <Route path="/tic-tac-toe" element={<TicTacToe />} />
            <Route path="/game-2048" element={<Puzzle2048 />} />
            <Route path="/sudoku" element={<Sudoku />} />
            <Route path="/rock-paper-scissors" element={<RockPaperScissors />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
