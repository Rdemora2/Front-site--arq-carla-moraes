import React from "react";
import tw from "twin.macro";
import styled from "styled-components";
import { motion } from "framer-motion";
import { SectionHeading } from "components/misc/Headings.jsx";
import { Container, ContentWithPaddingXl } from "components/misc/Layouts.jsx";

const Row = tw.div`flex flex-col lg:flex-row -mb-10`;
const Heading = tw(SectionHeading)`text-left lg:text-4xl xl:text-5xl`;

const PopularPostsContainer = tw.div`lg:w-2/3`;
const PostsContainer = tw.div`mt-12 flex flex-col sm:flex-row sm:justify-between lg:justify-start`;
const Post = tw(
  motion.a
)`block sm:max-w-sm cursor-pointer mb-16 last:mb-0 sm:mb-0 sm:odd:mr-8 lg:mr-8 xl:mr-16`;
const Image = styled(motion.div)((props) => [
  `background-image: url("${props.$imageSrc}");`,
  tw`h-64 bg-cover bg-center rounded`,
]);
const Title = tw.h5`mt-6 text-xl font-bold transition duration-300 group-hover:text-primary-500`;
const Description = tw.p`mt-2 font-medium text-secondary-100 leading-loose text-sm`;
const AuthorInfo = tw.div`mt-6 flex items-center`;
const AuthorImage = tw.img`w-12 h-12 rounded-full`;
const AuthorNameAndProfession = tw.div`ml-4`;
const AuthorName = tw.h6`font-semibold text-lg`;
const AuthorProfile = tw.p`text-secondary-100 text-sm`;

const RecentPostsContainer = styled.div`
  ${tw`mt-24 lg:mt-0 lg:w-1/3`}
  ${PostsContainer} {
    ${tw`flex flex-wrap lg:flex-col`}
  }
  ${Post} {
    ${tw`flex justify-between mb-10 max-w-none w-full sm:w-1/2 lg:w-auto sm:odd:pr-12 lg:odd:pr-0 mr-0`}
  }
  ${Title} {
    ${tw`text-base xl:text-lg mt-0 mr-4 lg:max-w-xs`}
  }
  ${AuthorName} {
    ${tw`mt-3 text-sm text-secondary-100 font-normal leading-none`}
  }
  ${Image} {
    ${tw`h-20 w-20 flex-shrink-0`}
  }
`;
const PostTextContainer = tw.div``;

export default () => {
  const postBackgroundSizeAnimation = {
    rest: {
      backgroundSize: "100%",
    },
    hover: {
      backgroundSize: "110%",
    },
  };

  const popularPosts = [
    {
      postImageSrc:
        "https://images.unsplash.com/photo-1567948260357-4e6368dda6cc?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=768&q=60",
      authorImageSrc: "/logo/logo_reduced.webp",
      title: "Espécies Nativas: Valorizando Nossa Biodiversidade",
      description:
        "Descubra como a utilização de plantas nativas em projetos paisagísticos não apenas valoriza nossa rica biodiversidade, mas também reduz a manutenção e promove maior sustentabilidade nos jardins.",
      authorName: "Carla Moraes",
      authorProfile: "Arquiteta Paisagista",
      url: "https://carlamoraes.com.br/blog/especies-nativas",
    },
    {
      postImageSrc:
        "https://images.unsplash.com/photo-1546500840-ae38253aba9b?ixlib=rb-1.2.1&auto=format&fit=crop&w=640&q=80",
      authorImageSrc: "/logo/logo_reduced.webp",
      title: "Jardins Verticais: Soluções para Espaços Urbanos",
      description:
        "Transforme ambientes compactos com jardins verticais que trazem vida e frescor para residências e escritórios. Conheça as técnicas, espécies adequadas e sistemas de manutenção para estas soluções verdes.",
      authorName: "Paulo Santos",
      authorProfile: "Especialista em Biofilia",
      url: "https://carlamoraes.com.br/blog/jardins-verticais",
    },
  ];

  const recentPosts = [
    {
      postImageSrc:
        "https://images.unsplash.com/photo-1552083375-1447ce886485?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80",
      title: "Iluminação em Jardins: Criando Ambientes Mágicos",
      authorName: "Marina Costa",
      url: "https://carlamoraes.com.br/blog/iluminacao-jardins",
    },
    {
      postImageSrc:
        "https://images.unsplash.com/photo-1591857177580-dc82b9ac4e1e?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80",
      title: "Jardins Minimalistas: Menos é Mais",
      authorName: "Carla Moraes",
      url: "https://carlamoraes.com.br/blog/jardins-minimalistas",
    },
    {
      postImageSrc:
        "https://images.unsplash.com/photo-1558217374-d753966e28ed?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80",
      title: "Manutenção Sazonal: Cuidados ao Longo do Ano",
      authorName: "Roberto Alves",
      url: "https://carlamoraes.com.br/blog/manutencao-sazonal",
    },
    {
      postImageSrc:
        "https://images.unsplash.com/photo-1623241899289-e9a64cba3152?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80",
      title: "Jardins Comestíveis: Beleza e Funcionalidade",
      authorName: "Fernanda Lima",
      url: "https://carlamoraes.com.br/blog/jardins-comestiveis",
    },
    {
      postImageSrc:
        "https://images.unsplash.com/photo-1508233620467-f79f1e317a05?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80",
      title: "Água no Jardim: Espelhos, Fontes e Técnicas de Conservação",
      authorName: "Ricardo Monteiro",
      url: "https://carlamoraes.com.br/blog/agua-jardim",
    },
  ];

  return (
    <Container>
      <ContentWithPaddingXl>
        <Row>
          <PopularPostsContainer>
            <Heading>Conteúdos Populares</Heading>
            <PostsContainer>
              {popularPosts.map((post, index) => (
                <Post
                  key={index}
                  href={post.url}
                  className="group"
                  initial="rest"
                  whileHover="hover"
                  animate="rest"
                >
                  <Image
                    transition={{ duration: 0.3 }}
                    variants={postBackgroundSizeAnimation}
                    $imageSrc={post.postImageSrc}
                  />
                  <Title>{post.title}</Title>
                  <Description>{post.description}</Description>
                  <AuthorInfo>
                    <AuthorImage src={post.authorImageSrc} />
                    <AuthorNameAndProfession>
                      <AuthorName>{post.authorName}</AuthorName>
                      <AuthorProfile>{post.authorProfile}</AuthorProfile>
                    </AuthorNameAndProfession>
                  </AuthorInfo>
                </Post>
              ))}
            </PostsContainer>
          </PopularPostsContainer>
          <RecentPostsContainer>
            <Heading>Publicações Recentes</Heading>
            <PostsContainer>
              {recentPosts.map((post, index) => (
                <Post key={index} href={post.url} className="group">
                  <PostTextContainer>
                    <Title>{post.title}</Title>
                    <AuthorName>{post.authorName}</AuthorName>
                  </PostTextContainer>
                  <Image $imageSrc={post.postImageSrc} />
                </Post>
              ))}
            </PostsContainer>
          </RecentPostsContainer>
        </Row>
      </ContentWithPaddingXl>
    </Container>
  );
};
