import { useState, useEffect } from "react";
import fetchSummonerProfile from "../utils/fetchSummonerProfile";

const useSummonerData = () => {
  const [region, setRegion] = useState("");
  const [input, setInput] = useState("");
  const [summonerData, setSummonerData] = useState(null);
  const [matches, setMatches] = useState([]);
  const [rankedData, setRankedData] = useState({ solo: null, flex: null });
  const [liveGameData, setLiveGameData] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [championStats, setChampionStats] = useState([]);
  const [activePage, setActivePage] = useState("overview");
  // const [refreshLiveGameTimer, setRefreshLiveGameTimer] = useState(null);
  // const [isRefreshingLiveGame, setIsRefreshingLiveGame] = useState(false);

  // useEffect(() => {
  //   return () => {
  //     if (refreshLiveGameTimer) {
  //       clearInterval(refreshLiveGameTimer);
  //     }
  //   };
  // }, [refreshLiveGameTimer]);

  // useEffect(() => {
  //   if (refreshLiveGameTimer) {
  //     clearInterval(refreshLiveGameTimer);
  //     setRefreshLiveGameTimer(null);
  //   }
    
  //   if (summonerData?.id && activePage === "live") {
  //     refreshLiveGame();
      
  //     const timer = setInterval(() => {
  //       refreshLiveGame();
  //     }, 30000);
      
  //     setRefreshLiveGameTimer(timer);
      
  //     return () => {
  //       clearInterval(timer);
  //     };
  //   }
  // }, [summonerData?.id, activePage]);

  // const refreshLiveGame = async () => {
  //   if (!summonerData?.id || isRefreshingLiveGame) return;
    
  //   try {
  //     setIsRefreshingLiveGame(true);
  //     console.log("Refreshing live game data...");
      
  //     const data = await fetchSummonerProfile(region, `${summonerData.gameName}#${summonerData.tagLine}`, true);
      
  //     console.log("Live game data received:", data.liveGameData);
  //     setLiveGameData(data.liveGameData);
  //   } catch (err) {
  //     console.error("Error refreshing live game data:", err);
  //   } finally {
  //     setIsRefreshingLiveGame(false);
  //   }
  // };

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
    setChampionStats([]);

    try {
      const data = await fetchSummonerProfile(region, input);
      setSummonerData(data.summonerData);
      setMatches(data.matches);
      setRankedData(data.rankedData);
      setChampionStats(data.championStats);
      setLiveGameData(data.liveGameData);
      
      setActivePage("overview");
    } catch (err) {
      setError("Error fetching data. Check Riot ID & region.");
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
    // liveGameData,
    // refreshLiveGame,
    toggleMatchDetails,
    activePage,
    setActivePage,
    // isRefreshingLiveGame
  };
};

export default useSummonerData;