import React from "react";

const SearchBar = ({ region, setRegion, input, setInput, handleKeyPress, handleSearch }) => (
  <form className="search-form" onSubmit={(e) => { e.preventDefault(); handleSearch(); }}>
    <div className="search-container">
      <select
        className="region-select"
        value={region}
        onChange={(e) => setRegion(e.target.value)}
      >
        <option value="" disabled>Select Region</option>
        <option value="NA">North America</option>
        <option value="KR">Korea</option>
        <option value="EUW">Europe West</option>
      </select>
      <input
        type="text"
        className="search-input"
        placeholder="Game Name + #ID (e.g. Doublelift#NA01)"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyPress={handleKeyPress}
      />
    </div>
  </form>
);

export default SearchBar;
