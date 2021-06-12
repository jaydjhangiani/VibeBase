import { FaBars } from "react-icons/fa";
import styled from "styled-components";

const Navbar = ({ toggle }) => {
  return (
    <Nav>
      <MobileIcon onClick={toggle}>
        <FaBars />
      </MobileIcon>
    </Nav>
  );
};

export default Navbar;

const Nav = styled.nav`
  height: 60px;
  display: flex;
  justify-content: space-between;

  z-index: 10;
`;

const MobileIcon = styled.div`
  display: flex;
  background-color: black;
  padding: 15px;
  position: absolute;
  top: 0px;
  margin-top: -20px;
  margin-right: -35px;
  border-radius: 10px;
  color: white !important;
  right: 0px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
  font-size: 1.8rem;
  transform: translate(-100%, 60%);
  cursor: pointer;
`;
