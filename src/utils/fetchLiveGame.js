const fetchLiveGame = async (platform, puuid, API_KEY) => {
  try {
    const response = await fetch(
      `https://${platform}.api.riotgames.com/lol/spectator/v5/active-games/by-summoner/${puuid}`,
      { headers: { "X-Riot-Token": API_KEY } }
    );
    
    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error("Failed to fetch live game data");
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error fetching live game data:", error);
    return null;
  }
};

export default fetchLiveGame;