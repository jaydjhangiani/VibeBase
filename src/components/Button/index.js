import { Link } from "react-router-dom";
import styled from "styled-components";

export const ButtonWrapper = styled.div`
  margin: 25px;
  width: ${({ fullWidth }) => (fullWidth ? "90%" : "80%")};
  display: flex;
  justify-content: space-around;

  @media screen and (max-width: 760px) {
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-bottom: ${({ removeMarginBottom }) =>
      removeMarginBottom ? "-20px" : null};
  }
`;

export const ButtonLink = styled(Link)`
  border-radius: 50px;
  text-decoration: none;
  background: ${({ primary }) => (primary ? "#01BF71" : "#010606")};
  white-space: nowrap;
  width: 250px;
  padding: ${({ big }) => (big ? "14px 48px" : "12px 30px")};
  color: ${({ dark }) => (dark ? "#010606" : "#fff")};
  font-size: ${({ fontBig }) => (fontBig ? "20px" : "16px")};
  outline: none;
  border: none;
  cursor: pointer;
  display: flex;
  justify-content: center;
  transition: all 0.2s ease-in-out;
  &:hover {
    transition: all 0.2s ease-in-out;
    background: #fff;
    border: 1px solid #000;
    color: #010606;
  }

  @media screen and (max-width: 760px) {
    margin-bottom: 20px;
  }
`;

export const Button = styled.button`
  border-radius: 50px;
  text-decoration: none;
  background: ${({ primary }) => (primary ? "#01BF71" : "#010606")};
  white-space: nowrap;
  width: 250px;
  padding: ${({ big }) => (big ? "14px 48px" : "12px 30px")};
  color: ${({ dark }) => (dark ? "#010606" : "#fff")};
  font-size: ${({ fontBig }) => (fontBig ? "20px" : "16px")};
  outline: none;
  border: none;
  cursor: pointer;
  display: flex;
  justify-content: center;
  transition: all 0.2s ease-in-out;
  &:hover {
    transition: all 0.2s ease-in-out;
    background: #fff;
    border: 1px solid #000;
    color: #010606;
  }

  @media screen and (max-width: 760px) {
    margin-bottom: 20px;
  }
`;
