import React from "react";
import MatchCard from "./MatchCard";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);


const ProfileOverview = ({
  summonerData,
  rankedData,
  matches,
  championStats,
  isLoading,
  toggleMatchDetails
}) => {
  const renderRankCard = (title, data) => (
    <div className="card mb-3">
      <div className="card-header">{title}</div>
      <div className="row g-0 justify-content-center">
        <div className="col-sm-2 ps-2">
          <img
            src={data ?
              `https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-static-assets/global/default/images/ranked-mini-crests/${data.tier.toLowerCase()}.svg` :
              "https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-static-assets/global/default/images/ranked-mini-crests/unranked.png"
            }
            width="72"
            alt="Rank Icon"
          />
        </div>
        <div className="col-sm-8 ps-4">
          <div className="card-body">
            <div className="card-text">
              {data ? `${data.tier} ${data.rank} - ${data.leaguePoints} LP` : "Unranked"}<br />
              {data ? `${data.wins}W - ${data.losses}L (${data.winRate}%)` : "N/A"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderRecentStats = () => {
    if (!matches.length) return <>N/A</>;
    const totalKills = matches.reduce((sum, m) => sum + m.kills, 0);
    const totalDeaths = matches.reduce((sum, m) => sum + m.deaths, 0);
    const totalAssists = matches.reduce((sum, m) => sum + m.assists, 0);
    const count = matches.length;
    const avgKills = (totalKills / count).toFixed(1);
    const avgDeaths = (totalDeaths / count).toFixed(1);
    const avgAssists = (totalAssists / count).toFixed(1);
    const kda = totalDeaths === 0 ? "Perfect" : ((totalKills + totalAssists) / totalDeaths).toFixed(2);

    return (
      <>
        {avgKills} / {avgDeaths} / {avgAssists}<br />
        {kda} KDA
      </>
    );
  };

  const renderWinLossPie = () => {
    const wins = matches.filter(m => m.win).length;
    const losses = matches.length - wins;
    const winRate = matches.length ? ((wins / matches.length) * 100).toFixed(0) + "%" : "0%";
  
    const data = {
      labels: ["Losses", "Wins"],
      datasets: [
        {
          label: "Games",
          data: [losses, wins],
          backgroundColor: ["#d54d5a", "#587cd4"],
          borderWidth: 1
        }
      ]
    };
  
    const centerTextPlugin = {
      id: 'centerText',
      beforeDraw: (chart) => {
        const { width, height, ctx } = chart;
        ctx.restore();
        const fontSize = (height / 114).toFixed(2);
        ctx.font = `${fontSize}em sans-serif`;
        ctx.textBaseline = "middle";
        ctx.fillStyle = "#000";
        const text = winRate;
        const textX = Math.round((width - ctx.measureText(text).width) / 2);
        const textY = height / 2;
        ctx.fillText(text, textX, textY);
        ctx.save();
      }
    };
  
    const options = {
      cutout: "55%",
      plugins: {
        legend: { display: false },
        tooltip: { enabled: true },
        centerText: true
      }
    };
  
    return <Pie data={data} options={options} plugins={[centerTextPlugin]} />;
  };
  
  
  return (
    <div className="container-fluid mx-auto">
      <div className="row justify-content-center">
        <div className="col-lg-3">
          {renderRankCard("Ranked Solo/Duo", rankedData.solo)}
          {renderRankCard("Ranked Flex", rankedData.flex)}
        </div>

        <div className="col-lg-6">
          <div className="card mb-3">
            <div className="card-header">Last {matches.length} Game{matches.length !== 1 ? "s" : ""}</div>
            <div className="row g-0">
              <div className="col-md-6 d-flex align-items-center">
                <div className="p-4">
                  <div style={{ width: "100px", height: "100px" }}>
                    {renderWinLossPie()}
                  </div>

                </div>
                <div className="text-center">{renderRecentStats()}</div>
              </div>
              <div className="col-5">
                <div className="card-body">
                  <div className="card-title">Recent Played Champion</div>
                  <div className="card-text">
                    {championStats.length ? (
                      championStats.slice(0, 3).map((champ, i) => (
                        <div key={i}>
                          <img
                            src={`https://ddragon.leagueoflegends.com/cdn/15.8.1/img/champion/${champ.championName}.png`}
                            width="20"
                            className="me-2"
                            alt={champ.championName}
                          />
                          {champ.winRate}% ({champ.wins}W / {champ.losses}L) {champ.kda} KDA<br />
                        </div>
                      ))
                    ) : (
                      <>N/A</>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {matches.length > 0 ? (
            matches.map((match) => (
              <MatchCard
                key={match.matchId}
                match={match}
                toggleMatchDetails={toggleMatchDetails}
              />
            ))
          ) : (
            !isLoading && summonerData && (
              <div className="card mt-3">
                <div className="card-body text-center">
                  <p>No recent matches found</p>
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileOverview;
