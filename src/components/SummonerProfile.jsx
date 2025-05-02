import React from "react";
import SearchBar from "./SearchBar";
import ProfileHeader from "./ProfileHeader";
import NavigationTabs from "./NavigationTabs";
import ProfileOverview from "./ProfileOverview";
import ProfileChampions from "./ProfileChampions";
// import LiveGame from "./LiveGame";
import useSummonerData from "../hooks/useSummonerData";

const SummonerProfile = () => {
  const {
    region,
    setRegion,
    input,
    setInput,
    handleKeyPress,
    handleSearch,
    error,
    isLoading,
    summonerData,
    rankedData,
    matches,
    championStats,
    toggleMatchDetails,
    activePage,
    setActivePage
  } = useSummonerData();

  return (
    <div className="profile">
      <div className="main-container">
        <h1 className="logo">LOL.GG</h1>
        <SearchBar
          region={region}
          setRegion={setRegion}
          input={input}
          setInput={setInput}
          handleKeyPress={handleKeyPress}
          handleSearch={handleSearch}
        />
      </div>

      {error && <div className="alert alert-danger container">{error}</div>}
      {isLoading && (
        <div className="text-center my-5">
          <div className="spinner-border" role="status" />
        </div>
      )}

      {summonerData && (
        <>
          <ProfileHeader summonerData={summonerData} championStats={championStats} />
          <NavigationTabs activePage={activePage} setActivePage={setActivePage} />

          {activePage === "overview" && (
            <ProfileOverview
              summonerData={summonerData}
              rankedData={rankedData}
              matches={matches}
              championStats={championStats}
              isLoading={isLoading}
              toggleMatchDetails={toggleMatchDetails}
            />
          )}

          {activePage === "champions" && (
            <ProfileChampions
              summonerData={summonerData}
              championStats={championStats}
              matches={matches}
            />
          )}

          {activePage === "live" && <LiveGame summonerData={summonerData} />}
        </>
      )}
    </div>
  );
};

export default SummonerProfile;
