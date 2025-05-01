import { useState } from "react";
import "./App.css";
import '../bootstrap-5.3.3/dist/css/bootstrap.min.css';
import '../bootstrap-5.3.3/dist/js/bootstrap.bundle.min.js';

import ProfileChampion from './ProfileChampion';
import ProfileLivegame from './ProfileLivegame';

function App() {
  const [page, setPage] = useState("overview");
  
  return (  
    <div className="container">
      <div className="nav-bar d-flex text-center mt-3">
        <a 
          className={`nav-tab ${page === "overview" ? "active" : ""}`} 
          onClick={() => setPage("overview")}
        >
          Overview
        </a>
        <a 
          className={`nav-tab ${page === "champions" ? "active" : ""}`} 
          onClick={() => setPage("champions")}
        >
          Champions
        </a>
        <a 
          className={`nav-tab ${page === "livegame" ? "active" : ""}`} 
          onClick={() => setPage("livegame")}
        >
          Live Game
        </a>
      </div>

      {page === "overview" && <ProfileOverview />}
      {page === "champions" && <ProfileChampion />}
      {page === "livegame" && <ProfileLivegame />}
    </div>

  );
}

function ProfileOverview() {
  return (
    <div>
      <h1>Overview</h1>
      <p>page 1</p>
    </div>
  );
}

export default App;