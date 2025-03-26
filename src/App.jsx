import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Sidebar from "./layout/Sidebar";
import TicTacToe from "./components/TicTacToe";

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
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
