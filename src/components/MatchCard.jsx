import React from "react";
import { getQueueDescription, getRuneImage, getSummonerSpellName } from "../utils/helpers";

const MatchCard = ({ match, toggleMatchDetails }) => {
  return (
    <div className="card mt-3">
      <div className="card-body d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center">
          <div className="mx-2">
            {getQueueDescription(match.queueId)}<br />
            {match.date}<br />
            {match.win ? "Win" : "Loss"}<br />
            {match.duration}
          </div>
          <img
            src={`https://ddragon.leagueoflegends.com/cdn/15.8.1/img/champion/${match.championName}.png`}
            width="72"
            className="mx-2"
            alt={match.championName}
          />
          <div className="mx-2">
            {match.kills} / {match.deaths} / {match.assists}<br />
            {match.kda} KDA
          </div>
          <div className="mx-2 d-none d-md-block">
            <img
              src={`https://ddragon.leagueoflegends.com/cdn/15.8.1/img/spell/Summoner${getSummonerSpellName(
                match.summoner1Id
              )}.png`}
              width="36"
              className="p-1"
              alt="Summoner Spell 1"
            /><br />
            <img
              src={`https://ddragon.leagueoflegends.com/cdn/15.8.1/img/spell/Summoner${getSummonerSpellName(
                match.summoner2Id
              )}.png`}
              width="36"
              className="p-1"
              alt="Summoner Spell 2"
            />
          </div>
          <div className="d-none d-md-block">
            <img
              src={getRuneImage(match.primaryRuneId)}
              width="36"
              className="p-1"
              alt="Primary Rune"
            /><br />
            <img
              src={getRuneImage(match.subStyleId)}
              width="32"
              className="p-1"
              alt={getRuneImage(match.subStyleId)}
            />
          </div>
          <div className="mx-1 d-none d-md-block" style={{ maxWidth: "150px" }}>
            <div className="row row-cols-4 g-1">
              {[match.item0, match.item1, match.item2, match.item6, match.item3, match.item4, match.item5].map(
                (itemId, idx) => (
                  <div className="col" key={idx}>
                    {itemId > 0 ? (
                      <img
                        src={`https://ddragon.leagueoflegends.com/cdn/15.8.1/img/item/${itemId}.png`}
                        className="img-fluid"
                        width="36"
                        alt={`Item ${idx}`}
                      />
                    ) : (
                      <img 
                        src="https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/assets/items/icons2d/gp_ui_placeholder.png"
                        className="img-fluid"
                        width="36"
                        alt="No Item"
                        />
                    )}
                  </div>
                )
              )}
            </div>
          </div>
        </div>
        <button
          id={`button-${match.matchId}`}
          className="full-height-btn collapsed"
          type="button"
          onClick={() => toggleMatchDetails(match.matchId)}
        >
          <span className="arrow">▲</span>
        </button>
      </div>
      <div className="collapse" id={`collapse-${match.matchId}`}>
        <div className="card card-body outer-bordered-table">
          <table className="table align-middle text-center">
            <thead>
                <tr>
                  <th 
                    colSpan="11" 
                    className={`text-start ${match.win ? "header-win" : "header-loss"}`}
                    
                  >
                    {match.win ? "Win" : "Loss"} ({match.teamId === 100 ? "Blue Team" : "Red Team"})
                  </th>
                </tr>
            </thead>
            <tbody>
                {match.teamMembers.map((player, idx) => (
                <tr key={idx}>
                    <td>
                      {player.summonerName}<br />
                      {/* <small>{player.tier} {player.rank}</small> */}
                    </td>
                    <td>
                      <img 
                          src={`https://ddragon.leagueoflegends.com/cdn/15.8.1/img/champion/${player.championName}.png`} 
                          width="40"
                          alt={player.championName}
                      />
                    </td>
                    <td>
                      <img 
                        src={`https://ddragon.leagueoflegends.com/cdn/15.8.1/img/spell/Summoner${getSummonerSpellName(player.summoner1Id)}.png`} width="25" alt={`${player.summoner1Id}`} /><br />
                      <img 
                        src={`https://ddragon.leagueoflegends.com/cdn/15.8.1/img/spell/Summoner${getSummonerSpellName(player.summoner2Id)}.png`} width="25" alt={`${player.summoner2Id}`} />
                      </td>
                    <td>
                    <img
                        src={player.primaryRuneId ? `${getRuneImage(player.primaryRuneId)}` : ""}
                        width="25"
                        alt={`${player.primaryRuneId}`}
                    /><br />
                    <img
                        src={player.subStyleId ? `${getRuneImage(player.subStyleId)}` : ""}
                        width="18"
                        alt={`${player.subStyleId}`}
                    />
                    </td>
                    <td>
                    <div className="mx-1 d-none d-md-block" style={{ maxWidth: "300px" }}>
                        <div className="row row-cols-4 gx-1 gy-1">
                        {[player.item0, player.item1, player.item2, player.item6, player.item3, player.item4, player.item5].map((itemId, i) => (
                            <div className="col" key={i}>
                            {itemId > 0 ? (
                                <img
                                src={`https://ddragon.leagueoflegends.com/cdn/15.8.1/img/item/${itemId}.png`}
                                className="img-fluid"
                                width="30"
                                alt={`Item ${i}`}
                                />
                            ) : (
                                <img 
                                src="https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/assets/items/icons2d/gp_ui_placeholder.png"
                                className="img-fluid"
                                width="30"
                                alt="No Item"
                                />
                            )}
                            </div>
                        ))}
                        </div>
                    </div>
                    </td>
                    <td>{player.kills}/{player.deaths}/{player.assists}</td>
                    <td>{player.cs} CS ({player.csPerMin})</td>
                    <td>{player.totalDamageDealtToChampions}</td>
                </tr>
                ))}
            </tbody>
            <thead>
                <tr>
                  <th 
                    colSpan="11" 
                    className={`text-start ${match.win ? "header-loss" : "header-win"}`}
                  >
                    {match.win ? "Loss" : "Win"} ({match.teamId === 100 ? "Red Team" : "Blue Team"})

                  </th>
                </tr>
            </thead>
            <tbody>
                {match.opposingTeam.map((player, idx) => (
                <tr key={idx}>
                    <td>
                    {player.summonerName}<br />
                    {/* <small>{player.tier} {player.rank}</small> */}
                    </td>
                    <td>
                    <img 
                        src={`https://ddragon.leagueoflegends.com/cdn/15.8.1/img/champion/${player.championName}.png`} 
                        width="40"
                        alt={player.championName}
                    />
                    </td>
                    <td>
                    <img src={`https://ddragon.leagueoflegends.com/cdn/15.8.1/img/spell/Summoner${getSummonerSpellName(player.summoner1Id)}.png`} width="25" alt={`${player.summoner1Id}`} /><br />
                    <img src={`https://ddragon.leagueoflegends.com/cdn/15.8.1/img/spell/Summoner${getSummonerSpellName(player.summoner2Id)}.png`} width="25" alt={`${player.summoner2Id}`} />
                    </td>
                    <td>
                    <img
                        src={player.primaryRuneId ? `${getRuneImage(player.primaryRuneId)}` : ""}
                        width="25"
                        alt={`${player.primaryRuneId}`}
                    /><br />
                    <img
                        src={player.subStyleId ? `${getRuneImage(player.subStyleId)}` : ""}
                        width="18"
                        alt={`${player.subStyleId}`}
                    />
                    </td>
                    <td>
                    <div className="mx-1 d-none d-md-block" style={{ maxWidth: "300px" }}>
                        <div className="row row-cols-4 gx-1 gy-1">
                        {[player.item0, player.item1, player.item2, player.item6, player.item3, player.item4, player.item5].map((itemId, i) => (
                            <div className="col" key={i}>
                            {itemId > 0 ? (
                                <img
                                src={`https://ddragon.leagueoflegends.com/cdn/15.8.1/img/item/${itemId}.png`}
                                className="img-fluid"
                                width="30"
                                alt={`Item ${i}`}
                                />
                            ) : (
                                <img 
                                src="https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/assets/items/icons2d/gp_ui_placeholder.png"
                                className="img-fluid"
                                width="30"
                                alt="No Item"
                                />
                            )}
                            </div>
                        ))}
                        </div>
                    </div>
                    </td>
                    <td>{player.kills}/{player.deaths}/{player.assists}</td>
                    <td>{player.cs} CS ({player.csPerMin})</td>
                    <td>{player.totalDamageDealtToChampions}</td>
                </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MatchCard;
