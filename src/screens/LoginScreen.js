import styled from "styled-components";
import { keyframes } from "styled-components";
import { auth, provider } from "../utils/firebase";
import img from "../assets/img/app.png";
import { useAuthState } from "react-firebase-hooks/auth";
import { useEffect } from "react";
import { useHistory } from "react-router-dom";

const LoginScreen = () => {
  const [user] = useAuthState(auth);
  const history = useHistory();

  useEffect(() => {
    if (user) {
      history.push("/home");
    }
  }, [user, history]);

  const signIn = () => {
    auth.signInWithPopup(provider).catch(alert);
  };

  return (
    <Container>
      <LoginContainer>
        <Logo src={img} />
        <Button variant="outlined" onClick={signIn}>
          Sign In With Google!
        </Button>
      </LoginContainer>
    </Container>
  );
};

export default LoginScreen;

const breatheAnimation = keyframes`
 0% { background-position: left;}
 100% { background-position: right;}
`;

const Container = styled.div`
  display: grid;
  place-items: center;
  height: 100vh;
  background-color: #166d3b;
  background-image: linear-gradient(147deg, #166d3b 0%, #000000 74%);
  background-size: 400%;
  animation-name: ${breatheAnimation};
  animation-duration: 6s;
  animation-iteration-count: infinite;
  animation-direction: alternate;
`;

const LoginContainer = styled.div`
  padding: 50px;
  opacity: 0.8;
  align-items: center;
  background-color: transparent;
  display: flex;
  flex-direction: column;
  border: 2px solid #00c853;
  border-radius: 20px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);

  @media screen and (max-width: 760px) {
    padding: 20px;
  }
`;

const Logo = styled.img`
  height: 300px;
  width: 300px;
  margin-bottom: 30px;
`;

const Button = styled.button`
  padding: 12px 30px;
  background-color: #00c853;
  border-radius: 15px;
  font-weight: 800;
  font-size: 16px;
  border: none;
`;
