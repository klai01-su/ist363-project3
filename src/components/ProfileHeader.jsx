import React from "react";

const ProfileHeader = ({ summonerData, championStats }) => (
  <div className="container-fluid mx-auto">
    <div className="row justify-content-md-center">
      <div className="col-lg-9 mb-3">
        <div className="card text-bg-dark">
          <img
            src={
              championStats?.length > 0 && championStats[0]?.championName
                ? `https://ddragon.leagueoflegends.com/cdn/img/champion/centered/${championStats[0].championName}_0.jpg`
                : "https://ddragon.leagueoflegends.com/cdn/img/bg/F5141416.png"
            }
            className="card-img profile-img"
            alt="Profile Background"
          />

          <div className="card-img-overlay">
            <div className="d-flex">
              <img
                src={`https://ddragon.leagueoflegends.com/cdn/15.8.1/img/profileicon/${summonerData.iconId}.png`}
                width="100"
                className="img-fluid"
                alt="Profile Icon"
              />
              <div className="ms-3">
                <div className="card-title fs-4">{summonerData.gameName}#{summonerData.tagLine}</div>
                <div className="card-text">
                  Level: {summonerData.level}
                  <br />
                  {summonerData.region}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default ProfileHeader;
