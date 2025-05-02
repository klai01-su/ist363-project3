import React from "react";

const NavigationTabs = ({ activePage, setActivePage }) => (
  <div className="container-fluid mx-auto">
    <div className="row justify-content-md-center">
      <div className="col-lg-9 mb-3">
        <div className="nav-bar d-flex text-center mt-3">
          <a
            href="#"
            className={`nav-tab ${activePage === 'overview' ? 'active' : ''}`}
            onClick={(e) => {
              e.preventDefault();
              setActivePage('overview');
            }}
          >
            Overview
          </a>
          <a
            href="#"
            className={`nav-tab ${activePage === 'champions' ? 'active' : ''}`}
            onClick={(e) => {
              e.preventDefault();
              setActivePage('champions');
            }}
          >
            Champions
          </a>
          <a
            href="#"
            className={`nav-tab ${activePage === 'live' ? 'active' : ''}`}
            onClick={(e) => {
              e.preventDefault();
              setActivePage('live');
            }}
          >
            Live Game
          </a>
        </div>
      </div>
    </div>
  </div>
);

export default NavigationTabs;
