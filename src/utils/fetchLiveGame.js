import { fetchWithRetry } from './apiUtils';

const fetchLiveGame = async (platform, puuid, API_KEY) => {
  try {
    const options = { headers: { "X-Riot-Token": API_KEY } };
    const result = await fetchWithRetry(
      `https://${platform}.api.riotgames.com/lol/spectator/v5/active-games/by-summoner/${puuid}`,
      options
    );
    
    if (result.notFound) {
      return null;
    }
    
    return result;
  } catch (error) {
    console.error("Error fetching live game data (after retries):", error);
    return null;
  }
};

export default fetchLiveGame;