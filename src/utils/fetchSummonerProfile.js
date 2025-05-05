import { fetchWithRetry } from './apiUtils';

const REGION_ROUTING = {
  NA: { platform: "na1", routing: "americas", label: "North America" },
  KR: { platform: "kr", routing: "asia", label: "Korea" },
  EUW: { platform: "euw1", routing: "europe", label: "Europe West" },
};

const API_KEY = import.meta.env.VITE_RIOT_API_KEY;

const fetchWithAuth = async (url) => {
  const options = { headers: { "X-Riot-Token": API_KEY } };
  return fetchWithRetry(url, options);
};

const fetchSummonerProfile = async (regionCode, input) => {
  try {
    const [gameName, tagLine] = input.split("#");
    if (!gameName || !tagLine) throw new Error("Invalid format");

    const { platform, routing } = REGION_ROUTING[regionCode];

    const accountData = await fetchWithAuth(
      `https://${routing}.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${encodeURIComponent(
        gameName
      )}/${encodeURIComponent(tagLine)}`
    );
    
    if (accountData.notFound) {
      throw new Error("Summoner not found");
    }

    const puuid = accountData.puuid;
    const summoner = await fetchWithAuth(
      `https://${platform}.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${puuid}`
    );

    const rankedEntries = await fetchWithAuth(
      `https://${platform}.api.riotgames.com/lol/league/v4/entries/by-summoner/${summoner.id}`
    );

    const solo = rankedEntries.find((e) => e.queueType === "RANKED_SOLO_5x5");
    const flex = rankedEntries.find((e) => e.queueType === "RANKED_FLEX_SR");

    const matchIds = await fetchWithAuth(
      `https://${routing}.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?start=0&count=20`
    );

    const matchResponses = await Promise.allSettled(
      matchIds.map((id) =>
        fetchWithAuth(`https://${routing}.api.riotgames.com/lol/match/v5/matches/${id}`)
      )
    );

    const matchDetails = matchResponses
      .filter(response => response.status === 'fulfilled')
      .map(response => response.value);

    const playerRankMap = {};
    const allSummonerIds = new Set();
    matchDetails.forEach((match) => {
      match.info.participants.forEach((p) => {
        if (p.summonerId) allSummonerIds.add(p.summonerId);
      });
    });

    const matches = matchDetails.map((match) => {
      const player = match.info.participants.find((p) => p.puuid === puuid);
      
      if (!player) return null;
      
      const teamMembers = match.info.participants.filter((p) => p.teamId === player.teamId);
      const opposingTeam = match.info.participants.filter((p) => p.teamId !== player.teamId);

      const formatPlayer = (p) => ({
        summonerName: `${p.riotIdGameName}#${p.riotIdTagline}`,
        championName: p.championName,
        kills: p.kills,
        deaths: p.deaths,
        assists: p.assists,
        cs: p.totalMinionsKilled + p.neutralMinionsKilled,
        csPerMin: ((p.totalMinionsKilled + p.neutralMinionsKilled) / (match.info.gameDuration / 60)).toFixed(1),
        totalDamageDealtToChampions: (p.totalDamageDealtToChampions / 1000).toFixed(1) + "K",
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
      });
    
      return {
        matchId: match.metadata.matchId,
        queueId: match.info.queueId,
        gameMode: match.info.gameMode,
        gameType: match.info.gameType,
        date: new Date(match.info.gameStartTimestamp).toLocaleDateString(),
        duration: `${Math.floor(match.info.gameDuration / 60)}m ${match.info.gameDuration % 60}s`,
        win: player.win,
        teamId: player.teamId,
        championName: player.championName,
        kills: player.kills,
        deaths: player.deaths,
        assists: player.assists,
        kda: player.deaths === 0 ? "Perfect" : ((player.kills + player.assists) / player.deaths).toFixed(2),
        cs: player.totalMinionsKilled + player.neutralMinionsKilled,
        csPerMin: ((player.totalMinionsKilled + player.neutralMinionsKilled) / (match.info.gameDuration / 60)).toFixed(1),
        totalDamageDealtToChampions: (player.totalDamageDealtToChampions / 1000).toFixed(1) + "K",
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
        teamMembers: teamMembers.map(formatPlayer),
        opposingTeam: opposingTeam.map(formatPlayer)
      };
    }).filter(match => match !== null);
    

    const championMap = {};
    matches.forEach((match) => {
      if (!championMap[match.championName]) {
        championMap[match.championName] = {
          championName: match.championName,
          games: 0,
          wins: 0,
          losses: 0,
          kills: 0,
          deaths: 0,
          assists: 0
        };
      }
      const champ = championMap[match.championName];
      champ.games += 1;
      champ.wins += match.win ? 1 : 0;
      champ.losses += match.win ? 0 : 1;
      champ.kills += match.kills;
      champ.deaths += match.deaths;
      champ.assists += match.assists;
    });

    const championStats = Object.values(championMap)
      .map((champ) => ({
        ...champ,
        winRate: Math.round((champ.wins / champ.games) * 100),
        kda: champ.deaths === 0 ? "Perfect" : ((champ.kills + champ.assists) / champ.deaths).toFixed(2)
      }))
      .sort((a, b) => b.games - a.games)
      .slice(0, 10);

    return {
      summonerData: {
        gameName: accountData.gameName,
        tagLine: accountData.tagLine,
        region: REGION_ROUTING[regionCode].label,
        level: summoner.summonerLevel,
        iconId: summoner.profileIconId,
        id: summoner.id,
        puuid: puuid
      },
      rankedData: {
        solo: solo
          ? {
              tier: solo.tier,
              rank: solo.rank,
              leaguePoints: solo.leaguePoints,
              wins: solo.wins,
              losses: solo.losses,
              winRate: Math.round((solo.wins / (solo.wins + solo.losses)) * 100)
            }
          : null,
        flex: flex
          ? {
              tier: flex.tier,
              rank: flex.rank,
              leaguePoints: flex.leaguePoints,
              wins: flex.wins,
              losses: flex.losses,
              winRate: Math.round((flex.wins / (flex.wins + flex.losses)) * 100)
            }
          : null
      },
      matches,
      championStats
    };
  } catch (error) {
    console.error("Error in fetchSummonerProfile:", error);
    throw error;
  }
};

export default fetchSummonerProfile;