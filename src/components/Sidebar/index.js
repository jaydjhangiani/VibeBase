import { useAuthState } from "react-firebase-hooks/auth";
import { FaTimes } from "react-icons/fa";
import { Link, useHistory } from "react-router-dom";
import styled from "styled-components";
import { auth } from "../../utils/firebase";

const Sidebar = ({ toggle, isOpen }) => {
  const [user] = useAuthState(auth);
  const history = useHistory();
  return (
    <>
      <SidebarContainer isOpen={isOpen} onClick={toggle}>
        <Icon onClick={toggle}>
          <CloseIcon />
        </Icon>
        <SidebarWrapper>
          <SidebarMenu>
            <SidebarLink to="/" onClick={toggle}>
              Back To Your Room
            </SidebarLink>

            <SidebarLink to="/feedback" onClick={toggle}>
              Had Fun ? Give us a feedback
            </SidebarLink>

            {user ? (
              <SideBtnWrap>
                <Button
                  onClick={() => {
                    auth.signOut();
                    history.push("/");
                  }}
                >
                  Tap Out
                </Button>
              </SideBtnWrap>
            ) : null}
          </SidebarMenu>
        </SidebarWrapper>
      </SidebarContainer>
    </>
  );
};

export default Sidebar;

const SidebarContainer = styled.aside`
  position: fixed;
  z-index: 999;
  width: 100%;
  height: 100%;
  background: #010606;
  display: grid;
  align-items: center;
  top: 0;
  left: 0;
  transition: 0.3s ease-in-out;
  opacity: ${({ isOpen }) => (isOpen ? "100%" : "0")};
  left: ${({ isOpen }) => (isOpen ? "0" : "-100%")};
`;

const CloseIcon = styled(FaTimes)`
  color: #fff;
`;

const Icon = styled.div`
  position: absolute;
  top: 1.2rem;
  right: 1.5rem;
  background: transparent;
  font-size: 2rem;
  cursor: pointer;
  outline: none;
`;

const SidebarWrapper = styled.div``;

const SidebarMenu = styled.ul`
  display: grid;
  grid-template-columns: 1fr;
  align-items: center;
  padding-left: 0px;
  grid-template-rows: repeat(4, 80px);
  text-align: center;
  @media screen and (max-width: 480px) {
    grid-template-rows: repeat(4, 60px);
  }
`;

// const MenuText = styled.h1`
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   font-size: 1.5rem;
//   font-weight: 600;
//   text-decoration: none;
//   list-style: none;
//   transition: 0.2s ease-in-out;
//   text-decoration: none;
//   color: #fff;
//   @media screen and (max-width: 480px) {
//     font-size: 1.2rem;
//   }
// `;

const SidebarLink = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: 600;
  text-decoration: none;
  list-style: none;
  transition: 0.2s ease-in-out;
  text-decoration: none;
  color: #fff;
  cursor: pointer;
  &:hover {
    color: #14bf71;
    transition: 0.2s ease-in-out;
  }
`;

const Button = styled.button`
  border-radius: 50px;
  background: #14bf71;
  white-space: nowrap;
  padding: 12px 30px;
  color: #fff;
  font-size: 16px;
  outline: none;
  cursor: pointer;
  display: flex;
  border: none;
  justify-content: center;
  align-items: center;
  transition: all 0.2s ease-in-out;
  box-shadow: 0px 4px 14px -3px rgba(0, 0, 0, 0.2);
  &:hover {
    transition: all 0.2s ease-in-out;
    background-color: white;
    border: 1px solid #000;
    color: #14bf71;
  }
`;

const SideBtnWrap = styled.div`
  display: flex;
  justify-content: center;
`;
