import React from "react";
import tw from "twin.macro";
import styled from "styled-components";

import FacebookIcon from "../assets/icons/svg/facebook-icon.svg";
import TwitterIcon from "../assets/icons/svg/twitter-icon.svg";
import YoutubeIcon from "../assets/icons/svg/youtube-icon.svg";

const LogoImage = "/images/logo/logo_reduced.webp";

const Container = tw.div`relative bg-gray-200 -mx-8 -mb-8 px-8`;
const FiveColumns = tw.div`max-w-screen-xl mx-auto py-16 lg:py-20 flex flex-wrap justify-between`;

const Column = tw.div`md:w-1/5`;
const WideColumn = tw(
  Column
)`text-center md:text-left w-full md:w-2/5 mb-10 md:mb-0`;

const ColumnHeading = tw.h5`font-bold`;

const LinkList = tw.ul`mt-4 text-sm font-medium`;
const LinkListItem = tw.li`mt-3`;
const Link = tw.a`border-b-2 border-transparent hocus:text-primary-500 hocus:border-primary-500 pb-1 transition duration-300`;

const LogoContainer = tw.div`flex items-center justify-center md:justify-start`;
const LogoImg = tw.img`w-8`;
const LogoText = tw.h5`ml-2 text-xl font-black text-primary-500`;

const CompanyDescription = tw.p`mt-4 max-w-xs font-medium text-sm mx-auto md:mx-0 md:mr-4 `;

const SocialLinksContainer = tw.div`mt-4 `;
const SocialLink = styled.a`
  ${tw`cursor-pointer inline-block p-2 rounded-full bg-gray-700 text-gray-100 hover:bg-gray-900 transition duration-300 mr-4`}
  svg {
    ${tw`w-4 h-4`}
  }
`;

export default () => {
  return (
    <Container>
      <FiveColumns>
        <WideColumn>
          <LogoContainer>
            <LogoImg src={LogoImage} />
            <LogoText>Carla Moraes Arquitetura paisagística Inc.</LogoText>
          </LogoContainer>
          <CompanyDescription>
            Carla Moraes Arquitetura paisagística is an Internet Technology
            company providing design resources such as website templates and
            themes.
          </CompanyDescription>
          <SocialLinksContainer>
            <SocialLink href="https://facebook.com">
              <a
                href="https://facebook.com/carlamoraespaisagismo"
                className="SocialLink-byuJtI"
                aria-label="Visite nossa página no Facebook"
              >
                <FacebookIcon />
              </a>
            </SocialLink>
            <SocialLink href="https://twitter.com">
              <a
                href="https://instagram.com/carlamoraespaisagismo"
                className="SocialLink-byuJtI"
                aria-label="Siga-nos no Instagram"
              >
                <TwitterIcon />
              </a>
            </SocialLink>
            <SocialLink href="https://youtube.com">
              <a
                href="https://linkedin.com/in/carlamoraespaisagismo"
                className="SocialLink-byuJtI"
                aria-label="Conecte-se conosco no LinkedIn"
              >
                <YoutubeIcon />
              </a>
            </SocialLink>
          </SocialLinksContainer>
        </WideColumn>
        <Column>
          <ColumnHeading>Quick Links</ColumnHeading>
          <LinkList>
            <LinkListItem>
              <Link href="#">Blog</Link>
            </LinkListItem>
            <LinkListItem>
              <Link href="#">FAQs</Link>
            </LinkListItem>
            <LinkListItem>
              <Link href="#">Support</Link>
            </LinkListItem>
            <LinkListItem>
              <Link href="#">About Us</Link>
            </LinkListItem>
          </LinkList>
        </Column>
        <Column>
          <ColumnHeading>Product</ColumnHeading>
          <LinkList>
            <LinkListItem>
              <Link href="#">Log In</Link>
            </LinkListItem>
            <LinkListItem>
              <Link href="#">Personal</Link>
            </LinkListItem>
            <LinkListItem>
              <Link href="#">Business</Link>
            </LinkListItem>
            <LinkListItem>
              <Link href="#">Team</Link>
            </LinkListItem>
          </LinkList>
        </Column>
        <Column>
          <ColumnHeading>Legal</ColumnHeading>
          <LinkList>
            <LinkListItem>
              <Link href="#">GDPR</Link>
            </LinkListItem>
            <LinkListItem>
              <Link href="#">Privacy Policy</Link>
            </LinkListItem>
            <LinkListItem>
              <Link href="#">Terms of Service</Link>
            </LinkListItem>
            <LinkListItem>
              <Link href="#">Disclaimer</Link>
            </LinkListItem>
          </LinkList>
        </Column>
      </FiveColumns>
    </Container>
  );
};
