import React from "react";
import { FaReact } from "react-icons/fa";
import styled from "styled-components";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <FooterContainer>
      <FooterWrap>
        <SocialLogo to="/">HouseParty</SocialLogo>
        <WebsiteRights>
          JJ © {new Date().getFullYear()} All rights reserved.{" "}
        </WebsiteRights>
        <SocialIcons>
          <SocialIconLink aria-label="MADE WITH REACT">
            <FaReact />
          </SocialIconLink>
        </SocialIcons>
      </FooterWrap>
    </FooterContainer>
  );
};

export default Footer;

export const FooterContainer = styled.footer`
  background-color: #010606;
`;

export const FooterWrap = styled.div`
  padding: 30px 24px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  max-width: 1100px;
  margin: 0 auto;
`;

const SocialLogo = styled(Link)`
  color: #fff;
  justify-self: start;
  cursor: pointer;
  text-decoration: none;
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  font-weight: bold;
`;

const WebsiteRights = styled.small`
  color: #fff;
  margin-bottom: 16px;
`;

const SocialIcons = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 240px;
`;

const SocialIconLink = styled.a`
  color: #fff;
  font-size: 24px;
  text-align: center;
`;
