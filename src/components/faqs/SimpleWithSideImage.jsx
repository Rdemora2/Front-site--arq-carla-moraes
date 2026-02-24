import React, { useState, useCallback, memo, useEffect } from "react";
import PropTypes from "prop-types";
import { motion } from "framer-motion";
import tw from "twin.macro";
import styled from "styled-components";
import {
  SectionHeading,
  Subheading as SubheadingBase,
} from "components/misc/Headings.jsx";
import { Plus as PlusIcon, Minus as MinusIcon } from "react-feather";

const Container = tw.div`relative`;
const Content = styled.div`
  ${tw`max-w-screen-xl mx-auto py-16 lg:py-20`}

  @media (max-width: 1023px) {
    padding: 2.5rem 1rem;
  }
`;

const TwoColumn = tw.div`flex`;
const Column = tw.div``;

const FAQContent = tw.div`lg:ml-12`;
const Subheading = tw(
  SubheadingBase
)`mb-4 text-center lg:text-left text-sm md:text-sm lg:text-base`;
const Heading = tw(
  SectionHeading
)`lg:text-left text-2xl sm:text-3xl lg:text-4xl`;
const Description = styled.p`
  ${tw`max-w-xl text-center mx-auto lg:mx-0 lg:text-left lg:max-w-none leading-relaxed text-sm md:text-sm lg:text-base font-medium mt-4 text-secondary-100`}

  @media (max-width: 639px) {
    font-size: 0.875rem;
    line-height: 1.6;
  }
`;

const FAQSContainer = styled.dl`
  ${tw`mt-12`}

  @media (max-width: 1023px) {
    margin-top: 1.5rem;
  }
`;
const FAQItem = styled.div`
  ${tw`cursor-pointer mt-8 select-none border lg:border-0 px-8 py-4 lg:p-0 rounded-lg lg:rounded-none`}

  @media (max-width: 1023px) {
    margin-top: 0;
    padding: 1rem 0;
    border: none;
    border-bottom: 1px solid rgba(0, 0, 0, 0.06);
    border-radius: 0;
  }
`;
const Question = tw.dt`flex justify-between items-center`;
const QuestionText = styled.span`
  ${tw`text-base lg:text-lg font-semibold`}

  @media (max-width: 639px) {
    font-size: 0.9375rem;
    line-height: 1.4;
    padding-right: 0.5rem;
  }
`;
const QuestionToggleIcon = styled.span`
  ${tw`ml-2 bg-primary-500 text-gray-100 p-1 rounded-full group-hover:bg-primary-700 group-hover:text-gray-200 transition duration-300`}
  flex-shrink: 0;
  svg {
    ${tw`w-4 h-4`}
  }

  @media (max-width: 1023px) {
    width: 28px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;
const AnswerBase = styled.dd`
  ${tw`pointer-events-none text-sm sm:text-base leading-relaxed`}

  @media (max-width: 639px) {
    font-size: 0.8125rem;
    line-height: 1.65;
  }
`;
const Answer = motion(AnswerBase);

const SimpleWithSideImage = ({
  subheading = "Tire suas dúvidas",
  heading = "Perguntas Frequentes",
  description = "Entenda melhor sobre nosso processo de trabalho e como podemos ajudar a transformar seu espaço com um projeto paisagístico exclusivo.",
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

  const toggleQuestion = useCallback((questionIndex) => {
    setActiveQuestionIndex((prevIndex) =>
      prevIndex === questionIndex ? null : questionIndex
    );
  }, []);

  useEffect(() => {
    if (!faqs || faqs.length === 0) return;

    const faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: faq.answer,
        },
      })),
    };

    const scriptTag = document.createElement("script");
    scriptTag.type = "application/ld+json";
    scriptTag.id = "faq-schema";
    scriptTag.text = JSON.stringify(faqSchema);

    const existingScript = document.getElementById("faq-schema");
    if (existingScript) {
      existingScript.remove();
    }

    document.head.appendChild(scriptTag);

    return () => {
      const script = document.getElementById("faq-schema");
      if (script) {
        script.remove();
      }
    };
  }, [faqs]);

  return (
    <Container>
      <Content>
        <Column>
          <FAQContent>
            {subheading ? <Subheading>{subheading}</Subheading> : null}
            <Heading>{heading}</Heading>
            <Description>{description}</Description>
            <FAQSContainer>
              {faqs &&
                faqs.map((faq, index) => (
                  <FAQItem
                    key={`faq-${faq.question.slice(0, 20).replace(/\s+/g, "-").toLowerCase()}`}
                    onClick={() => toggleQuestion(index)}
                    className="group"
                    role="button"
                    aria-expanded={activeQuestionIndex === index}
                    aria-controls={`faq-answer-${index}`}
                  >
                    <Question>
                      <QuestionText>{faq.question}</QuestionText>
                      <QuestionToggleIcon aria-hidden="true">
                        {activeQuestionIndex === index ? (
                          <MinusIcon />
                        ) : (
                          <PlusIcon />
                        )}
                      </QuestionToggleIcon>
                    </Question>
                    <Answer
                      id={`faq-answer-${index}`}
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
                  </FAQItem>
                ))}
            </FAQSContainer>
          </FAQContent>
        </Column>
      </Content>
    </Container>
  );
};

SimpleWithSideImage.propTypes = {
  subheading: PropTypes.string,
  heading: PropTypes.string,
  description: PropTypes.string,
  imageSrc: PropTypes.string,
  imageContain: PropTypes.bool,
  imageShadow: PropTypes.bool,
  faqs: PropTypes.arrayOf(
    PropTypes.shape({
      question: PropTypes.string.isRequired,
      answer: PropTypes.string.isRequired,
    })
  ),
};

export default memo(SimpleWithSideImage);
