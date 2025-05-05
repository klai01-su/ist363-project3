import { useState, useEffect } from "react";
import fetchSummonerProfile from "../utils/fetchSummonerProfile";
import fetchLiveGame from "../utils/fetchLiveGame";

const useSummonerData = () => {
  const [region, setRegion] = useState("");
  const [input, setInput] = useState("");
  const [summonerData, setSummonerData] = useState(null);
  const [matches, setMatches] = useState([]);
  const [rankedData, setRankedData] = useState({ solo: null, flex: null });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [championStats, setChampionStats] = useState([]);
  const [activePage, setActivePage] = useState("overview");
  const [liveGameData, setLiveGameData] = useState(null);
  const [isLoadingLiveGame, setIsLoadingLiveGame] = useState(false);
  const [liveGameError, setLiveGameError] = useState("");
  

  const MIN_LOADING_TIME = 800;

  const handleSearch = async () => {
    if (!input.trim()) {
      setError("Please enter a valid Riot ID");
      return;
    }
    
    if (!input.includes("#")) {
      setError("Riot ID must include the # and tag (e.g. Name#TAG)");
      return;
    }
    
    setError("");
    setIsLoading(true);
    setSummonerData(null);
    setMatches([]);
    setRankedData({ solo: null, flex: null });
    setLiveGameData(null);
    setLiveGameError("");
    setChampionStats([]);

    const startTime = Date.now();

    try {
      const data = await fetchSummonerProfile(region, input);
      
      if (data && data.summonerData) {
        const elapsedTime = Date.now() - startTime;
        if (elapsedTime < MIN_LOADING_TIME) {
          await new Promise(resolve => setTimeout(resolve, MIN_LOADING_TIME - elapsedTime));
        }
        
        setSummonerData(data.summonerData);
        setMatches(data.matches);
        setRankedData(data.rankedData);
        setChampionStats(data.championStats);
        setActivePage("overview");
      } else {
        setError("No data found. Check Riot ID & region.");
      }
    } catch (err) {
      console.error("Search error:", err);
      
      if (err.message?.includes("not found")) {
        setError("Summoner not found. Check Riot ID & region.");
      } else {
        const elapsedTime = Date.now() - startTime;
        if (elapsedTime < MIN_LOADING_TIME) {
          await new Promise(resolve => setTimeout(resolve, MIN_LOADING_TIME - elapsedTime));
        }
        setError("Request Overload. Please try again in a moment.");
      }
    } finally {
      const elapsedTime = Date.now() - startTime;
      if (elapsedTime < MIN_LOADING_TIME) {
        await new Promise(resolve => setTimeout(resolve, MIN_LOADING_TIME - elapsedTime));
      }
      setIsLoading(false);
    }
  };

  const fetchLiveGameData = async () => {
    if (!summonerData) return;
    
    setIsLoadingLiveGame(true);
    setLiveGameError("");
    setLiveGameData(null);
    
    const startTime = Date.now();
    
    try {
      const REGION_ROUTING = {
        "North America": { platform: "na1", routing: "americas" },
        "Korea": { platform: "kr", routing: "asia" },
        "Europe West": { platform: "euw1", routing: "europe" },
      };
      
      const { platform } = REGION_ROUTING[summonerData.region];
      const API_KEY = import.meta.env.VITE_RIOT_API_KEY;
      
      const liveData = await fetchLiveGame(platform, summonerData.puuid, API_KEY);
      
      const elapsedTime = Date.now() - startTime;
      if (elapsedTime < MIN_LOADING_TIME) {
        await new Promise(resolve => setTimeout(resolve, MIN_LOADING_TIME - elapsedTime));
      }
      
      if (!liveData) {
        setLiveGameError("Player is not currently in game.");
      } else {
        setLiveGameData(liveData);
      }
    } catch (err) {
      console.error("Live game error:", err);
      
      const elapsedTime = Date.now() - startTime;
      if (elapsedTime < MIN_LOADING_TIME) {
        await new Promise(resolve => setTimeout(resolve, MIN_LOADING_TIME - elapsedTime));
      }
      
      setLiveGameError("Failed to load live game data.");
    } finally {
      const elapsedTime = Date.now() - startTime;
      if (elapsedTime < MIN_LOADING_TIME) {
        await new Promise(resolve => setTimeout(resolve, MIN_LOADING_TIME - elapsedTime));
      }
      
      setIsLoadingLiveGame(false);
    }
  };

  useEffect(() => {
    if (activePage === "live" && summonerData && !liveGameData && !isLoadingLiveGame && !liveGameError) {
      fetchLiveGameData();
    }
  }, [activePage, summonerData]);

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
    liveGameData,
    isLoadingLiveGame,
    liveGameError,
    fetchLiveGameData,
  };
};

export default useSummonerData;