import { useState } from "react";
import fetchSummonerProfile from "../utils/fetchSummonerProfile";

const useSummonerData = () => {
  const [region, setRegion] = useState("NA");
  const [input, setInput] = useState("");
  const [summonerData, setSummonerData] = useState(null);
  const [matches, setMatches] = useState([]);
  const [rankedData, setRankedData] = useState({ solo: null, flex: null });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [championStats, setChampionStats] = useState([]);
  const [activePage, setActivePage] = useState("overview");

  const handleSearch = async () => {
    setError("");
    setIsLoading(true);
    setSummonerData(null);
    setMatches([]);
    setRankedData({ solo: null, flex: null });
    setChampionStats([]);

    try {
      const data = await fetchSummonerProfile(region, input);
      setSummonerData(data.summonerData);
      setMatches(data.matches);
      setRankedData(data.rankedData);
      setChampionStats(data.championStats);
    } catch (err) {
      setError("Error fetching data. Check Riot ID & region.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  const toggleMatchDetails = (matchId) => {
    const element = document.getElementById(`collapse-${matchId}`);
    const button = document.getElementById(`button-${matchId}`);
    if (element && button) {
      element.classList.toggle("show");
      button.classList.toggle("collapsed");
    }
  };

  return {
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
    setActivePage,
  };
};

export default useSummonerData;
