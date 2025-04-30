import React, { useState } from "react";
import "./App.css";
import '../bootstrap-5.3.3/dist/css/bootstrap.min.css';
import '../bootstrap-5.3.3/dist/js/bootstrap.bundle.min.js';

const REGION_ROUTING = {
  "NA": { platform: "na1", routing: "americas", label: "North America" },
  "KR": { platform: "kr", routing: "asia", label: "Korea" },
  "EUW": { platform: "euw1", routing: "europe", label: "Europe West" }
};

const SummonerProfile = () => {
  const [region, setRegion] = useState("NA");
  const [input, setInput] = useState("");
  const [summonerData, setSummonerData] = useState(null);
  const [matches, setMatches] = useState([]);
  const [rankedData, setRankedData] = useState({ solo: null, flex: null });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [championStats, setChampionStats] = useState([]);

  const API_KEY = import.meta.env.VITE_RIOT_API_KEY;

  const handleSearch = async () => {
    setError("");
    setIsLoading(true);
    setSummonerData(null);
    setMatches([]);
    setRankedData({ solo: null, flex: null });
    setChampionStats([]);

    try {
      const [gameName, tagLine] = input.split("#");
      if (!gameName || !tagLine) {
        setError("Please enter correct format: Name#TAG");
        setIsLoading(false);
        return;
      }

      const { platform, routing } = REGION_ROUTING[region];

      // Fetch account data
      const accountRes = await fetch(
        `https://${routing}.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${encodeURIComponent(gameName)}/${encodeURIComponent(tagLine)}`,
        { headers: { "X-Riot-Token": API_KEY } }
      );
      if (!accountRes.ok) throw new Error("Failed to fetch account data");
      const accountData = await accountRes.json();
      const puuid = accountData.puuid;

      // Fetch summoner data
      const summonerRes = await fetch(
        `https://${platform}.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${puuid}`,
        { headers: { "X-Riot-Token": API_KEY } }
      );
      if (!summonerRes.ok) throw new Error("Failed to fetch summoner data");
      const summoner = await summonerRes.json();

      // Fetch ranked data
      const rankedRes = await fetch(
        `https://${platform}.api.riotgames.com/lol/league/v4/entries/by-summoner/${summoner.id}`,
        { headers: { "X-Riot-Token": API_KEY } }
      );
      if (!rankedRes.ok) throw new Error("Failed to fetch ranked data");
      const rankedDataArray = await rankedRes.json();
      
      const soloQueue = rankedDataArray.find(entry => entry.queueType === "RANKED_SOLO_5x5");
      const flexQueue = rankedDataArray.find(entry => entry.queueType === "RANKED_FLEX_SR");

      // Fetch match IDs
      const matchRes = await fetch(
        `https://${routing}.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?start=0&count=10`,
        { headers: { "X-Riot-Token": API_KEY } }
      );
      if (!matchRes.ok) throw new Error("Failed to fetch match IDs");
      const matchIds = await matchRes.json();

      // Fetch match details
      const matchDetails = await Promise.all(
        matchIds.map(async (matchId) => {
          const matchDetailRes = await fetch(
            `https://${routing}.api.riotgames.com/lol/match/v5/matches/${matchId}`,
            { headers: { "X-Riot-Token": API_KEY } }
          );
          if (!matchDetailRes.ok) throw new Error("Failed to fetch match details");
          return await matchDetailRes.json();
        })
      );

      // Process summoner data
      setSummonerData({
        gameName: accountData.gameName,
        tagLine: accountData.tagLine,
        region: REGION_ROUTING[region].label,
        level: summoner.summonerLevel,
        iconId: summoner.profileIconId,
      });

      // Process ranked data
      setRankedData({
        solo: soloQueue ? {
          tier: soloQueue.tier,
          rank: soloQueue.rank,
          leaguePoints: soloQueue.leaguePoints,
          wins: soloQueue.wins,
          losses: soloQueue.losses,
          winRate: Math.round((soloQueue.wins / (soloQueue.wins + soloQueue.losses)) * 100)
        } : null,
        flex: flexQueue ? {
          tier: flexQueue.tier,
          rank: flexQueue.rank,
          leaguePoints: flexQueue.leaguePoints,
          wins: flexQueue.wins,
          losses: flexQueue.losses,
          winRate: Math.round((flexQueue.wins / (flexQueue.wins + flexQueue.losses)) * 100)
        } : null
      });

      // Process match data
      const processedMatches = matchDetails.map(match => {
        const player = match.info.participants.find(p => p.puuid === puuid);
        const gameDuration = Math.floor(match.info.gameDuration / 60) + "m " + (match.info.gameDuration % 60) + "s";
        const gameCreation = new Date(match.info.gameStartTimestamp).toLocaleDateString();
        
        return {
          matchId: match.metadata.matchId,
          gameMode: match.info.gameMode,
          gameType: match.info.gameType,
          date: gameCreation,
          duration: gameDuration,
          win: player.win,
          championId: player.championId,
          championName: player.championName,
          kills: player.kills,
          deaths: player.deaths,
          assists: player.assists,
          kda: player.deaths === 0 ? 'Perfect' : ((player.kills + player.assists) / player.deaths).toFixed(2),
          cs: player.totalMinionsKilled + player.neutralMinionsKilled,
          csPerMin: ((player.totalMinionsKilled + player.neutralMinionsKilled) / (match.info.gameDuration / 60)).toFixed(1),
          goldEarned: (player.goldEarned / 1000).toFixed(1) + "K",
          summoner1Id: player.summoner1Id,
          summoner2Id: player.summoner2Id,
          primaryRuneId: player.perks?.styles?.[0]?.selections?.[0]?.perk,
          subStyleId: player.perks?.styles?.[1]?.style,
          item0: player.item0,
          item1: player.item1,
          item2: player.item2,
          item3: player.item3,
          item4: player.item4,
          item5: player.item5,
          item6: player.item6,
          teamMembers: match.info.participants
            .filter(p => p.teamId === player.teamId)
            .map(p => ({
              summonerName: p.summonerName,
              championName: p.championName,
              kills: p.kills,
              deaths: p.deaths,
              assists: p.assists,
              cs: p.totalMinionsKilled + p.neutralMinionsKilled,
              goldEarned: (p.goldEarned / 1000).toFixed(1) + "K"
            })),
          opposingTeam: match.info.participants
            .filter(p => p.teamId !== player.teamId)
            .map(p => ({
              summonerName: p.summonerName,
              championName: p.championName,
              kills: p.kills,
              deaths: p.deaths,
              assists: p.assists,
              cs: p.totalMinionsKilled + p.neutralMinionsKilled,
              goldEarned: (p.goldEarned / 1000).toFixed(1) + "K"
            }))
        };
      });

      setMatches(processedMatches);

      // Calculate champion statistics
      const champStats = {};
      processedMatches.forEach(match => {
        if (!champStats[match.championName]) {
          champStats[match.championName] = {
            championName: match.championName,
            games: 0,
            wins: 0,
            losses: 0,
            kills: 0,
            deaths: 0,
            assists: 0
          };
        }
        
        champStats[match.championName].games += 1;
        if (match.win) {
          champStats[match.championName].wins += 1;
        } else {
          champStats[match.championName].losses += 1;
        }
        champStats[match.championName].kills += match.kills;
        champStats[match.championName].deaths += match.deaths;
        champStats[match.championName].assists += match.assists;
      });

      const topChamps = Object.values(champStats)
        .map(champ => ({
          ...champ,
          winRate: Math.round((champ.wins / champ.games) * 100),
          kda: champ.deaths === 0 ? 'Perfect' : ((champ.kills + champ.assists) / champ.deaths).toFixed(2)
        }))
        .sort((a, b) => b.games - a.games)
        .slice(0, 3);

      setChampionStats(topChamps);

      setIsLoading(false);
    } catch (err) {
      setError("Error fetching data. Check Riot ID & region.");
      console.error(err);
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const toggleMatchDetails = (matchId) => {
    const element = document.getElementById(`collapse-${matchId}`);
    const button = document.getElementById(`button-${matchId}`);
    
    if (element && button) {
      if (element.classList.contains('show')) {
        element.classList.remove('show');
        button.classList.add('collapsed');
      } else {
        element.classList.add('show');
        button.classList.remove('collapsed');
      }
    }
  };

  return (
    <div className="profile">
      <div className="main-container">
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
              placeholder="Game Name + #ID"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
            />
          </div>
        </form>
      </div>

      {error && (
        <div className="container-fluid mx-auto">
          <div className="row justify-content-md-center">
            <div className="col-lg-9">
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            </div>
          </div>
        </div>
      )}

      {isLoading && (
        <div className="container-fluid mx-auto">
          <div className="row justify-content-md-center">
            <div className="col-lg-9 text-center mt-5">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {summonerData && (
        <>
          <div className="container-fluid mx-auto">
            <div className="row justify-content-md-center">
              <div className="col-lg-9 mb-3">
                <div className="card text-bg-dark">
                  <img 
                    src="https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Aatrox_0.jpg"
                    className="card-img profile-img" 
                    alt="Profile Background"
                  />
                  <div className="card-img-overlay">
                    <div className="d-flex">
                      <img 
                        src={`https://ddragon.leagueoflegends.com/cdn/15.8.1/img/profileicon/${summonerData.iconId}.png`} 
                        width="100"
                        className="img-fluid"
                        alt="Profile Icon"
                      />
                      <div className="ms-3">
                        <div className="card-title fs-4">{summonerData.gameName}#{summonerData.tagLine}</div>
                        <div className="card-text">
                          Level: {summonerData.level}<br />
                          {summonerData.region}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="nav-bar d-flex text-center mt-3">
                  <a href="#" className="nav-tab active">Overview</a>
                  <a href="#" className="nav-tab">Champions</a>
                  <a href="#" className="nav-tab">Live Game</a>
                </div>
              </div>
            </div>
          </div>

          <div className="container-fluid mx-auto">
            <div className="row justify-content-center">
              <div className="col-lg-3">
                <div className="card mb-3">
                  <div className="card-header">Ranked Solo/Duo</div>
                  <div className="row g-0 justify-content-center">
                    <div className="col-sm-2 ps-2">
                      <img 
                        src={rankedData.solo 
                          ? `https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-static-assets/global/default/images/ranked-mini-crests/${rankedData.solo.tier.toLowerCase()}.png`
                          : "/api/placeholder/72/72"}
                        width="72"
                        alt="Rank Icon"
                      />
                    </div>
                    <div className="col-sm-8 ps-4">
                      <div className="card-body">
                        <div className="card-text">
                          {rankedData.solo 
                            ? `${rankedData.solo.tier} ${rankedData.solo.rank} - ${rankedData.solo.leaguePoints} LP`
                            : "Unranked"}
                          <br />
                          {rankedData.solo 
                            ? `${rankedData.solo.wins}W - ${rankedData.solo.losses}L (${rankedData.solo.winRate}%)`
                            : "0W - 0L (0%)"}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="card mb-3">
                  <div className="card-header">Ranked Flex</div>
                  <div className="row g-0 justify-content-center">
                    <div className="col-sm-2 ps-2">
                      <img 
                        src={rankedData.flex 
                          ? `https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-static-assets/global/default/images/ranked-mini-crests/${rankedData.flex.tier.toLowerCase()}.png`
                          : "/api/placeholder/72/72"}
                        width="72"
                        alt="Rank Icon"
                      />
                    </div>
                    <div className="col-sm-8 ps-4">
                      <div className="card-body">
                        <div className="card-text">
                          {rankedData.flex 
                            ? `${rankedData.flex.tier} ${rankedData.flex.rank} - ${rankedData.flex.leaguePoints} LP`
                            : "Unranked"}
                          <br />
                          {rankedData.flex 
                            ? `${rankedData.flex.wins}W - ${rankedData.flex.losses}L (${rankedData.flex.winRate}%)`
                            : "0W - 0L (0%)"}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-lg-6">
                <div className="card mb-3">
                  <div className="card-header">Recent Games</div>
                  <div className="row g-0">
                    <div className="col-md-6 d-flex align-items-center">
                      <div className="p-4">
                        <div className="pie-chart-temp"></div>
                      </div>
                      <div className="text-center">
                        {matches.length > 0 && (
                          <>
                            {(() => {
                              const totalKills = matches.reduce((sum, match) => sum + match.kills, 0);
                              const totalDeaths = matches.reduce((sum, match) => sum + match.deaths, 0);
                              const totalAssists = matches.reduce((sum, match) => sum + match.assists, 0);
                              const kda = totalDeaths === 0 ? 'Perfect' : ((totalKills + totalAssists) / totalDeaths).toFixed(2);
                              
                              return (
                                <>
                                  {totalKills} / {totalDeaths} / {totalAssists}<br />
                                  {kda} KDA
                                </>
                              );
                            })()}
                          </>
                        )}
                        {matches.length === 0 && (
                          <>
                            0 / 0 / 0<br />
                            0.00 KDA
                          </>
                        )}
                      </div>
                    </div>
                    <div className="col-5">
                      <div className="card-body">
                        <div className="card-title">Recent Played Champion</div>
                        <div className="card-text">
                          {championStats.length > 0 ? (
                            championStats.map((champ, index) => (
                              <div key={index}>
                                <img 
                                  src={`https://ddragon.leagueoflegends.com/cdn/15.8.1/img/champion/${champ.championName}.png`} 
                                  width="20" 
                                  alt={champ.championName}
                                /> {champ.winRate}% ({champ.wins}W / {champ.losses}L) {champ.kda} KDA<br />
                              </div>
                            ))
                          ) : (
                            <>
                              <img src="/api/placeholder/20/20" width="20" alt="Champion" /> 0% (0W / 0L) 0.00 KDA<br />
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {matches.length > 0 && matches.map((match, index) => (
                  <React.Fragment key={match.matchId}>
                    <div className="card mt-3">
                      <div className="card-body d-flex justify-content-between align-items-center">
                        <div className="d-flex align-items-center">
                          <div className="mx-2">
                            {match.gameMode}<br />
                            {match.date}<br />
                            {match.win ? "Win" : "Loss"}<br />
                            {match.duration}
                          </div>
                          <img 
                            src={`https://ddragon.leagueoflegends.com/cdn/15.8.1/img/champion/${match.championName}.png`} 
                            width="72" 
                            className="mx-2"
                            alt={match.championName}
                          />
                          <div className="mx-2">
                            {match.kills} / {match.deaths} / {match.assists}
                          </div>
                          <div className="mx-2">
                            {match.kda} KDA
                          </div>

                          <div className="mx-1 d-none d-md-block">
                            <img 
                              src={`https://ddragon.leagueoflegends.com/cdn/15.8.1/img/spell/Summoner${getSummonerSpellName(match.summoner1Id)}.png`} 
                              width="36" 
                              className="p-1"
                              alt="Summoner Spell 1"
                            /><br />
                            <img 
                              src={`https://ddragon.leagueoflegends.com/cdn/15.8.1/img/spell/Summoner${getSummonerSpellName(match.summoner2Id)}.png`} 
                              width="36" 
                              className="p-1"
                              alt="Summoner Spell 2"
                            />
                          </div>

                          <div className="d-none d-md-block">
                            <img 
                              src={match.primaryRuneId ? `https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/perk-images/styles/${match.primaryRuneId}.png` : "/api/placeholder/36/36"}
                              width="36"
                              alt="Primary Rune"
                            /><br />
                            <img 
                              src={match.subStyleId ? `https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/perk-images/styles/${match.subStyleId}.png` : "/api/placeholder/36/36"}
                              width="36" 
                              className="p-1"
                              alt="Secondary Rune"
                            />
                          </div>
                          
                          <div className="mx-1 d-none d-md-block" style={{ maxWidth: "150px" }}>
                            <div className="row row-cols-4 g-1">
                              {[match.item0, match.item1, match.item2, match.item3, match.item4, match.item5, match.item6]
                                .map((itemId, idx) => (
                                  <div className="col" key={idx}>
                                    {itemId > 0 ? (
                                      <img 
                                        src={`https://ddragon.leagueoflegends.com/cdn/15.8.1/img/item/${itemId}.png`} 
                                        className="img-fluid" 
                                        width="36"
                                        alt={`Item ${idx}`}
                                      />
                                    ) : (
                                      <div style={{ width: "36px", height: "36px", backgroundColor: "#eee" }}></div>
                                    )}
                                  </div>
                                ))}
                            </div>
                          </div>
                        </div>
                        <button 
                          id={`button-${match.matchId}`}
                          className="full-height-btn collapsed" 
                          type="button" 
                          onClick={() => toggleMatchDetails(match.matchId)}
                        >
                          <span className="arrow">▲</span>
                        </button>
                      </div>
                    </div>
                    <div className="collapse" id={`collapse-${match.matchId}`}>
                      <div className="card card-body outer-bordered-table">
                        <table className="table align-middle text-center">
                          <thead>
                            <tr>
                              <th colSpan="11" className="text-start">
                                {match.win ? "Win" : "Loss"} ({match.win ? "Blue Team" : "Red Team"})
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {match.teamMembers.map((player, idx) => (
                              <tr key={idx}>
                                <td>{player.summonerName}<br /><small>Rank + Tier</small></td>
                                <td>
                                  <img 
                                    src={`https://ddragon.leagueoflegends.com/cdn/15.8.1/img/champion/${player.championName}.png`} 
                                    width="40"
                                    alt={player.championName}
                                  />
                                </td>
                                <td>
                                  <img src="/api/placeholder/25/25" width="25" alt="Summoner Spell" /><br />
                                  <img src="/api/placeholder/25/25" width="25" alt="Summoner Spell" />
                                </td>
                                <td>
                                  <img src="/api/placeholder/24/24" width="24" alt="Rune" /><br />
                                  <img src="/api/placeholder/20/20" width="20" alt="Rune" />
                                </td>
                                <td>
                                  <div className="mx-1 d-none d-md-block" style={{ maxWidth: "120px" }}>
                                    <div className="row row-cols-4 gx-1 gy-1">
                                      {Array(7).fill(0).map((_, i) => (
                                        <div className="col" key={i}>
                                          <img src="/api/placeholder/25/25" className="img-fluid" width="25" alt="Item" />
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </td>
                                <td>{player.kills} / {player.deaths} / {player.assists}</td>
                                <td>{player.cs} CS (0.0)</td>
                                <td>{player.goldEarned}</td>
                              </tr>
                            ))}
                          </tbody>
                          <thead>
                            <tr>
                              <th colSpan="11" className="text-start">
                                {!match.win ? "Win" : "Loss"} ({!match.win ? "Blue Team" : "Red Team"})
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {match.opposingTeam.map((player, idx) => (
                              <tr key={idx}>
                                <td>{player.summonerName}<br /><small>Rank + Tier</small></td>
                                <td>
                                  <img 
                                    src={`https://ddragon.leagueoflegends.com/cdn/15.8.1/img/champion/${player.championName}.png`} 
                                    width="40"
                                    alt={player.championName}
                                  />
                                </td>
                                <td>
                                  <img src="/api/placeholder/25/25" width="25" alt="Summoner Spell" /><br />
                                  <img src="/api/placeholder/25/25" width="25" alt="Summoner Spell" />
                                </td>
                                <td>
                                  <img src="/api/placeholder/24/24" width="24" alt="Rune" /><br />
                                  <img src="/api/placeholder/20/20" width="20" alt="Rune" />
                                </td>
                                <td>
                                  <div className="mx-1 d-none d-md-block" style={{ maxWidth: "120px" }}>
                                    <div className="row row-cols-4 gx-1 gy-1">
                                      {Array(7).fill(0).map((_, i) => (
                                        <div className="col" key={i}>
                                          <img src="/api/placeholder/25/25" className="img-fluid" width="25" alt="Item" />
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </td>
                                <td>{player.kills} / {player.deaths} / {player.assists}</td>
                                <td>{player.cs} CS (0.0)</td>
                                <td>{player.goldEarned}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </React.Fragment>
                ))}

                {matches.length === 0 && !isLoading && summonerData && (
                  <div className="card mt-3">
                    <div className="card-body text-center">
                      <p>No recent matches found</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

// Helper function to get summoner spell name from ID
const getSummonerSpellName = (id) => {
  const spellMap = {
    1: "Cleanse",
    3: "Exhaust",
    4: "Flash",
    6: "Ghost",
    7: "Heal",
    11: "Smite",
    12: "Teleport",
    13: "Clarity",
    14: "Ignite",
    21: "Barrier",
    32: "Mark" // Snowball
  };
  return spellMap[id] || "Flash"; // Default to Flash if not found
};

export default SummonerProfile;