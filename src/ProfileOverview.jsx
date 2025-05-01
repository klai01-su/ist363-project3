import React, { useState, useEffect } from "react";
import "./App.css";

const REGION_ROUTING = {
  "NA": { platform: "na1", routing: "americas", label: "North America" },
  "KR": { platform: "kr", routing: "asia", label: "Korea" },
  "EUW": { platform: "euw1", routing: "europe", label: "Europe West" }
};

const ProfileChampions = ({ summonerData, championStats }) => {
  return (
    <div className="container-fluid mx-auto">
      <div className="row justify-content-md-center">
        <div className="col-lg-9 mb-3">
          <table className="table table-hover">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Champions</th>
                <th scope="col">Played</th>
                <th scope="col">Win Rate</th>
                <th scope="col">KDA</th>
                <th scope="col">CS/min</th>
                <th scope="col">Duration</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th>-</th>
                <td>All Champions</td>
                <td>
                  {championStats.reduce((sum, champ) => sum + champ.wins, 0)}W - {championStats.reduce((sum, champ) => sum + champ.losses, 0)}L
                </td>
                <td>
                  {championStats.length > 0 
                    ? Math.round((championStats.reduce((sum, champ) => sum + champ.wins, 0) / 
                       (championStats.reduce((sum, champ) => sum + champ.games, 0))) * 100) 
                    : 0}%
                </td>
                <td>
                  {championStats.length > 0 
                    ? ((championStats.reduce((sum, champ) => sum + champ.kills, 0) + 
                        championStats.reduce((sum, champ) => sum + champ.assists, 0)) / 
                        Math.max(1, championStats.reduce((sum, champ) => sum + champ.deaths, 0))).toFixed(2)
                    : "0.0"}
                </td>
                <td>0.0</td>
                <td>00h 00m</td>
              </tr>
              
              {championStats.map((champ, index) => (
                <tr key={index}>
                  <th scope="row">{index + 1}</th>
                  <td>
                    <img 
                      src={`https://ddragon.leagueoflegends.com/cdn/15.8.1/img/champion/${champ.championName}.png`} 
                      width="30" 
                      alt={champ.championName}
                    />
                  </td>
                  <td>{champ.wins}W - {champ.losses}L</td>
                  <td>{champ.winRate}%</td>
                  <td>{champ.kda}</td>
                  <td>0.0</td>
                  <td>00h 00m</td>
                </tr>
              ))}
              
              {championStats.length === 0 && (
                <tr>
                  <td colSpan="7" className="text-center">No champion data available</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const LiveGame = ({ summonerData }) => {
  return (
    <div className="container-fluid mx-auto">
      <div className="row justify-content-md-center">
        <div className="col-lg-9 mb-3">
          <div className="card">
            <div className="card-body text-center">
              <h4>Live Game</h4>
              <p>{summonerData ? `${summonerData.gameName}#${summonerData.tagLine} is not currently in a game` : 'No summoner data'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const getSummonerSpellName = (id) => {
  const spellMap = {
    1: "Boost",
    3: "Exhaust",
    4: "Flash",
    6: "Haste",
    7: "Heal",
    11: "Smite",
    12: "Teleport",
    13: "Mana",
    14: "Dot",
    21: "Barrier",
    32: "Snowball",
    2201: "CherryHold",
    2202: "CherryFlash"
  };
  return spellMap[id];
};

const getQueueDescription = (queueId) => {
  const queueMap = {
    400: "Blind Pick",
    420: "Ranked Solo",
    430: "Normal Draft",
    440: "Ranked Flex",
    450: "ARAM",
    1700: "Arena"
  };
  return queueMap[queueId] || `Unknown Queue`;
};

const getRuneImage = (runeId) => {
  const runeMap = {
    8000: "https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/7201_Precision.png",
    8100: "https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/7200_Domination.png",
    8200: "https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/7202_Sorcery.png",
    8300: "https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/7203_Whimsy.png",
    8400: "https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/7204_Resolve.png",
  
    8005: "https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/Precision/PressTheAttack/PressTheAttack.png",
    8008: "https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/Precision/LethalTempo/LethalTempoTemp.png",
    8021: "https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/Precision/FleetFootwork/FleetFootwork.png",
    8010: "https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/Precision/Conqueror/Conqueror.png",
  
    8112: "https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/Domination/Electrocute/Electrocute.png",
    8128: "https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/Domination/DarkHarvest/DarkHarvest.png",
    9923: "https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/Domination/HailOfBlades/HailOfBlades.png",
  
    8214: "https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/Sorcery/SummonAery/SummonAery.png",
    8229: "https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/Sorcery/ArcaneComet/ArcaneComet.png",
    8230: "https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/Sorcery/PhaseRush/PhaseRush.png",
  
    8351: "https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/Inspiration/GlacialAugment/GlacialAugment.png",
    8360: "https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/Inspiration/UnsealedSpellbook/UnsealedSpellbook.png",
    8369: "https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/Inspiration/FirstStrike/FirstStrike.png",
  
    8437: "https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/Resolve/GraspOfTheUndying/GraspOfTheUndying.png",
    8439: "https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/Resolve/VeteranAftershock/VeteranAftershock.png",
    8465: "https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/Resolve/Guardian/Guardian.png",
  };
  
  
  return runeMap[runeId] || "Unknown Rune";
};

const ProfileOverview = ({ summonerData, rankedData, matches, championStats, isLoading, toggleMatchDetails }) => {
  return (
    <div className="container-fluid mx-auto">
      <div className="row justify-content-center">
        <div className="col-lg-3">
          <div className="card mb-3">
            <div className="card-header">Ranked Solo/Duo</div>
            <div className="row g-0 justify-content-center">
              <div className="col-sm-2 ps-2">
                <img 
                  src={rankedData.solo 
                    ? `https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-static-assets/global/default/images/ranked-mini-crests/${rankedData.solo.tier.toLowerCase()}.svg`
                    : "https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-static-assets/global/default/images/ranked-mini-crests/unranked.png"}
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
                      : "N/A"}
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
                    ? `https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-static-assets/global/default/images/ranked-mini-crests/${rankedData.flex.tier.toLowerCase()}.svg`
                    : "https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-static-assets/global/default/images/ranked-mini-crests/unranked.png"}
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
                      : "N/A"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-6">
          <div className="card mb-3">
            <div className="card-header">Last 10 Games</div>
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
                        const count = matches.length;

                        const avgKills = (totalKills / count).toFixed(1);
                        const avgDeaths = (totalDeaths / count).toFixed(1);
                        const avgAssists = (totalAssists / count).toFixed(1);
                        const kda = totalDeaths === 0 ? 'Perfect' : ((totalKills + totalAssists) / totalDeaths).toFixed(2);

                        return (
                          <>
                            {avgKills} / {avgDeaths} / {avgAssists}<br />
                            {kda} KDA
                          </>
                        );
                      })()}
                    </>
                  )}
                  {matches.length === 0 && (
                    <>
                      N/A
                    </>
                  )}
                </div>
              </div>
              <div className="col-5">
                <div className="card-body">
                  <div className="card-title">Recent Played Champion</div>
                  <div className="card-text">
                    {championStats.length > 0 ? (
                      championStats
                        .slice(0, 3)
                        .map((champ, index) => (
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
                        N/A
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
                      {getQueueDescription(match.queueId)}<br />
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
                      {match.kills} / {match.deaths} / {match.assists} <br />
                      {match.kda} KDA
                    </div>

                    <div className="mx-2 d-none d-md-block">
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
                        src={match.primaryRuneId ? `${getRuneImage(match.primaryRuneId)}` : ""}
                        width="36"
                        alt={`${match.primaryRuneId}`}
                      /><br />
                      <img 
                        src={match.subStyleId ? `${getRuneImage(match.subStyleId)}` : ""}
                        width="36" 
                        className="p-1"
                        alt={`${match.subStyleId}`}
                      />
                    </div>
                    <div className="mx-1 d-none d-md-block" style={{ maxWidth: "150px" }}>
                      <div className="row row-cols-4 g-1">
                        {[match.item0, match.item1, match.item2, match.item6, match.item3, match.item4, match.item5]
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
                                <div className="img-fluid" style={{ width: "35px", height: "35px", backgroundColor: "#000" }}></div>
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
                          <td>
                            {player.summonerName}<br />
                            <small>{player.tier} {player.rank}</small>
                          </td>
                          <td>
                            <img 
                              src={`https://ddragon.leagueoflegends.com/cdn/15.8.1/img/champion/${player.championName}.png`} 
                              width="40"
                              alt={player.championName}
                            />
                          </td>
                          <td>
                            <img src={`https://ddragon.leagueoflegends.com/cdn/15.8.1/img/spell/Summoner${getSummonerSpellName(match.summoner1Id)}.png`} width="25" alt={`${player.summoner1Id}`} /><br />
                            <img src={`https://ddragon.leagueoflegends.com/cdn/15.8.1/img/spell/Summoner${getSummonerSpellName(match.summoner2Id)}.png`} width="25" alt={`${player.summoner2Id}`} />
                          </td>
                          <td>
                            <img
                              src={player.primaryRuneId ? `${getRuneImage(player.primaryRuneId)}` : ""}
                              width="25"
                              alt={`${player.primaryRuneId}`}
                            /><br />
                            <img
                              src={match.subStyleId ? `${getRuneImage(match.subStyleId)}` : ""}
                              width="18"
                              alt={`${player.subStyleId}`}
                            />
                          </td>
                          <td>
                            <div className="mx-1 d-none d-md-block" style={{ maxWidth: "300px" }}>
                              <div className="row row-cols-4 gx-1 gy-0">
                                {[player.item0, player.item1, player.item2, player.item6, player.item3, player.item4, player.item5].map((itemId, i) => (
                                  <div className="col" key={i}>
                                    {itemId > 0 ? (
                                      <img
                                        src={`https://ddragon.leagueoflegends.com/cdn/15.8.1/img/item/${itemId}.png`}
                                        className="img-fluid"
                                        width="30"
                                        alt={`Item ${i}`}
                                      />
                                    ) : (
                                      <div
                                        className="img-fluid"
                                        style={{
                                          width: "25px",
                                          height: "25px",
                                          backgroundColor: "#000",
                                        }}
                                      ></div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          </td>
                          <td>{player.kills}/{player.deaths}/{player.assists}</td>
                          <td>{player.cs} CS ({player.csPerMin})</td>
                          <td>{player.goldEarned}</td>
                        </tr>
                      ))}
                    </tbody>
                    <thead>
                      <tr>
                        <th colSpan="11" className="text-start">
                          {match.win ? "Win" : "Loss"} ({match.win ? "Blue Team" : "Red Team"})
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {match.opposingTeam.map((player, idx) => (
                        <tr key={idx}>
                          <td>
                            {player.summonerName}<br />
                            <small>{player.tier} {player.rank}</small>
                          </td>
                          <td>
                            <img 
                              src={`https://ddragon.leagueoflegends.com/cdn/15.8.1/img/champion/${player.championName}.png`} 
                              width="40"
                              alt={player.championName}
                            />
                          </td>
                          <td>
                            <img src={`https://ddragon.leagueoflegends.com/cdn/15.8.1/img/spell/Summoner${getSummonerSpellName(match.summoner1Id)}.png`} width="25" alt={`${player.summoner1Id}`} /><br />
                            <img src={`https://ddragon.leagueoflegends.com/cdn/15.8.1/img/spell/Summoner${getSummonerSpellName(match.summoner2Id)}.png`} width="25" alt={`${player.summoner2Id}`} />
                          </td>
                          <td>
                          <img
                              src={player.primaryRuneId ? `${getRuneImage(player.primaryRuneId)}` : ""}
                              width="25"
                              alt={`${player.primaryRuneId}`}
                            /><br />
                            <img
                              src={match.subStyleId ? `${getRuneImage(match.subStyleId)}` : ""}
                              width="18"
                              alt={`${player.subStyleId}`}
                            />
                          </td>
                          <td>
                            <div className="mx-1 d-none d-md-block" style={{ maxWidth: "300px" }}>
                              <div className="row row-cols-4 gx-1 gy-0">
                                {[player.item0, player.item1, player.item2, player.item6, player.item3, player.item4, player.item5].map((itemId, i) => (
                                  <div className="col" key={i}>
                                    {itemId > 0 ? (
                                      <img
                                        src={`https://ddragon.leagueoflegends.com/cdn/15.8.1/img/item/${itemId}.png`}
                                        className="img-fluid"
                                        width="30"
                                        alt={`Item ${i}`}
                                      />
                                    ) : (
                                      <div
                                        className="img-fluid"
                                        style={{
                                          width: "25px",
                                          height: "25px",
                                          backgroundColor: "#000",
                                        }}
                                      ></div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          </td>
                          <td>{player.kills}/{player.deaths}/{player.assists}</td>
                          <td>{player.cs} CS ({player.csPerMin})</td>
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
  );
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


  const [activePage, setActivePage] = useState("overview");

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

      const accountRes = await fetch(
        `https://${routing}.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${encodeURIComponent(gameName)}/${encodeURIComponent(tagLine)}`,
        { headers: { "X-Riot-Token": API_KEY } }
      );
      if (!accountRes.ok) throw new Error("Failed to fetch account data");
      const accountData = await accountRes.json();
      const puuid = accountData.puuid;

      const summonerRes = await fetch(
        `https://${platform}.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${puuid}`,
        { headers: { "X-Riot-Token": API_KEY } }
      );
      if (!summonerRes.ok) throw new Error("Failed to fetch summoner data");
      const summoner = await summonerRes.json();

      const rankedRes = await fetch(
        `https://${platform}.api.riotgames.com/lol/league/v4/entries/by-summoner/${summoner.id}`,
        { headers: { "X-Riot-Token": API_KEY } }
      );
      if (!rankedRes.ok) throw new Error("Failed to fetch ranked data");
      const rankedDataArray = await rankedRes.json();
      
      const soloQueue = rankedDataArray.find(entry => entry.queueType === "RANKED_SOLO_5x5");
      const flexQueue = rankedDataArray.find(entry => entry.queueType === "RANKED_FLEX_SR");

      const matchRes = await fetch(
        `https://${routing}.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?start=0&count=10`,
        { headers: { "X-Riot-Token": API_KEY } }
      );
      if (!matchRes.ok) throw new Error("Failed to fetch match IDs");
      const matchIds = await matchRes.json();

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

      const allSummonerIds = new Set();

      matchDetails.forEach(match => {
        match.info.participants.forEach(p => {
          if (p.summonerId) {
            allSummonerIds.add(p.summonerId);
          }
        });
      });

      const playerRankMap = {};

      await Promise.all(
        Array.from(allSummonerIds).map(async (id) => {
          try {
            const res = await fetch(
              `https://${platform}.api.riotgames.com/lol/league/v4/entries/by-summoner/${id}`,
              { headers: { "X-Riot-Token": API_KEY } }
            );
            if (!res.ok) throw new Error();
            const data = await res.json();
            const solo = data.find(entry => entry.queueType === "RANKED_SOLO_5x5");
            playerRankMap[id] = solo ? { tier: solo.tier, rank: solo.rank } : { tier: "Unranked", rank: "" };
          } catch {
            playerRankMap[id] = { tier: "Unranked", rank: "" };
          }
        })
      );

      setSummonerData({
        gameName: accountData.gameName,
        tagLine: accountData.tagLine,
        region: REGION_ROUTING[region].label,
        level: summoner.summonerLevel,
        iconId: summoner.profileIconId,
      });

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


      const processedMatches = matchDetails.map(match => {
        const player = match.info.participants.find(p => p.puuid === puuid);
        const gameDuration = Math.floor(match.info.gameDuration / 60) + "m " + (match.info.gameDuration % 60) + "s";
        const gameCreation = new Date(match.info.gameStartTimestamp).toLocaleDateString();
        
        return {
          matchId: match.metadata.matchId,
          gameMode: match.info.gameMode,
          gameType: match.info.gameType,
          queueId: match.info.queueId,
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
              summonerName: p.riotIdGameName + "#" + p.riotIdTagline,
              championName: p.championName,
              kills: p.kills,
              deaths: p.deaths,
              assists: p.assists,
              cs: p.totalMinionsKilled + p.neutralMinionsKilled,
              csPerMin: ((p.totalMinionsKilled + p.neutralMinionsKilled) / (match.info.gameDuration / 60)).toFixed(1),
              goldEarned: (p.goldEarned / 1000).toFixed(1) + "K",
              tier: playerRankMap[p.summonerId]?.tier || "Unranked",
              rank: playerRankMap[p.summonerId]?.rank || "",
              summoner1Id: p.summoner1Id,
              summoner2Id: p.summoner2Id,
              primaryRuneId: p.perks?.styles?.[0]?.selections?.[0]?.perk,
              subStyleId: p.perks?.styles?.[1]?.style,
              item0: p.item0,
              item1: p.item1,
              item2: p.item2,
              item3: p.item3,
              item4: p.item4,
              item5: p.item5,
              item6: p.item6
            })),
          opposingTeam: match.info.participants
            .filter(p => p.teamId !== player.teamId)
            .map(p => ({
              summonerName: p.riotIdGameName + "#" + p.riotIdTagline,
              championName: p.championName,
              kills: p.kills,
              deaths: p.deaths,
              assists: p.assists,
              cs: p.totalMinionsKilled + p.neutralMinionsKilled,
              csPerMin: ((p.totalMinionsKilled + p.neutralMinionsKilled) / (match.info.gameDuration / 60)).toFixed(1),
              goldEarned: (p.goldEarned / 1000).toFixed(1) + "K",
              tier: playerRankMap[p.summonerId]?.tier || "Unranked",
              rank: playerRankMap[p.summonerId]?.rank || "",
              summoner1Id: p.summoner1Id,
              summoner2Id: p.summoner2Id,
              primaryRuneId: p.perks?.styles?.[0]?.selections?.[0]?.perk,
              subStyleId: p.perks?.styles?.[1]?.style,
              item0: p.item0,
              item1: p.item1,
              item2: p.item2,
              item3: p.item3,
              item4: p.item4,
              item5: p.item5,
              item6: p.item6
            }))
        };
      });

      setMatches(processedMatches);

      
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
        .slice(0, 10);

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
        <h1 className="logo">LOL.GG</h1>
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
                    src={
                      championStats?.length > 0 && championStats[0]?.championName
                        ? `https://ddragon.leagueoflegends.com/cdn/img/champion/centered/${championStats[0].championName}_0.jpg`
                        : "https://ddragon.leagueoflegends.com/cdn/img/bg/F5141416.png"
                    }
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

          {activePage === 'overview' && (
            <ProfileOverview 
              summonerData={summonerData}
              rankedData={rankedData}
              matches={matches}
              championStats={championStats}
              isLoading={isLoading}
              toggleMatchDetails={toggleMatchDetails}
            />
          )}
          
          {activePage === 'champions' && (
            <ProfileChampions 
              summonerData={summonerData} 
              championStats={championStats} 
            />
          )}
          
          {activePage === 'live' && (
            <LiveGame 
              summonerData={summonerData} 
            />
          )}
        </>
      )}
    </div>
  );
};

export default SummonerProfile;