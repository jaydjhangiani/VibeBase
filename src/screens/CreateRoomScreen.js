import {
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  RadioGroup,
  Radio,
  TextField,
} from "@material-ui/core";
import styled from "styled-components";
import { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useHistory } from "react-router-dom";
import {
  ScreenContainer,
  ScreenWrapper,
  FormWrapper,
  ScreenTopLine,
} from "../components/Screen";
import * as qs from "qs";
import { auth, db } from "../utils/firebase";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import firebase from "firebase";
import { useCollection } from "react-firebase-hooks/firestore";
import Loader from "../components/Loader";
import { useEffect } from "react";
import { Button, ButtonWrapper } from "../components/Button";
import axios from "axios";
//toast
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

toast.configure();

const theme = createMuiTheme({
  palette: {
    primary: { main: "#01BF71" },
    secondary: { main: "#010606" },
  },
});

const CreateRoomScreen = () => {
  const [user] = useAuthState(auth);
  const defaultVotes = "2";
  const [guestCanPause, setGuestCanPause] = useState(true);
  const [votesToSkip, setVotesToSkip] = useState(defaultVotes);
  const history = useHistory();
  const [roomSnapshot] = useCollection(db.collection("rooms"));
  const [roomCode, setRoomCode] = useState("");

  // generate random 6 digit room code
  const makeid = (length) => {
    var result = [];
    var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result.push(
        characters.charAt(Math.floor(Math.random() * charactersLength))
      );
    }
    let code = result.join("");
    if (checkRoomCodeExists(code)) {
      makeid(6);
      console.log(code);
    }
    console.log(code);
    return code;
  };

  // check if room already exists
  const checkRoomCodeExists = (code) => {
    return !!roomSnapshot?.docs.find((room) => room.data().roomCode === code);
  };

  // if user is already in a room, redirect them to the room
  useEffect(() => {
    if (localStorage.getItem("session-id")) {
      if (
        !!roomSnapshot?.docs.find(
          (room) => room.id === localStorage.getItem("session-id")
        )
      ) {
        db.collection("rooms")
          .doc(localStorage.getItem("session-id"))
          .get()
          .then((data) => setRoomCode(data.data().roomCode));
        if (roomCode) {
          console.log(roomCode);
          history.push(`/room/${roomCode}`);
        }
      }
    }
  }, [roomCode, roomSnapshot, history]);

  // get token from url
  const getToken = (hash) => {
    const stringAfterHash = hash.substring(1);
    const paramsInUrl = stringAfterHash.split("?");
    console.log(paramsInUrl);
    const paramsSplitUp = paramsInUrl.reduce((accumulator, currentValue) => {
      const [key, value] = currentValue.split("=");
      accumulator[key] = value;
      console.log(accumulator);
      return accumulator;
    }, {});
    return paramsSplitUp;
  };

  // get tokens after getting auth code from OAuth
  useEffect(() => {
    if (window.location.search) {
      const { code } = getToken(window.location.search);
      console.log(code);
      axios({
        method: "post",
        url: "https://accounts.spotify.com/api/token",
        data: qs.stringify({
          grant_type: "authorization_code",
          code: code,
          redirect_uri: process.env.REACT_APP_REDIRECT_URI,
          client_id: process.env.REACT_APP_CLIENT_ID,
          client_secret: process.env.REACT_APP_CLIENT_SECRET,
        }),
        headers: {
          "content-type": "application/x-www-form-urlencoded;charset=utf-8",
        },
      })
        .then((res) => {
          console.log(res.data);
          db.collection("spotify").add({
            user: user.uid,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            refresh_token: res.data.refresh_token,
            access_token: res.data.access_token,
            expires_in: res.data.expires_in,
            token_type: res.data.token_type,
          });
          const code = makeid(6);
          db.collection("rooms")
            .add({
              host: user.displayName,
              roomCode: code,
              hostId: user.uid,
              guestCanPause,
              votesToSkip,
              currentRoomSong: null,
              createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            })
            .then((res) => {
              toast.success("Created Successfuly");
              localStorage.setItem("session-id", res.id);
              history.push(`/room/${code}`);
            });
        })
        .catch((err) => console.log(err));
    }
  }, []);

  const handleCreateRoom = (e) => {
    e.preventDefault();

    const SCOPES = [
      "ugc-image-upload",
      "user-read-playback-state",
      "user-modify-playback-state",
      "user-read-currently-playing",
    ];
    const SPACE_DELIMITER = "%20";
    const SCOPES_URL_PARAM = SCOPES.join(SPACE_DELIMITER);

    window.location = `https://accounts.spotify.com/authorize?client_id=${process.env.REACT_APP_CLIENT_ID}&redirect_uri=${process.env.REACT_APP_REDIRECT_URI}&scope=${SCOPES_URL_PARAM}&response_type=code&show_dialog=true`;
  };

  return roomCode.length > 0 ? (
    <Loader />
  ) : (
    <MuiThemeProvider theme={theme}>
      <ScreenContainer>
        <ScreenWrapper>
          <FormWrapper>
            <ScreenTopLine>Hey! {user.displayName}</ScreenTopLine>
            <br />
            <Grid container spacing={5}>
              <Grid item xs={12} align="center">
                <FormControl component="fieldset">
                  <FormP>Guest Control of Playback State</FormP>
                  <RadioGroup
                    row
                    defaultValue="true"
                    onChange={(e) => setGuestCanPause(!guestCanPause)}
                  >
                    <FormControlLabel
                      value="true"
                      control={<Radio color="primary" />}
                      label="Play/Pause"
                      labelPlacement="bottom"
                    />

                    <FormControlLabel
                      value="false"
                      control={<Radio color="secondary" />}
                      label="No Control"
                      labelPlacement="bottom"
                    />
                  </RadioGroup>
                </FormControl>
              </Grid>
              <Grid item xs={12} align="center">
                <FormControl>
                  <TextField
                    required={true}
                    type="number"
                    onChange={(e) => setVotesToSkip(e.target.value)}
                    defaultValue={defaultVotes}
                    inputProps={{
                      min: 1,
                      style: { textAlign: "center" },
                    }}
                  />
                  <FormHelperText>Votes Required To Skip Song</FormHelperText>
                </FormControl>
              </Grid>
            </Grid>
            <ButtonWrapper removeMarginBottom={true}>
              <Button onClick={handleCreateRoom}>Create A Room</Button>
              <Button primary="true" onClick={(e) => history.push("/")}>
                Back
              </Button>
            </ButtonWrapper>
          </FormWrapper>
        </ScreenWrapper>
      </ScreenContainer>
    </MuiThemeProvider>
  );
};

export default CreateRoomScreen;

const FormP = styled.div`
  margin-bottom: 10px;
  font-size: 0.9rem;
`;
