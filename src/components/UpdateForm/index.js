import {
  FormControl,
  FormControlLabel,
  Grid,
  Radio,
  RadioGroup,
  TextField,
  FormHelperText,
} from "@material-ui/core";
import styled from "styled-components";
import { Button, ButtonWrapper } from "../Button";
import { FormWrapper, ScreenHeading } from "../Screen";

const UpdateForm = ({
  setGuestCanPauseUpdated,
  setVotesToSkipUpdated,
  handleUpdateRoom,
  votesToSkip,
  guestCanPause,
  checkIfHost,
  update,
  setUpdate,
}) => {
  return (
    <FormWrapper>
      <ScreenHeading>Update The Room Settings</ScreenHeading>
      <Grid container spacing={5}>
        <Grid item xs={12} align="center">
          <FormControl component="fieldset">
            <FormP>Guest Control of Playback State</FormP>
            <RadioGroup
              row
              defaultValue={guestCanPause.toString()}
              onChange={(e) => {
                setGuestCanPauseUpdated(
                  e.target.value === "true" ? true : false
                );
              }}
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
              onChange={(e) => setVotesToSkipUpdated(e.target.value)}
              defaultValue={votesToSkip}
              inputProps={{
                min: 1,
                style: { textAlign: "center" },
              }}
            />
            <FormHelperText>Votes Required To Skip Song</FormHelperText>
          </FormControl>
        </Grid>
      </Grid>

      <ButtonWrapper>
        {checkIfHost() ? (
          <Button primary="true" onClick={handleUpdateRoom}>
            CONFIRM
          </Button>
        ) : null}
        <Button onClick={() => setUpdate(!update)}>BACK</Button>
      </ButtonWrapper>
    </FormWrapper>
  );
};

export default UpdateForm;

const FormP = styled.div`
  margin-bottom: 10px;
  font-size: 0.9rem;
`;
