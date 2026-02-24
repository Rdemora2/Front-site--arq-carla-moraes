import React from "react";
import PropTypes from "prop-types";
import { motion, AnimatePresence } from "framer-motion";
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
  }
`;

export const MobileNavLinksContainer = tw.nav`
  flex flex-1 items-center justify-between
`;

export const NavToggle = styled.button`
  ${tw`
    lg:hidden focus:outline-none transition duration-300
  `}
  z-index: 60;
  position: relative;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    color: var(--color-primary);
  }

  &:active {
    transform: scale(0.95);
  }

  &:focus-visible {
    box-shadow: 0 0 0 2px var(--color-secondary);
    outline: none;
  }
`;

/* Fullscreen mobile overlay */
const MobileNavOverlay = styled(motion.div)`
  position: fixed;
  inset: 0;
  z-index: 50;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(252, 250, 247, 0.97);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);

  ${NavLinks} {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0;
  }

  ${NavLink} {
    font-size: 1.25rem;
    font-weight: 600;
    letter-spacing: 0.05em;
    padding: 1rem 0;
    margin: 0;
    color: var(--color-primary-text);
    border-bottom: none;
    position: relative;

    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      width: 24px;
      height: 1px;
      background: var(--color-secondary);
      opacity: 0.4;
    }

    &:last-child::after {
      display: none;
    }
  }

  ${PrimaryLink} {
    margin-top: 1.5rem;
    padding: 0.875rem 2.5rem;
    font-size: 1rem;
    font-weight: 600;
    letter-spacing: 0.05em;
    border-radius: 6px;
    width: auto;
    min-width: 220px;
    text-align: center;
    display: inline-flex;
    align-items: center;
    justify-content: center;

    &::after {
      display: none;
    }
  }
`;

const MobileNavCloseButton = styled(motion.button)`
  position: absolute;
  top: 1.25rem;
  right: 1.25rem;
  z-index: 60;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-primary-text);
  background: transparent;
  border: none;
  cursor: pointer;

  &:hover {
    color: var(--color-primary);
  }
`;

export const DesktopNavLinks = tw.nav`
  hidden lg:flex flex-1 justify-between items-center
`;

/* Animation variants */
const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3, ease: "easeOut" } },
  exit: { opacity: 0, transition: { duration: 0.25, ease: "easeIn" } },
};

const navItemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.1 + i * 0.06, duration: 0.35, ease: "easeOut" },
  }),
  exit: { opacity: 0, y: -8, transition: { duration: 0.15 } },
};

const Header = ({
  roundedHeaderButton = false,
  logoLink,
  links,
  className,
  collapseBreakpointClass = "lg",
}) => {
  const defaultLinks = [
    <NavLinks key={1}>
      <NavLink href="/">Inicio</NavLink>
      <NavLink href="/sobre-nos">Sobre Nos</NavLink>
      <NavLink href="/projetos">Projetos</NavLink>
      <NavLink href="/contato">Contato</NavLink>
      <PrimaryLink
        css={roundedHeaderButton && tw`rounded-full`}
        href="/contato"
      >
        Solicitar Orcamento
      </PrimaryLink>
    </NavLinks>,
  ];

  const { showNavLinks, toggleNavbar, closeNavbar } = useAnimatedNavToggler();
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

  // Extract individual NavLink items for stagger animation
  const extractNavItems = (linksNode) => {
    if (!linksNode) return [];
    const items = [];
    React.Children.forEach(linksNode, (child) => {
      if (child?.props?.children) {
        React.Children.forEach(child.props.children, (navChild) => {
          items.push(navChild);
        });
      }
    });
    return items;
  };

  const navItems = extractNavItems(links);

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

        <AnimatePresence>
          {showNavLinks && (
            <MobileNavOverlay
              variants={overlayVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <MobileNavCloseButton
                onClick={closeNavbar}
                aria-label="Fechar menu"
                whileTap={{ scale: 0.9 }}
              >
                <CloseIcon size={24} />
              </MobileNavCloseButton>

              <nav>
                <NavLinks>
                  {navItems.map((item, i) => (
                    <motion.div
                      key={i}
                      custom={i}
                      variants={navItemVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      onClick={closeNavbar}
                    >
                      {item}
                    </motion.div>
                  ))}
                </NavLinks>
              </nav>
            </MobileNavOverlay>
          )}
        </AnimatePresence>

        <NavToggle
          onClick={toggleNavbar}
          className={showNavLinks ? "open" : "closed"}
          aria-label={showNavLinks ? "Fechar menu" : "Abrir menu"}
          aria-expanded={showNavLinks}
        >
          {showNavLinks ? (
            <CloseIcon size={24} />
          ) : (
            <MenuIcon size={24} />
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
