import React, { useEffect } from "react";
import SearchBar from "./components/SearchBar";
import ProfileHeader from "./components/ProfileHeader";
import NavigationTabs from "./components/NavigationTabs";
import ProfileOverview from "./components/ProfileOverview";
import ProfileChampions from "./components/ProfileChampions";
import LiveGame from "./components/LiveGame";
import useSummonerData from "./hooks/useSummonerData";
import "./App.css";

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
    // liveGameData,
    // refreshLiveGame,
    toggleMatchDetails,
    activePage,
    setActivePage
  } = useSummonerData();


  // useEffect(() => {
  //   if (activePage === "live" && summonerData) {
  //     refreshLiveGame();
  //   }
  // }, [activePage, summonerData]);

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

          {activePage === "live" && (
            <LiveGame 
              // gameData={liveGameData} 
              // summonerData={summonerData}
            />
          )}
        </>
      )}
    </div>
  );
};

export default SummonerProfile;