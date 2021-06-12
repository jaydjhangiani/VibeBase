import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import styled from "styled-components";
import {
  ScreenWrapper,
  FormWrapper,
  ScreenTopLine,
  ScreenHeading,
} from "../components/Screen";
import { useAuthState } from "react-firebase-hooks/auth";
import { toast } from "react-toastify";
import { auth, db } from "../utils/firebase";
import firebase from "firebase";
import Loader from "../components/Loader";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import * as qs from "qs";
import axios from "axios";
import { Button, ButtonWrapper } from "../components/Button";
import SignOffModal from "../components/Modal/SignOffModal";
import ParticipantsModal from "../components/Modal/ParticipantsModal";
import UpdateForm from "../components/UpdateForm";
import MusicPlayer from "../components/MusicPlayer";
toast.configure();

const theme = createMuiTheme({
  palette: {
    primary: { main: "#01BF71" },
    secondary: { main: "#010606" },
  },
});

const RoomScreen = () => {
  const [user] = useAuthState(auth);
  const { code } = useParams();
  const history = useHistory();
  const [loading, setLoading] = useState(true);
  const [roomData, setRoomData] = useState(null);
  const [update, setUpdate] = useState(false);
  const defaultVotes = 2;
  const [guestCanPause, setGuestCanPause] = useState(true);
  const [guestCanPauseUpdated, setGuestCanPauseUpdated] = useState(true);
  const [votesToSkip, setVotesToSkip] = useState(defaultVotes);
  const [votesToSkipUpdated, setVotesToSkipUpdated] = useState(defaultVotes);
  const [spotifyTokens, setSpotifyTokens] = useState(null);
  const [currentSong, setCurrentSong] = useState(null);
  const [vote, setVote] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showSignOffModal, setShowASignOffModal] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showParticipantsModal, setShowParticipantsModal] = useState(false);

  const [participants, setParticipants] = useState(null);

  //fetching room data
  useEffect(() => {
    db.collection("rooms")
      .where("roomCode", "==", code)
      .onSnapshot((snapshot) => {
        if (snapshot.size) {
          setRoomData(
            snapshot.docs.map((doc) => ({
              id: doc.id,
              data: doc.data(),
            }))
          );
          setLoading(false);
        } else {
          setRoomData([]);
          setLoading(false);
        }
      });
  }, []);

  //fetch updated room rules
  useEffect(() => {
    if (roomData?.length > 0 && localStorage.getItem("session-id")) {
      db.collection("rooms")
        .doc(localStorage.getItem("session-id"))
        .get()
        .then((snapshot) => {
          setVotesToSkip(snapshot.data().votesToSkip);
          setGuestCanPause(snapshot.data().guestCanPause);
        });
    }
  }, [roomData]);

  //fetch spotify token
  useEffect(() => {
    if (roomData && roomData.length > 0) {
      db.collection("spotify")
        .where("user", "==", roomData[0].data.hostId)
        .onSnapshot((snapshot) =>
          setSpotifyTokens(
            snapshot.docs.map((doc) => ({
              id: doc.id,
              data: doc.data(),
            }))
          )
        );
    }
  }, [roomData]);

  //keep track of participants
  useEffect(() => {
    const unsubscribe = db
      .collection("rooms")
      .doc(localStorage.getItem("session-id"))
      .collection("participants")
      .orderBy("enteredAt", "desc")
      .onSnapshot((snapshot) => {
        if (snapshot.size) {
          setParticipants(
            snapshot.docs.map((doc) => ({
              id: doc.id,
              data: doc.data(),
            }))
          );
        }
      });
    return unsubscribe;
  }, []);

  //send message to other participants
  useEffect(() => {
    if (participants && localStorage.getItem("session-id")) {
      if (
        participants[0].data.leftAt === null &&
        participants[0].data.uid !== user.uid
      ) {
        toast(`${participants[0].data.name} joined the fun!`);
      }
      if (participants[0].data.leftAt != null) {
        toast(`${participants[0].data.name} left the room!`);
      }
    }
  }, [participants]);

  // redirect if localstorage not set
  useEffect(() => {
    if (localStorage.getItem("session-id")) {
      if (roomData && !roomData.length > 0) {
        localStorage.removeItem("session-id");
        history.push("/");
      }
    } else {
      history.push("/join-room");
    }
  }, [roomData, history]);

  // refresh spotify token
  useEffect(() => {
    if (spotifyTokens && roomData) {
      if (
        (new Date() - new Date(spotifyTokens[0]?.data.createdAt?.toDate())) /
          1000.0 >
        spotifyTokens[0]?.data.expires_in
      ) {
        axios({
          method: "post",
          url: "https://accounts.spotify.com/api/token",
          data: qs.stringify({
            grant_type: "refresh_token",
            refresh_token: spotifyTokens[0]?.data.refresh_token,
            client_id: process.env.REACT_APP_CLIENT_ID,
            client_secret: process.env.REACT_APP_CLIENT_SECRET,
          }),
          headers: {
            "content-type": "application/x-www-form-urlencoded;charset=utf-8",
          },
        })
          .then((res) => {
            console.log(res);
            db.collection("spotify").doc(spotifyTokens[0].id).update({
              access_token: res.data.access_token,
              expires_in: res.data.expires_in,
              createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            });
          })
          .catch((err) => console.log(err));
      }
    }
  }, []);

  //fetch content every 1 second
  useEffect(() => {
    if (spotifyTokens && roomData) {
      let id = setInterval(() => {
        axios({
          method: "get",
          url: "https://api.spotify.com/v1/me/player/currently-playing",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${spotifyTokens[0]?.data.access_token}`,
          },
        }).then((response) => {
          setCurrentSong(response.data);
          setProgress(response.data.progress_ms);
        });
      }, 1000);
      return () => clearInterval(id);
    }
  });

  // refresh votes when song changes
  useEffect(() => {
    if (roomData?.length > 0 && currentSong) {
      if (roomData[0].data.currentRoomSong !== currentSong.item.id) {
        db.collection("rooms").doc(localStorage.getItem("session-id")).update({
          currentRoomSong: currentSong.item.id,
        });

        db.collection("rooms")
          .doc(localStorage.getItem("session-id"))
          .collection("votes")
          .get()
          .then((res) => {
            res.forEach((element) => {
              element.ref.delete();
            });
          });
        setVote(false);
      }
    }
  });

  const checkIfHost = () => {
    if (roomData) {
      return roomData[0]?.data.hostId === user.uid;
    }
  };

  const handleLeaveRoom = (e) => {
    e.preventDefault();
    if (checkIfHost()) {
      setShowModal(true);
      setShowASignOffModal(true);
      setTimeout(() => {
        setShowModal(false);
        setShowASignOffModal(false);
        db.collection("rooms")
          .doc(localStorage.getItem("session-id"))
          .collection("participants")
          .get()
          .then((res) => {
            res.forEach((element) => {
              element.ref.delete();
            });
          });
        db.collection("rooms").doc(localStorage.getItem("session-id")).delete();
        var delspotify_query = db
          .collection("spotify")
          .where("user", "==", user.uid);
        delspotify_query.get().then(function (querySnapshot) {
          querySnapshot.forEach(function (doc) {
            doc.ref.delete();
            console.log("success");
            history.push("/");
            localStorage.removeItem("session-id");
          });
        });
        db.collection("rooms")
          .doc(localStorage.getItem("session-id"))
          .collection("votes")
          .get()
          .then((res) => {
            res.forEach((element) => {
              element.ref.delete();
            });
          });
        setVote(false);
      }, 5000);
    } else {
      setShowModal(true);
      setShowASignOffModal(true);
      setTimeout(() => {
        setShowModal(false);
        setShowASignOffModal(false);
        db.collection("rooms")
          .doc(localStorage.getItem("session-id"))
          .collection("participants")
          .doc(user.uid)
          .update({
            leftAt: firebase.firestore.FieldValue.serverTimestamp(),
          })
          .then(() => {
            localStorage.removeItem("session-id");
            history.push("/");
          });
      }, 5000);
    }
  };

  const handleUpdateRoom = (e) => {
    e.preventDefault();
    console.log(votesToSkipUpdated, guestCanPauseUpdated);
    db.collection("rooms")
      .doc(localStorage.getItem("session-id"))
      .update({
        votesToSkip: votesToSkipUpdated,
        guestCanPause: guestCanPauseUpdated,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
      })
      .then(() => {
        toast.success("Updates Successfuly!");
        setUpdate(!update);
      })
      .catch((err) => {
        toast.error("Something went wrong!");
        console.log(err);
      });
  };

  return loading ? (
    <Loader />
  ) : (
    <MuiThemeProvider theme={theme}>
      <ScreenContainer fullHeight={currentSong ? true : false}>
        {showModal ? (
          showSignOffModal ? (
            <SignOffModal showModal={showSignOffModal} />
          ) : (
            <ParticipantsModal
              showParticipantsModal={showParticipantsModal}
              showModal={showModal}
              setShowModal={setShowModal}
              setShowParticipantsModal={setShowParticipantsModal}
              participants={participants}
              host={roomData[0]?.data?.host}
            />
          )
        ) : (
          <ScreenWrapper>
            {update ? (
              <UpdateForm
                setGuestCanPauseUpdated={setGuestCanPauseUpdated}
                setVotesToSkipUpdated={setVotesToSkipUpdated}
                handleUpdateRoom={handleUpdateRoom}
                votesToSkip={votesToSkip}
                guestCanPause={guestCanPause}
                checkIfHost={checkIfHost}
                update={update}
                setUpdate={setUpdate}
              />
            ) : (
              <FormWrapper>
                <ScreenHeading>Welcome to HouseParty!</ScreenHeading>
                {!roomData?.length > 0 ? (
                  <ScreenTopLine>INVALID ID</ScreenTopLine>
                ) : (
                  <ScreenTopLine>{code}</ScreenTopLine>
                )}
                {currentSong && roomData ? (
                  <MusicPlayer
                    progress={progress}
                    duration={currentSong?.item?.duration_ms}
                    isPlaying={currentSong?.is_playing}
                    albumCover={currentSong?.item?.album?.images[0]?.url}
                    name={currentSong?.item?.name}
                    token={spotifyTokens[0].data.access_token}
                    artist={currentSong?.item?.album?.artists[0]?.name}
                    guestCanPause={guestCanPause}
                    votesToSkip={votesToSkip}
                    host={checkIfHost()}
                    songId={currentSong?.item?.id}
                    vote={vote}
                    setProgress={setProgress}
                    setVote={setVote}
                  />
                ) : (
                  <p>Play from Spotify</p>
                )}

                <ButtonWrapper>
                  {checkIfHost() ? (
                    <Button
                      big="true"
                      primary="true"
                      onClick={(e) => setUpdate(!update)}
                    >
                      UPDATE
                    </Button>
                  ) : null}
                  <Button big="true" onClick={handleLeaveRoom}>
                    LEAVE
                  </Button>
                </ButtonWrapper>
                <p
                  style={{
                    cursor: "pointer",
                  }}
                  onClick={(e) => {
                    setShowParticipantsModal(!showParticipantsModal);
                    setShowModal(true);
                  }}
                >
                  Who's in this room?
                </p>
              </FormWrapper>
            )}
          </ScreenWrapper>
        )}
      </ScreenContainer>
    </MuiThemeProvider>
  );
};

export default RoomScreen;

const ScreenContainer = styled.div`
  background-color: #f5f5f5;
  padding: ${({ reducePadding }) => (reducePadding ? "20px 0" : "100px 0;")};
  height: ${({ fullHeight }) => (fullHeight ? "100%" : "100vh")};
  background-color: #000000;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%25' height='100%25' viewBox='0 0 800 800'%3E%3Cg %3E%3Ccircle fill='%23000000' cx='400' cy='400' r='600'/%3E%3Ccircle fill='%23090909' cx='400' cy='400' r='500'/%3E%3Ccircle fill='%23111111' cx='400' cy='400' r='400'/%3E%3Ccircle fill='%23171717' cx='400' cy='400' r='300'/%3E%3Ccircle fill='%231c1c1c' cx='400' cy='400' r='200'/%3E%3Ccircle fill='%23212121' cx='400' cy='400' r='100'/%3E%3C/g%3E%3C/svg%3E");
  background-attachment: fixed;
  background-size: cover;
  margin-top: -60px;
  @media screen and (max-width: 760px) {
    padding: ${({ reducePadding }) => (reducePadding ? "20px 0" : "50px 0;")};
  }
`;
