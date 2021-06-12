import React, { useRef } from "react";
import { useSpring, animated } from "react-spring";
import styled from "styled-components";
import { DoubleBounce } from "better-react-spinkit";

const SignOffModal = ({ showModal }) => {
  const modelRef = useRef();

  const animation = useSpring({
    config: {
      duration: 250,
    },
    opacity: showModal ? 1 : 0,
    transform: showModal ? `translateY(0%)` : `translateY(-100%)`,
  });

  return (
    <div>
      <Background ref={modelRef}>
        <animated.div style={animation}>
          <ModalWrapper showModal={showModal}>
            <ModalContent>
              <h1>Hope you had fun!</h1>
              <br />
              <br />
              <DoubleBounce color="#42b10c" size={100} />
              <br />
              <br />
              <h5>Clearing Data</h5>
              <br />
              <br />
              <p>See You Soon!</p>
            </ModalContent>
          </ModalWrapper>
        </animated.div>
      </Background>
    </div>
  );
};

export default SignOffModal;

const Background = styled.div`
  width: 100%;
  height: 100%;
  margin-top: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const ModalWrapper = styled.div`
  width: 400px;
  margin: 0 auto;
  height: 500px;
  box-shadow: 0 5px 16px rgba(0, 0, 0, 0.2);
  background: white;
  color: black;
  display: grid;
  grid-template-columns: 1fr;
  position: relative;
  z-index: 100;
  border-radius: 10px;

  @media screen and (max-width: 480px) {
    width: 350px;
  }
`;

const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-bottom: 1rem;
  color: #141414;

  h1 {
    margin-bottom: 1rem;
    text-align: left;
    padding-left: 20px;
    padding-right: 20px;
  }

  p {
    padding-left: 20px;
    padding-right: 20px;
    text-align: justify;
    margin-bottom: 1rem;
  }
`;
