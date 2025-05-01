import React, { useState } from "react";
import { motion } from "framer-motion";
import tw from "twin.macro";
import styled from "styled-components";
import {
  SectionHeading,
  Subheading as SubheadingBase,
} from "components/misc/Headings.jsx";
import { Plus as PlusIcon, Minus as MinusIcon } from "react-feather";

const Container = tw.div`relative`;
const Content = tw.div`max-w-screen-xl mx-auto py-16 lg:py-20`;

const TwoColumn = tw.div`flex`;
const Column = tw.div``;

const Image = styled.div(({ $imageSrc, $imageContain, $imageShadow }) => [
  `background-image: url("${$imageSrc}");`,
  $imageContain ? tw`bg-contain bg-no-repeat` : tw`bg-cover`,
  $imageShadow ? tw`shadow` : tw`shadow-none`,
  tw`hidden lg:block rounded h-144 bg-center`,
]);

const FAQContent = tw.div`lg:ml-12`;
const Subheading = tw(SubheadingBase)`mb-4 text-center lg:text-left`;
const Heading = tw(SectionHeading)`lg:text-left`;
const Description = tw.p`max-w-xl text-center mx-auto lg:mx-0 lg:text-left lg:max-w-none leading-relaxed text-sm sm:text-base lg:text-lg font-medium mt-4 text-secondary-100`;

const FAQSContainer = tw.dl`mt-12`;
const FAQ = tw.div`cursor-pointer mt-8 select-none border lg:border-0 px-8 py-4 lg:p-0 rounded-lg lg:rounded-none`;
const Question = tw.dt`flex justify-between items-center`;
const QuestionText = tw.span`text-lg lg:text-xl font-semibold`;
const QuestionToggleIcon = styled.span`
  ${tw`ml-2 bg-primary-500 text-gray-100 p-1 rounded-full group-hover:bg-primary-700 group-hover:text-gray-200 transition duration-300`}
  svg {
    ${tw`w-4 h-4`}
  }
`;
const Answer = motion(
  tw.dd`pointer-events-none text-sm sm:text-base leading-relaxed`
);

export default ({
  subheading = "Tire suas dúvidas",
  heading = "Perguntas Frequentes",
  description = "Entenda melhor sobre nosso processo de trabalho e como podemos ajudar a transformar seu espaço com um projeto paisagístico exclusivo.",
  imageSrc = "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1024&q=80",
  imageContain = false,
  imageShadow = true,
  faqs = [
    {
      question:
        "Como funciona o processo de desenvolvimento de um projeto paisagístico?",
      answer:
        "Nosso processo começa com uma visita técnica ao local e reunião com o cliente para entender suas necessidades e desejos. A partir daí, desenvolvemos um estudo preliminar, seguido pelo anteprojeto e projeto executivo, que inclui especificações detalhadas de materiais e espécies vegetais. Após aprovação, podemos acompanhar a execução para garantir a fidelidade ao projeto.",
    },
    {
      question: "Quanto tempo leva para desenvolver um projeto completo?",
      answer:
        "O tempo varia de acordo com a complexidade e tamanho da área. Um projeto residencial típico pode levar de 30 a 60 dias entre as fases de estudo, desenvolvimento e detalhamento. Projetos maiores ou corporativos podem exigir mais tempo para planejamento adequado.",
    },
    {
      question:
        "Vocês trabalham apenas com projetos ou também realizam a execução?",
      answer:
        "Somos especializados no desenvolvimento de projetos paisagísticos, mas oferecemos o serviço de acompanhamento de obra para garantir que a execução seja fiel ao projeto. Trabalhamos com parceiros de confiança para a implementação, formando uma equipe integrada para o sucesso do projeto.",
    },
    {
      question: "Como são escolhidas as espécies vegetais para cada projeto?",
      answer:
        "A seleção de plantas considera diversos fatores: condições climáticas, exposição solar, tipo de solo, disponibilidade de água, estilo do projeto, necessidades de manutenção e, é claro, as preferências dos clientes. Priorizamos espécies adaptadas ao local para garantir longevidade e reduzir manutenção.",
    },
    {
      question: "Vocês desenvolvem projetos para pequenos espaços?",
      answer:
        "Sim, trabalhamos com espaços de todos os tamanhos. Pequenos jardins, varandas e terraços podem se transformar em ambientes extraordinários com planejamento adequado. Cada centímetro é valorizado para criar um espaço funcional e esteticamente harmônico.",
    },
    {
      question: "O projeto inclui sistema de irrigação e iluminação?",
      answer:
        "Sim, nossos projetos executivos podem incluir os detalhamentos técnicos de sistemas de irrigação e iluminação paisagística. Trabalhamos em parceria com especialistas dessas áreas para garantir soluções eficientes e adequadas às necessidades de cada ambiente.",
    },
  ],
}) => {
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(null);

  const toggleQuestion = (questionIndex) => {
    if (activeQuestionIndex === questionIndex) setActiveQuestionIndex(null);
    else setActiveQuestionIndex(questionIndex);
  };

  return (
    <Container>
      <Content>
        <TwoColumn>
          <Column>
            <FAQContent>
              {subheading ? <Subheading>{subheading}</Subheading> : null}
              <Heading>{heading}</Heading>
              <Description>{description}</Description>
              <FAQSContainer>
                {faqs &&
                  faqs.map((faq, index) => (
                    <FAQ
                      key={index}
                      onClick={() => {
                        toggleQuestion(index);
                      }}
                      className="group"
                    >
                      <Question>
                        <QuestionText>{faq.question}</QuestionText>
                        <QuestionToggleIcon>
                          {activeQuestionIndex === index ? (
                            <MinusIcon />
                          ) : (
                            <PlusIcon />
                          )}
                        </QuestionToggleIcon>
                      </Question>
                      <Answer
                        variants={{
                          open: {
                            opacity: 1,
                            height: "auto",
                            marginTop: "16px",
                          },
                          collapsed: {
                            opacity: 0,
                            height: 0,
                            marginTop: "0px",
                          },
                        }}
                        initial="collapsed"
                        animate={
                          activeQuestionIndex === index ? "open" : "collapsed"
                        }
                        transition={{
                          duration: 0.3,
                          ease: [0.04, 0.62, 0.23, 0.98],
                        }}
                      >
                        {faq.answer}
                      </Answer>
                    </FAQ>
                  ))}
              </FAQSContainer>
            </FAQContent>
          </Column>
          <Column>
            <Image
              $imageSrc={imageSrc}
              $imageContain={imageContain}
              $imageShadow={imageShadow}
            />
          </Column>
        </TwoColumn>
      </Content>
    </Container>
  );
};
