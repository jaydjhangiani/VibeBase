import { LinearProgress } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import PlayerDetails from "./PlayerDetails";
import "./index.css";
import { secondsToHms } from "../../utils/secondsToHms";
import PlayerControls from "./PlayerControls";
import axios from "axios";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../../utils/firebase";
import firebase from "firebase";
const MusicPlayer = ({
  albumCover,
  duration,
  progress,
  isPlaying,
  name,
  token,
  artist,
  guestCanPause,
  votesToSkip,
  setProgress,
  vote,
  setVote,
  host,
}) => {
  const [user] = useAuthState(auth);
  const [alreadyVoted, setAlreadyVoted] = useState(0);

  const pauseSong = () => {
    console.log(guestCanPause);
    if (guestCanPause === true) {
      axios({
        method: "put",
        url: "https://api.spotify.com/v1/me/player/pause",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
    }

    if (isPlaying && host) {
      axios({
        method: "put",
        url: "https://api.spotify.com/v1/me/player/pause",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
    }
  };

  const playSong = () => {
    if (guestCanPause === true) {
      axios({
        method: "put",
        url: "https://api.spotify.com/v1/me/player/play",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
    }
    if (!isPlaying && host) {
      axios({
        method: "put",
        url: "https://api.spotify.com/v1/me/player/play",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
    }
  };

  useEffect(() => {
    db.collection("rooms")
      .doc(localStorage.getItem("session-id"))
      .collection("votes")
      .onSnapshot((snapshot) => setAlreadyVoted(snapshot.docs.length));
  }, [alreadyVoted]);

  const skipSong = () => {
    axios({
      method: "post",
      url: "https://api.spotify.com/v1/me/player/next",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    setProgress(0);
    setAlreadyVoted(null);
  };

  const addVotes = () => {
    console.log("hi");
    setVote(true);
    db.collection("rooms")
      .doc(localStorage.getItem("session-id"))
      .collection("votes")
      .add({
        user: user.uid,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      });

    if (alreadyVoted >= votesToSkip - 1) {
      skipSong();
    }
  };

  return (
    <div>
      <div>
        <PlayerDetails albumCover={albumCover} name={name} artist={artist} />
        <LinearProgress
          variant="determinate"
          value={(progress / duration) * 100}
        />
        <div className="player__duration">
          <div className="player__timer">{secondsToHms(progress)}</div>
          <div className="player__timer">{secondsToHms(duration)}</div>
        </div>
        <PlayerControls
          isPlaying={isPlaying}
          pauseSong={pauseSong}
          playSong={playSong}
          addVotes={addVotes}
          vote={vote}
        />
      </div>
    </div>
  );
};

export default MusicPlayer;
