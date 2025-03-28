import { Link, NavLink } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css"; // Import Bootstrap Icons

const games = [
  { path: "/tic-tac-toe", name: "Tic Tac Toe", icon: "bi bi-grid-3x3-gap" },
  { path: "/game-2048", name: "2048", icon: "bi bi-border-all" },
  { path: "/sudoku", name: "Sudoku", icon: "bi bi-table" }, // Added Sudoku game
];

const Sidebar = ({ isOpen, toggleSidebar }) => {
  return (
    <>
      {/* Sidebar */}
      {isOpen && (
        <div
          className="d-flex flex-column p-3 bg-dark text-white"
          style={{
            width: "250px",
            height: "100vh",
            position: "fixed",
            boxShadow: "2px 0px 10px rgba(0,0,0,0.3)",
            transition: "0.3s",
          }}
        >
          {/* Close Button Inside Sidebar */}
          <div className="d-flex justify-content-end">
            <button className="btn btn-outline-light btn-sm" onClick={toggleSidebar}>
              <i className="bi bi-x-lg"></i>
            </button>
          </div>

          <h3 className="text-center mb-4 text-light">
            <i className="bi bi-controller"></i> Game Zone
          </h3>

          <ul className="nav nav-pills flex-column mb-4">
            <li className="nav-item">
              <NavLink to="/" className="nav-link text-white" activeclassname="active">
                <i className="bi bi-house-door"></i> Home
              </NavLink>
            </li>
          </ul>

          <h5 className="text-secondary">Games</h5>
          <ul className="nav nav-pills flex-column">
            {games.map((game) => (
              <li className="nav-item" key={game.path}>
                <NavLink to={game.path} className="nav-link text-white" activeclassname="active">
                  <i className={game.icon}></i> {game.name}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Sidebar Open Button (Outside Sidebar) */}
      {!isOpen && (
        <button
          className="btn btn-dark position-fixed"
          style={{
            top: "20px",
            left: "10px",
            zIndex: 1000,
            transition: "left 0.3s",
          }}
          onClick={toggleSidebar}
        >
          <i className="bi bi-list"></i>
        </button>
      )}
    </>
  );
};

export default Sidebar;
