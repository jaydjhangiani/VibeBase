import { FormControl, Grid, TextField } from "@material-ui/core";
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
import { auth, db } from "../utils/firebase";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import firebase from "firebase";
import { useCollection } from "react-firebase-hooks/firestore";
import { Button, ButtonWrapper } from "../components/Button";
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

const JoinRoomScreen = () => {
  const [user] = useAuthState(auth);

  const history = useHistory();
  const [roomSnapshot] = useCollection(db.collection("rooms"));
  const [code, setCode] = useState("");

  const checkRoomCodeExists = () => {
    return !!roomSnapshot?.docs.find((room) => room.data().roomCode === code);
  };

  const handleJoinRoom = (e) => {
    e.preventDefault();
    if (checkRoomCodeExists()) {
      roomSnapshot.docs.map((room) => {
        if (room.data().roomCode === code) {
          db.collection("rooms")
            .doc(room.id)
            .collection("participants")
            .doc(user.uid)
            .set({
              name: user.displayName,
              uid: user.uid,
              photoUrl: user.photoURL,
              enteredAt: firebase.firestore.FieldValue.serverTimestamp(),
              leftAt: null,
            });
          localStorage.setItem("session-id", room.id);
          history.push(`/room/${code}`);
          toast.success(`Welcome to ${room.data().host}'s house party!`);
        }
      });
    } else {
      toast.error("Wrong Room Code!");
    }
  };
  return (
    <div>
      <MuiThemeProvider theme={theme}>
        <ScreenContainer>
          <ScreenWrapper>
            <FormWrapper>
              <ScreenTopLine>Hey! {user.displayName}</ScreenTopLine>
              <FormP>Join A Room</FormP>
              <br />
              <Grid container spacing={5}>
                <Grid item xs={12} align="center">
                  <FormControl>
                    <TextField
                      required={true}
                      type="text"
                      label="Enter Room Code"
                      variant="outlined"
                      onChange={(e) => setCode(e.target.value)}
                    />
                  </FormControl>
                </Grid>
              </Grid>
              <ButtonWrapper removeMarginBottom={true}>
                <Button primary="true" onClick={handleJoinRoom}>
                  Enter the fun
                </Button>
                <Button onClick={(e) => history.push("/")}>I'm Out</Button>
              </ButtonWrapper>
            </FormWrapper>
          </ScreenWrapper>
        </ScreenContainer>
      </MuiThemeProvider>
    </div>
  );
};

export default JoinRoomScreen;

const FormP = styled.div`
  margin-bottom: 10px;
  font-size: 1rem;
  font-weight: 600;
`;
