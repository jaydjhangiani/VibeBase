import React, { useRef } from "react";
import { useSpring, animated } from "react-spring";
import styled from "styled-components";
import { MdClose } from "react-icons/md";

const SignOffModal = ({
  showModal,
  setShowParticipantsModal,
  setShowModal,
  participants,
  host,
}) => {
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
              <h1>Homies</h1>
              <br />
              <p>Who's in!</p>
              <p>{`${host} - The Host`}</p>
              {participants?.map((index, item) => {
                if (!index.data.leftAt) {
                  return <p>{index.data.name}</p>;
                }
              })}
              <hr
                style={{
                  width: "80%",
                  margin: "2px 0px 10px 0px",
                }}
              />

              <p>Who left</p>
              {participants?.map((index, item) => {
                if (index.data.leftAt) {
                  return <p>{index.data.name}</p>;
                }
              })}
              <br />
            </ModalContent>
            <CloseModalButton
              aria-label="close modal"
              onClick={() => {
                setShowModal(false);
                setShowParticipantsModal(false);
              }}
            />
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
  z-index: 100;
  box-shadow: 0 5px 16px rgba(0, 0, 0, 0.2);
  background: white;
  display: grid;
  grid-template-columns: 1fr;
  position: relative;
  z-index: 100;
  border-radius: 10px;

  @media screen and (max-width: 480px) {
    width: 340px;
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
const CloseModalButton = styled(MdClose)`
  cursor: pointer;
  position: absolute;
  top: 20px;
  right: 20px;
  width: 32px;
  height: 32px;
  padding: 0;
  z-index: 10;
`;
