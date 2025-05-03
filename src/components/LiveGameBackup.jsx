import React, { useEffect, useState } from "react";

const LiveGame = ({ gameData, summonerData }) => {
  const [gameTime, setGameTime] = useState("");
  
  useEffect(() => {
    if (!gameData?.gameStartTime) return;
    
    const updateTime = () => {
      const now = Date.now();
      const elapsedMinutes = Math.floor((now - gameData.gameStartTime) / 60000);
      const elapsedSeconds = Math.floor((now - gameData.gameStartTime) / 1000) % 60;
      setGameTime(`${elapsedMinutes.toString().padStart(2, "0")}:${elapsedSeconds.toString().padStart(2, "0")}`);
    };
    
    updateTime();
    
    const timer = setInterval(updateTime, 1000);
    
    return () => clearInterval(timer);
  }, [gameData?.gameStartTime]);
  
  if (!gameData) return (
    <div className="text-center mt-4 mb-4">
      No live game data available. The summoner is not currently in a game.
    </div>
  );

  const { participants, gameMode } = gameData;
  
  const blueTeam = participants.filter(p => p.teamId === 100);
  const redTeam = participants.filter(p => p.teamId === 200);
  
  const allParticipants = [...blueTeam, ...redTeam];

  return (
    <div className="container">
      <div className="text-center mb-3">
        <h4>{gameMode} - Game Time: {gameTime}</h4>
      </div>
      <div className="row justify-content-md-center">
        <div className="col-lg-12 mb-3">
          <div className="row row-cols-2 row-cols-lg-5 g-3">
            {allParticipants.map((participant, index) => {
              const isBlueTeam = participant.teamId === 100;
              const isSamePlayer = summonerData && 
                participant.summonerName === `${summonerData.gameName}#${summonerData.tagLine}`;
              
              return (
                <div className="col" key={index}>
                  <div className={`card ${isSamePlayer ? 'border border-warning' : ''}`}>
                    <div className="card-body text-center">
                      <div className="row">
                        <div className="col text-start mb-3">
                          <img 
                            src={`https://ddragon.leagueoflegends.com/cdn/15.8.1/img/spell/${participant.spell1Id}.png`} 
                            width="30" 
                            alt="Summoner Spell 1"
                          />
                          <img 
                            src={`https://ddragon.leagueoflegends.com/cdn/15.8.1/img/spell/${participant.spell2Id}.png`} 
                            width="30" 
                            alt="Summoner Spell 2"
                          />
                        </div>
                        <div className="col text-end mb-3">
                          {participant.perks && (
                            <>
                              <img 
                                src={`https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/${participant.perks.primaryRuneId}.png`} 
                                width="30" 
                                alt="Primary Rune"
                              />
                              <img 
                                src={`https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/${participant.perks.subStyleId}.png`} 
                                width="30" 
                                alt="Secondary Rune"
                              />
                            </>
                          )}
                        </div>
                      </div>
                      <img
                        src={`https://ddragon.leagueoflegends.com/cdn/15.8.1/img/champion/${participant.championName}.png`}
                        width="82"
                        alt={participant.championName}
                      />
                      <div className="mt-2 fw-bold">{participant.summonerName}</div>
                      {participant.rank && (
                        <>
                          <img
                            src={`/images/ranks/${participant.rank.tier.toLowerCase()}.png`}
                            width="64"
                            alt={participant.rank.tier}
                          />
                          <div>{participant.rank.tier} {participant.rank.rank} - {participant.rank.leaguePoints} LP</div>
                          <div>{participant.rank.winRate}% ({participant.rank.wins}W - {participant.rank.losses}L)</div>
                        </>
                      )}
                    </div>
                    <div className={`card-footer ${isBlueTeam ? 'live-team-blue' : 'live-team-red'}`}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveGame;