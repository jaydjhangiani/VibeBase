import React from "react";

function PlayerDetails({ albumCover, name, artist }) {
  return (
    <div className="player-details">
      <div className="player-details__img">
        <img src={albumCover} alt="" />
      </div>
      <h3 className="player-details__title">{name}</h3>
      <h4 className="player-details__author">{artist}</h4>
    </div>
  );
}

export default PlayerDetails;
