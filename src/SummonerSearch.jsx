import React, { useState } from "react";

const REGION_ROUTING = {
  "NA": { platform: "na1", routing: "americas" },
  "KR": { platform: "kr", routing: "asia" },
};

const SummonerSearch = () => {
  const [region, setRegion] = useState("NA");
  const [input, setInput] = useState("");
  const [summonerData, setSummonerData] = useState(null);
  const [error, setError] = useState("");

  const API_KEY = import.meta.env.VITE_RIOT_API_KEY;

  const handleSearch = async () => {
    setError("");
    setSummonerData(null);
    const [gameName, tagLine] = input.split("#");
    if (!gameName || !tagLine) {
      setError("Please enter Riot ID in format: Name#TAG");
      return;
    }

    try {
      const { platform, routing } = REGION_ROUTING[region];

      // Step 1: Get Account by Riot ID
      const accountRes = await fetch(
        `https://${routing}.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${gameName}/${tagLine}`,
        { headers: { "X-Riot-Token": API_KEY } }
      );
      if (!accountRes.ok) throw new Error("Failed to fetch account data");
      const accountData = await accountRes.json();
      const puuid = accountData.puuid;

      // Step 2: Get Summoner data
      const summonerRes = await fetch(
        `https://${platform}.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${puuid}`,
        { headers: { "X-Riot-Token": API_KEY } }
      );
      if (!summonerRes.ok) throw new Error("Failed to fetch summoner data");
      const summoner = await summonerRes.json();

      // Step 3: Get Ranked data
      const rankedRes = await fetch(
        `https://${platform}.api.riotgames.com/lol/league/v4/entries/by-summoner/${summoner.id}`,
        { headers: { "X-Riot-Token": API_KEY } }
      );
      if (!rankedRes.ok) throw new Error("Failed to fetch ranked data");
      const rankedData = await rankedRes.json();
      const soloQueue = rankedData.find(
        (entry) => entry.queueType === "RANKED_SOLO_5x5"
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
    } catch (err) {
      setError("Error fetching summoner data. Check Riot ID & region.");
      console.error(err);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-2">LOL.GG Test</h1>
      <div className="flex gap-2 mb-2">
        <select
          value={region}
          onChange={(e) => setRegion(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="NA">North America</option>
          <option value="KR">Korea</option>
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
    </div>
  );
};

export default SummonerSearch;
