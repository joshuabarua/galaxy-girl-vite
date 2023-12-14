import React from 'react'
import { FaFacebook, FaInstagram } from 'react-icons/fa';
import { FooterContainer, FooterWrapper, FooterLinksContainer, FooterLinksWrap, FooterLinkItems, FooterLinkTitle, FooterLink, SocialMedia, SocialMediaWrap, SocialLogo, WebsiteRights, SocialIcons, JB, FooterSocialLink, SocialIconLinkFb, SocialIconLinkInsta } from './footerElements';
import logoImg from "../../assets/GalaxyGirlLogo.png"

const Footer = () => {
    return (
        <FooterContainer>
            <FooterWrapper>
                <FooterLinksContainer>
                    <FooterLinksWrap>
                        <FooterLinkItems>
                            <FooterLinkTitle> About </FooterLinkTitle>
                            <FooterLink to="/resume"> Resume </FooterLink>
                            <FooterLink to="/"> Testimonials </FooterLink>
                            <FooterLink to="/"> Terms of Service </FooterLink>
                        </FooterLinkItems>
                    </FooterLinksWrap>
                    
                    <FooterLinksWrap>
                        <FooterLinkItems>
                                <FooterLinkTitle> Contact Us </FooterLinkTitle>
                                <FooterLink to="/Contact"> Contact </FooterLink>
                            </FooterLinkItems>
                    </FooterLinksWrap>

                    <FooterLinksWrap>
                        <FooterLinkItems>
                                <FooterLinkTitle> Portfolio </FooterLinkTitle>
                                <FooterLink to="/portfolio"> Gallery </FooterLink>
                                <FooterSocialLink href="https://www.imdb.com/name/nm9151229/" target="_blank" rel="noreferrer"> IMDB </FooterSocialLink>
                            </FooterLinkItems>
                    </FooterLinksWrap>
                    
                    <FooterLinksWrap>
                        <FooterLinkItems>
                            <FooterLinkTitle> Social Media </FooterLinkTitle>
                            <FooterSocialLink href="https://www.facebook.com/thegalaxygirl" target="_blank" rel="noreferrer"> Facebook </FooterSocialLink>
                            <FooterSocialLink href="https://www.instagram.com/emmathegalaxygirl/" target="_blank" rel="noreferrer"> Instagram </FooterSocialLink>
                            <FooterSocialLink href="https://twitter.com/thegalaxygirlhd" target="_blank" rel="noreferrer" > Twitter </FooterSocialLink>
                            
                        </FooterLinkItems>
                    </FooterLinksWrap>
                </FooterLinksContainer>

                <SocialMedia>
                    <SocialMediaWrap>
                        <SocialLogo to="/">
                            <img src={logoImg} alt="" /> 
                        </SocialLogo>
                        <WebsiteRights>

                           The Galaxy Girl MUA  © {new Date().getFullYear() } All rights reserved. Created with &#9829; by <JB href="https://www.linkedin.com/in/joshua-barua-82446a96/" target="_blank"> Joshua Barua </JB>
                        </WebsiteRights>
                        <SocialIcons>
                            <SocialIconLinkFb href="https://www.facebook.com/thegalaxygirl" target="_blank" aria-label="Facebook"> 
                                <FaFacebook /> 
                            </SocialIconLinkFb>
                            <SocialIconLinkInsta href="https://www.instagram.com/emmathegalaxygirl/" target="_blank" aria-label="Instagram"> 
                                <FaInstagram /> 
                            </SocialIconLinkInsta>
                        </SocialIcons>                    
                    </SocialMediaWrap>
                </SocialMedia>
            </FooterWrapper>
            
        </FooterContainer>
    )
}

export default Footer
