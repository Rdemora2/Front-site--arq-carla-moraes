import React from "react";
import PropTypes from "prop-types";
import { motion } from "framer-motion";
import tw from "twin.macro";
import styled from "styled-components";
import useAnimatedNavToggler from "../../helpers/useAnimatedNavToggler.jsx";
import { Menu as MenuIcon, X as CloseIcon } from "react-feather";
import OptimizedImage from "components/misc/OptimizedImage.jsx";

const HeaderContainer = tw.header`
  flex justify-between items-center
  max-w-screen-xl mx-auto
`;

export const NavLinks = tw.div`inline-block`;

export const NavLink = styled.a`
  ${tw`
    text-lg my-2 lg:text-sm lg:mx-6 lg:my-0
    font-semibold tracking-wide transition duration-300
    pb-1 border-b-2 border-transparent
  `}

  &:hover {
    color: var(--color-primary);
    border-bottom-color: var(--color-primary);
    text-shadow: 0 0 1px rgba(107, 121, 89, 0.3);
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
`;

export const PrimaryLink = styled(NavLink)`
  ${tw`
    lg:mx-0 px-8 py-3 rounded 
    text-gray-100 border-b-0
    transition-all duration-300
  `}
  background-color: var(--color-primary);
  position: relative;
  overflow: hidden;

  &:hover {
    background-color: var(--color-primary-text);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(62, 77, 44, 0.2);
    text-shadow: none;
    border-bottom-color: transparent;
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 1px 4px rgba(62, 77, 44, 0.2);
  }

  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.2),
      transparent
    );
    pointer-events: none;
    transition: transform 0.6s ease;
    z-index: 2;
    transform: translateX(-100%);
  }

  &:hover::after {
    transform: translateX(100%);
  }
`;

export const LogoLink = styled(NavLink)`
  ${tw`flex items-center font-black border-b-0 text-2xl! ml-0!`}

  img {
    ${tw`w-24 mr-3 lg:w-32`}
    transition: transform 0.3s ease;

    @media (max-width: 1024px) {
      width: 5.5rem;
      margin-right: 0;
    }
  }

  &:hover {
    @media (max-width: 1024px) {
      border-bottom-color: transparent;
      transform: none;
    }
  }
`;

export const MobileNavLinksContainer = tw.nav`
  flex flex-1 items-center justify-between
`;

export const NavToggle = styled.button`
  ${tw`
    lg:hidden z-20 focus:outline-none transition duration-300
  `}

  @media (max-width: 1024px) {
    width: 2.5rem;
    height: 2.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 0.5rem;
    color: var(--color-primary-text);
    background: transparent;

    svg {
      width: 1.25rem;
      height: 1.25rem;
      stroke-width: 2.5;
    }
  }

  &:hover {
    color: var(--color-primary);

    @media (max-width: 1024px) {
      background: rgba(107, 121, 89, 0.06);
      transform: none;
    }

    @media (min-width: 1025px) {
      transform: rotate(5deg) scale(1.1);
    }
  }

  &:active {
    transform: scale(0.95);
  }

  &:focus-visible {
    box-shadow: 0 0 0 2px var(--color-secondary);
    outline: none;
  }
`;

export const MobileNavLinks = motion(styled.div`
  ${tw`
    lg:hidden z-10 fixed top-0 inset-x-0 
    text-center text-gray-900
  `}
  background-color: var(--color-background);
  margin: 0;
  padding: 5.5rem 2rem 2.5rem;
  border: none;
  border-radius: 0;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  min-height: 100dvh;

  ${NavLinks} {
    ${tw`flex flex-col items-center`}
    gap: 0.25rem;
  }

  ${NavLink} {
    display: block;
    width: 100%;
    padding: 1rem 0;
    font-size: 1.125rem;
    font-weight: 500;
    letter-spacing: 0.01em;
    color: var(--color-primary-text);
    border-bottom: 1px solid rgba(107, 121, 89, 0.08);
    transition: color 0.2s ease;

    &:hover, &:active {
      color: var(--color-primary);
      transform: none;
      border-bottom-color: var(--color-primary);
    }
  }

  ${PrimaryLink} {
    margin-top: 1.5rem;
    display: inline-block;
    width: auto;
    padding: 0.875rem 2rem;
    font-size: 0.875rem;
    font-weight: 600;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    border-radius: 0.5rem;
    background-color: var(--color-primary-text);
    color: var(--color-background);
    border: none;
    border-bottom: none;

    &:hover {
      background-color: var(--color-primary);
      border-bottom-color: transparent;
    }
  }
`);

export const DesktopNavLinks = tw.nav`
  hidden lg:flex flex-1 justify-between items-center
`;

const Header = ({
  roundedHeaderButton = false,
  logoLink,
  links,
  className,
  collapseBreakpointClass = "lg",
}) => {
  const defaultLinks = [
    <NavLinks key={1}>
      <NavLink href="/">Início</NavLink>
      <NavLink href="/sobre-nos">Sobre Nós</NavLink>
      <NavLink href="/projetos">Projetos</NavLink>
      <NavLink href="/contato">Contato</NavLink>
      <PrimaryLink
        css={roundedHeaderButton && tw`rounded-full`}
        href="/contato"
      >
        Solicitar Orçamento
      </PrimaryLink>
    </NavLinks>,
  ];

  const { showNavLinks, animation, toggleNavbar } = useAnimatedNavToggler();
  const collapseBreakpointCss =
    collapseBreakPointCssMap[collapseBreakpointClass];

  const defaultLogoLink = (
    <LogoLink href="/">
      <OptimizedImage
        src="/images/logo/logo_full.webp"
        alt="logo"
        priority={true}
        sizes="128px"
        width={128}
        height={75}
      />
    </LogoLink>
  );

  logoLink = logoLink || defaultLogoLink;
  links = links || defaultLinks;

  return (
    <HeaderContainer className={className || "header-light"}>
      <DesktopNavLinks css={collapseBreakpointCss.desktopNavLinks}>
        {logoLink}
        {links}
      </DesktopNavLinks>

      <MobileNavLinksContainer
        css={collapseBreakpointCss.mobileNavLinksContainer}
      >
        {logoLink}
        <MobileNavLinks
          initial={{ x: "150%", display: "none" }}
          animate={animation}
          css={collapseBreakpointCss.mobileNavLinks}
        >
          {links}
        </MobileNavLinks>
        <NavToggle
          onClick={toggleNavbar}
          className={showNavLinks ? "open" : "closed"}
          aria-label={showNavLinks ? "Fechar menu" : "Abrir menu"}
          aria-expanded={showNavLinks}
        >
          {showNavLinks ? (
            <CloseIcon tw="w-6 h-6" />
          ) : (
            <MenuIcon tw="w-6 h-6" />
          )}
        </NavToggle>
      </MobileNavLinksContainer>
    </HeaderContainer>
  );
};

Header.propTypes = {
  roundedHeaderButton: PropTypes.bool,
  logoLink: PropTypes.node,
  links: PropTypes.node,
  className: PropTypes.string,
  collapseBreakpointClass: PropTypes.string,
};

export default Header;

const collapseBreakPointCssMap = {
  sm: {
    mobileNavLinks: tw`sm:hidden`,
    desktopNavLinks: tw`sm:flex`,
    mobileNavLinksContainer: tw`sm:hidden`,
  },
  md: {
    mobileNavLinks: tw`md:hidden`,
    desktopNavLinks: tw`md:flex`,
    mobileNavLinksContainer: tw`md:hidden`,
  },
  lg: {
    mobileNavLinks: tw`lg:hidden`,
    desktopNavLinks: tw`lg:flex`,
    mobileNavLinksContainer: tw`lg:hidden`,
  },
  xl: {
    mobileNavLinks: tw`lg:hidden`,
    desktopNavLinks: tw`lg:flex`,
    mobileNavLinksContainer: tw`lg:hidden`,
  },
};
