import React, { useState } from "react";
import './App.css';

const REGION_ROUTING = {
  "NA": { platform: "na1", routing: "americas" },
  "KR": { platform: "kr", routing: "asia" },
  "EUW": { platform: "euw1", routing: "europe" }
};

const SummonerSearch = () => {
  const [region, setRegion] = useState("NA");
  const [input, setInput] = useState("");
  const [summonerData, setSummonerData] = useState(null);
  const [matches, setMatches] = useState([]);
  const [error, setError] = useState("");

  const API_KEY = import.meta.env.VITE_RIOT_API_KEY;

  const handleSearch = async () => {
    setError("");
    setSummonerData(null);
    setMatches([]);
    const [gameName, tagLine] = input.split("#");
    if (!gameName || !tagLine) {
      setError("Please enter correct in format: Name#TAG");
      return;
    }

    try {
      const { platform, routing } = REGION_ROUTING[region];

      const accountRes = await fetch(
        `https://${routing}.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${gameName}/${tagLine}`,
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
      const rankedData = await rankedRes.json();
      const soloQueue = rankedData.find(
        (entry) => entry.queueType === "RANKED_SOLO_5x5"
      );

      const matchRes = await fetch(
        `https://${routing}.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?start=0&count=10`,
        { headers: { "X-Riot-Token": API_KEY } }
      );
      if (!matchRes.ok) throw new Error("Failed to fetch match data");
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

      setSummonerData({
        name: `${accountData.gameName}#${accountData.tagLine}`,
        region,
        level: summoner.summonerLevel,
        rank: soloQueue
          ? `${soloQueue.tier} ${soloQueue.rank} - ${soloQueue.leaguePoints} LP`
          : "Unranked",
        iconId: summoner.profileIconId,
      });

      // Map match data and display relevant details
      setMatches(matchDetails.map((match) => {
        const player = match.info.participants.find(p => p.puuid === puuid);
        return {
          gameMode: match.info.gameMode,
          timestamp: new Date(match.info.gameCreation).toLocaleString(),
          win: player.win,
          championId: player.championId,
          championName: player.championName
        };
      }));
    } catch (err) {
      setError("Error fetching summoner data. Check Riot ID & region.");
      console.error(err);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-2">LOL.GG</h1>
      <div className="flex gap-2 mb-2">
        <select
          value={region}
          onChange={(e) => setRegion(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="NA">North America</option>
          <option value="KR">Korea</option>
          <option value="EUW">Europe</option>
        </select>
        <input
          type="text"
          placeholder="Enter Riot ID (e.g., Doublelift#NA1)"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 border p-2 rounded"
        />
        <button onClick={handleSearch} className="bg-blue-500 text-white px-4 py-2 rounded">
          Search
        </button>
      </div>

      {error && <p className="text-red-500">{error}</p>}

      {summonerData && (
        <div className="mt-4 border p-4 rounded shadow">
          <img
            src={`https://ddragon.leagueoflegends.com/cdn/15.8.1/img/profileicon/${summonerData.iconId}.png`}
            alt="Profile Icon"
            className="w-16 h-16 mb-2"
          />
          <p><strong>Name:</strong> {summonerData.name}</p>
          <p><strong>Region:</strong> {summonerData.region}</p>
          <p><strong>Level:</strong> {summonerData.level}</p>
          <p><strong>Rank:</strong> {summonerData.rank}</p>
        </div>
      )}

      {matches.length > 0 && (
        <div className="mt-4">
          <h2 className="text-lg font-semibold mb-2">Latest Matches</h2>
          <ul className="space-y-2">
            {matches.map((match, index) => (
              <li key={index} className="border p-2 rounded shadow">
                <p><strong>Game Mode:</strong> {match.gameMode}</p>
                <p><strong>Result:</strong> {match.win ? "Win" : "Loss"}</p>
                <p><strong>Time:</strong> {match.timestamp}</p>
                <p><strong>Champion:</strong> 
                  <img 
                    src={`https://ddragon.leagueoflegends.com/cdn/15.8.1/img/champion/${match.championName}.png`} 
                    alt={`${match.championName}`}
                    className="inline-block w-8 h-8" 
                  />
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SummonerSearch;
