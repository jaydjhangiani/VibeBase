import {
  Container,
  createMuiTheme,
  Grid,
  MuiThemeProvider,
} from "@material-ui/core";
import React from "react";
import {
  FormWrapper,
  ScreenTopLine,
  ScreenWrapper,
} from "../components/Screen";
import styled from "styled-components";
import TextField from "../components/Form/TextField";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { db } from "../utils/firebase";
import firebase from "firebase";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Button, ButtonWrapper } from "../components/Button";
toast.configure();

const theme = createMuiTheme({
  palette: {
    primary: { main: "#01BF71" },
    secondary: { main: "#010606" },
  },
});

const FeedbackScreen = () => {
  const handleSubmit = (values) => {
    console.log(values);
    db.collection("feedback")
      .add({
        name: values.name,
        email: values.email,
        feedback: values.feedback,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      })
      .then(() => toast.success("Feedback Submitted Successfuly!!"))
      .catch((err) => {
        console.log(err);
        toast.error("Something went wrong!!");
      });
  };

  const INITIAL_FORM_STATE = {
    name: "",
    email: "",
    feedback: "",
  };

  const FORM_VALIDATION = Yup.object().shape({
    name: Yup.string().required("Required."),
    email: Yup.string().email("Invalid Email.").required("Required."),
    feedback: Yup.string().required("Required."),
  });

  return (
    <MuiThemeProvider theme={theme}>
      <ScreenContainer>
        <ScreenWrapper>
          <FormWrapper>
            <ScreenTopLine>Hey! Liked this app?</ScreenTopLine>
            <FormP>Give us your feedback</FormP>
            <br />
            <Container maxWidth="md">
              <Formik
                initialValues={{ ...INITIAL_FORM_STATE }}
                validationSchema={FORM_VALIDATION}
                onSubmit={handleSubmit}
              >
                <Form>
                  <Grid container spacing={2}>
                    <Grid item xs={12} align="center">
                      <TextField fullWidth={true} name="name" label="Name" />
                    </Grid>
                    <Grid item xs={12} align="center">
                      <TextField fullWidth={true} name="email" label="Email" />
                    </Grid>
                    <Grid item xs={12} align="center">
                      <TextField
                        fullWidth={true}
                        name="feedback"
                        label="Your Feedback"
                        multiline={true}
                        rows={3}
                      />
                    </Grid>
                  </Grid>
                  <ButtonWrapper fullWidth={true} removeMarginBottom={true}>
                    <Button primary="true" type="submit">
                      Submit
                    </Button>
                  </ButtonWrapper>
                </Form>
              </Formik>
            </Container>
          </FormWrapper>
        </ScreenWrapper>
      </ScreenContainer>
    </MuiThemeProvider>
  );
};

export default FeedbackScreen;

const FormP = styled.div`
  margin-bottom: 10px;
  font-size: 1rem;
  font-weight: 600;
`;

export const ScreenContainer = styled.div`
  background-color: #212121;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='250' height='30' viewBox='0 0 1000 120'%3E%3Cg fill='none' stroke='%23000000' stroke-width='10' %3E%3Cpath d='M-500 75c0 0 125-30 250-30S0 75 0 75s125 30 250 30s250-30 250-30s125-30 250-30s250 30 250 30s125 30 250 30s250-30 250-30'/%3E%3Cpath d='M-500 45c0 0 125-30 250-30S0 45 0 45s125 30 250 30s250-30 250-30s125-30 250-30s250 30 250 30s125 30 250 30s250-30 250-30'/%3E%3Cpath d='M-500 105c0 0 125-30 250-30S0 105 0 105s125 30 250 30s250-30 250-30s125-30 250-30s250 30 250 30s125 30 250 30s250-30 250-30'/%3E%3Cpath d='M-500 15c0 0 125-30 250-30S0 15 0 15s125 30 250 30s250-30 250-30s125-30 250-30s250 30 250 30s125 30 250 30s250-30 250-30'/%3E%3Cpath d='M-500-15c0 0 125-30 250-30S0-15 0-15s125 30 250 30s250-30 250-30s125-30 250-30s250 30 250 30s125 30 250 30s250-30 250-30'/%3E%3Cpath d='M-500 135c0 0 125-30 250-30S0 135 0 135s125 30 250 30s250-30 250-30s125-30 250-30s250 30 250 30s125 30 250 30s250-30 250-30'/%3E%3C/g%3E%3C/svg%3E");
  padding: ${({ reducePadding }) => (reducePadding ? "20px 0" : "100px 0;")};
  height: 100vh;
  margin-top: -60px;
  @media screen and (max-width: 760px) {
    padding: ${({ reducePadding }) => (reducePadding ? "20px 0" : "50px 0;")};
  }
`;
