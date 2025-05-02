import React, { useMemo } from "react";

const ProfileChampions = ({ summonerData, championStats, matches }) => {
  const enhancedChampionStats = useMemo(() => {
    if (!championStats || !matches) return [];

    const champData = {};
    matches.forEach((match) => {
      if (!champData[match.championName]) {
        champData[match.championName] = {
          totalCS: 0,
          totalDurationMinutes: 0,
          matchCount: 0,
        };
      }
      const [min, sec] = match.duration.replace("s", "").split("m ").map(Number);
      const durationInMinutes = min + sec / 60;

      champData[match.championName].totalCS += match.cs;
      champData[match.championName].totalDurationMinutes += durationInMinutes;
      champData[match.championName].matchCount++;
    });

    return championStats.map((champ) => {
      const data = champData[champ.championName];
      if (!data) return { ...champ, csPerMin: "0.0", totalDuration: "00h 00m" };

      const csPerMin = (data.totalCS / data.totalDurationMinutes).toFixed(1);
      const totalHours = Math.floor(data.totalDurationMinutes / 60);
      const totalMinutes = Math.floor(data.totalDurationMinutes % 60);
      const totalDuration = `${totalHours}h ${totalMinutes}m`;

      return { ...champ, csPerMin, totalDuration };
    });
  }, [championStats, matches]);

  const renderTotalRow = () => {
    const totalGames = enhancedChampionStats.reduce((sum, champ) => sum + champ.games, 0);
    const totalWins = enhancedChampionStats.reduce((sum, champ) => sum + champ.wins, 0);
    const totalLosses = enhancedChampionStats.reduce((sum, champ) => sum + champ.losses, 0);
    const totalKills = enhancedChampionStats.reduce((sum, champ) => sum + champ.kills, 0);
    const totalDeaths = enhancedChampionStats.reduce((sum, champ) => sum + champ.deaths, 0);
    const totalAssists = enhancedChampionStats.reduce((sum, champ) => sum + champ.assists, 0);
    const kda = totalDeaths === 0 ? "Perfect" : ((totalKills + totalAssists) / totalDeaths).toFixed(2);

    const totalCS = matches.reduce((sum, m) => sum + m.cs, 0);
    const totalDuration = matches.reduce((sum, m) => {
      const [min, sec] = m.duration.replace("s", "").split("m ").map(Number);
      return sum + min + sec / 60;
    }, 0);
    const csPerMin = (totalCS / totalDuration).toFixed(1);
    const durationHours = Math.floor(totalDuration / 60);
    const durationMins = Math.floor(totalDuration % 60);

    return (
      <tr>
        <th>-</th>
        <td>All Champions</td>
        <td>{totalWins}W - {totalLosses}L</td>
        <td>{totalGames > 0 ? Math.round((totalWins / totalGames) * 100) : 0}%</td>
        <td>{kda}</td>
        <td>{csPerMin}</td>
        <td>{`${durationHours}h ${durationMins}m`}</td>
      </tr>
    );
  };

  return (
    <div className="container-fluid mx-auto">
      <div className="row justify-content-md-center">
        <div className="col-lg-9 mb-3">
          <table className="table table-hover">
            <thead>
              <tr>
                <th>#</th>
                <th>Champions</th>
                <th>Played</th>
                <th>Win Rate</th>
                <th>KDA</th>
                <th>CS/min</th>
                <th>Duration</th>
              </tr>
            </thead>
            <tbody>
              {renderTotalRow()}
              {enhancedChampionStats.map((champ, i) => (
                <tr key={champ.championName}>
                  <th>{i + 1}</th>
                  <td>
                    <img
                      src={`https://ddragon.leagueoflegends.com/cdn/15.8.1/img/champion/${champ.championName}.png`}
                      width="30"
                      alt={champ.championName}
                    />
                    {" " + champ.championName}
                  </td>
                  <td>{champ.wins}W - {champ.losses}L</td>
                  <td>{champ.winRate}%</td>
                  <td>{champ.kda}</td>
                  <td>{champ.csPerMin}</td>
                  <td>{champ.totalDuration}</td>
                </tr>
              ))}
              {enhancedChampionStats.length === 0 && (
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

export default ProfileChampions;
