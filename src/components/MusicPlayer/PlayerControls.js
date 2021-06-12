import { IconButton } from "@material-ui/core";
import React from "react";
import { BsPlayFill, BsPauseFill } from "react-icons/bs";
import { FaForward } from "react-icons/fa";

function PlayerControls({ isPlaying, pauseSong, playSong, vote, addVotes }) {
  return (
    <div className="player-controls">
      <button
        className="player-controls__play-btn"
        onClick={() => (isPlaying ? pauseSong() : playSong())}
      >
        {isPlaying ? <BsPauseFill /> : <BsPlayFill />}
      </button>

      <IconButton
        disabled={vote === true ? true : false}
        onClick={() => addVotes()}
      >
        <FaForward />
      </IconButton>
    </div>
  );
}

export default PlayerControls;
