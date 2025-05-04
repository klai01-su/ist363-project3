import React from "react";
import { getQueueDescription, getRuneImage, getSummonerSpellName, formatGameTime, getChampionData } from "../utils/helpers";

const LiveGame = ({ 
  summonerData, 
  liveGameData, 
  isLoadingLiveGame, 
  liveGameError,
  fetchLiveGameData 
}) => {
  const handleRefresh = () => {
    fetchLiveGameData();
  };
  
  if (!summonerData) {
    return (
      <div className="container-fluid mx-auto">
        <div className="row justify-content-md-center">
          <div className="col-lg-9 mb-3">
            <div className="alert alert-info">
              Search for a player to view their live game information.
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isLoadingLiveGame) {
    return (
      <div className="container-fluid mx-auto">
        <div className="row justify-content-md-center">
          <div className="col-lg-9 mb-3">
            <div className="text-center my-5">
              <div className="spinner-border" role="status" />
              <p className="mt-3">Loading live game data...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (liveGameError) {
    return (
      <div className="container-fluid mx-auto">
        <div className="row justify-content-md-center">
          <div className="col-lg-9 mb-3">
            <div className="alert alert-warning">
              {liveGameError}
              <button 
                className="btn btn-sm btn-primary ms-3" 
                onClick={handleRefresh}
              >
                Refresh
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!liveGameData) {
    return (
      <div className="container-fluid mx-auto">
        <div className="row justify-content-md-center">
          <div className="col-lg-9 mb-3">
            <div className="alert alert-info">
              {summonerData.gameName}#{summonerData.tagLine} is not currently in a game.
              <button 
                className="btn btn-sm btn-primary ms-3" 
                onClick={handleRefresh}
              >
                Refresh
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const gameMode = getQueueDescription(liveGameData.gameQueueConfigId) || liveGameData.gameMode;
  const gameLength = formatGameTime(liveGameData.gameLength);
  
  const blueTeam = liveGameData.participants.filter(player => player.teamId === 100);
  const redTeam = liveGameData.participants.filter(player => player.teamId === 200);
  
  const renderPlayerCard = (player, index) => {
    const teamColor = player.teamId === 100 ? "live-team-blue" : "live-team-red";
    
    return (
      <div className="col" key={index}>
        <div className="card w-100 h-100 d-flex flex-column">
          <div className="card-body text-center flex-grow-1">
            <div className="row">
              <div className="col text-start mb-3">
                <img 
                  src={`https://ddragon.leagueoflegends.com/cdn/15.8.1/img/spell/Summoner${getSummonerSpellName(player.spell1Id)}.png`}
                  width="20px"
                  className="mx-1"
                  alt={getSummonerSpellName(player.spell1Id)}
                />
                <img 
                  src={`https://ddragon.leagueoflegends.com/cdn/15.8.1/img/spell/Summoner${getSummonerSpellName(player.spell2Id)}.png`}
                  width="20px"
                  className="mx-1"
                  alt={getSummonerSpellName(player.spell2Id)}
                />
              </div>
              <div className="col text-end mb-3">
                <img 
                  src={getRuneImage(player.perks.perkIds[0])}
                  width="30px"
                  alt="Primary Rune"
                />
                <img 
                  src={getRuneImage(player.perks.perkSubStyle)}
                  width="20px"
                  alt="Secondary Rune Path"
                />
              </div>
            </div>
            <div>
              <img 
                src={`https://ddragon.leagueoflegends.com/cdn/15.8.1/img/champion/${getChampionData(player.championId).key}.png`}
                width="60px"
                alt={getChampionData(player.championId).key}
              />
            </div>
            <div className="mt-2">
              {player.riotId}
            </div>
          </div>
          <div className={`card-footer ${teamColor}`}></div>
        </div>
      </div>
    );
  };

  return (
    <div className="container-fluid mx-auto">
      <div className="text-center mb-3">
        <h5>{gameMode} - {gameLength}</h5>
        <button 
          className="btn btn-sm btn-primary ms-3" 
          onClick={handleRefresh}
        >
          Refresh
        </button>
      </div>
      <div className="row justify-content-md-center">
        <div className="col-lg-9 mb-3">
          <div className="row row-cols-2 row-cols-lg-5 g-3">

            {blueTeam.map((player, index) => renderPlayerCard(player, `blue-${index}`))}
            
            {redTeam.map((player, index) => renderPlayerCard(player, `red-${index}`))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveGame;