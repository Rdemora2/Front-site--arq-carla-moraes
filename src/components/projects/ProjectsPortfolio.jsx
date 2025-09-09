import React, { useState, useCallback, memo, useMemo } from "react";
import PropTypes from "prop-types";
import tw from "twin.macro";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { SectionHeading } from "components/misc/Headings";
import { PrimaryButton as PrimaryButtonBase } from "components/misc/Buttons";
import {
  MapPin as LocationIcon,
  Calendar as CalendarIcon,
  User as ClientTypeIcon,
  Image as GalleryIcon,
  X as CloseIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
} from "react-feather";

const Container = tw.div`relative py-16 lg:py-24`;
const ContentWithPaddingXl = tw.div`max-w-screen-xl mx-auto px-4 lg:px-8`;

const HeaderContainer = tw.div`text-center mb-16`;
const SubheadingStyled = tw.div`text-center text-green-600 mb-4 text-sm uppercase tracking-widest font-bold`;
const Heading = tw(SectionHeading)`text-center text-gray-800`;
const Description = tw.p`text-center max-w-4xl mx-auto mt-6 text-gray-700 leading-relaxed text-lg`;

const ProjectsGrid = tw.div`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16`;

const ProjectCard = styled(motion.div)`
  ${tw`bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer border border-gray-100`}

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 20px 40px rgba(107, 121, 89, 0.15);
  }
`;
const ProjectImageContainer = styled.div`
  ${tw`relative overflow-hidden`}
  height: 16rem;
`;
const ProjectImage = styled.img`
  ${tw`w-full h-full object-cover transition-transform duration-300`}

  ${ProjectCard}:hover & {
    transform: scale(1.05);
  }
`;

const ClientTypeBadge = styled.div`
  ${tw`absolute top-0 left-0 m-4 px-3 py-1 rounded-full text-xs font-bold text-white`}
  background-color: ${(props) =>
    props.clientType === "residencial" ? "#6b7959" : "#a99960"};
`;

const ProjectInfo = tw.div`p-6`;
const ProjectTitle = tw.h3`text-xl font-bold text-gray-800 mb-3`;
const ProjectDescription = tw.p`text-gray-600 text-sm leading-relaxed mb-6 line-clamp-3`;

const ProjectDetails = tw.div`flex flex-wrap gap-4 text-xs text-gray-500 mb-4`;
const DetailItem = tw.div`flex items-center`;
const DetailIcon = tw.div`mr-2 text-green-600`;

const ViewProjectButton = styled(PrimaryButtonBase)`
  ${tw`w-full mt-4 text-sm transition-colors duration-300`}
  background-color: #6b7959;

  &:hover {
    background-color: #3e4d2c;
  }
`;

// Modal de galeria
const ModalOverlay = styled(motion.div)`
  ${tw`fixed inset-0 bg-black flex items-center justify-center p-4`}
  background-color: rgba(0, 0, 0, 0.8);
  z-index: 9999;
`;

const ModalContent = styled(motion.div)`
  ${tw`bg-white rounded-lg max-w-6xl w-full max-h-full overflow-hidden`}
`;

const ModalHeader = tw.div`flex justify-between items-center p-6 border-b`;
const ModalTitle = tw.h2`text-2xl font-bold text-gray-800`;
const CloseButton = tw.button`p-2 hover:bg-gray-100 rounded-full transition-colors`;

const ModalBody = tw.div`p-6 max-h-screen overflow-y-auto`;
const ProjectDetailsFull = tw.div`mb-6`;
const ProjectDescriptionFull = tw.p`text-gray-700 leading-relaxed mb-4`;
const ProjectMetadata = tw.div`grid grid-cols-1 md:grid-cols-3 gap-4 mb-6`;
const MetadataItem = tw.div`flex items-center text-sm text-gray-600`;
const MetadataIcon = tw.div`mr-2 text-green-600`;

const GalleryContainer = tw.div`mt-6`;
const GalleryTitle = tw.h3`text-lg font-bold text-gray-800 mb-4`;
const GalleryGrid = tw.div`grid grid-cols-2 md:grid-cols-3 gap-4`;
const GalleryImage = styled.img`
  ${tw`w-full object-cover rounded-lg cursor-pointer hover:opacity-75 transition-opacity`}
  height: 8rem;
`;

// Componente de visualização de imagem em tela cheia
const ImageViewer = styled(motion.div)`
  ${tw`fixed inset-0 bg-black flex items-center justify-center p-4`}
  background-color: rgba(0, 0, 0, 0.9);
  z-index: 10000;
`;

const ImageViewerContent = tw.div`relative max-w-full max-h-full`;
const ImageViewerImage = tw.img`max-w-full max-h-full object-contain`;
const ImageViewerControls = tw.div`absolute top-0 right-0 m-4 flex gap-2`;
const ControlButton = styled.button`
  ${tw`p-2 bg-white rounded-full text-white transition-all hover:bg-gray-200`}
  background-color: rgba(255, 255, 255, 0.2);

  &:hover {
    background-color: rgba(255, 255, 255, 0.3);
  }
`;

const projectsData = [
  {
    id: 1,
    title: "Jardim Francês Clássico - Alphaville",
    description:
      "Projeto paisagístico residencial premium inspirado nos jardins franceses de Versalhes. Topiarias elaboradas, espelhos d'água e design geométrico sofisticado.",
    clientType: "residencial",
    location: "Alphaville, SP",
    year: "2023",
    area: "480 m²",
    featuredImage: "/images/projects/Jardim-frances/frances-hero.webp",
    gallery: [
      "/images/projects/Jardim-frances/frances-1.webp",
      "/images/projects/Jardim-frances/frances-2.webp",
      "/images/projects/Jardim-frances/frances-3.webp",
      "/images/projects/Jardim-frances/frances-4.webp",
      "/images/projects/Jardim-frances/frances-5.webp",
      "/images/projects/Jardim-frances/frances-6.webp",
    ],
    fullDescription:
      "Este projeto residencial de alto padrão foi inspirado nos jardins franceses clássicos de Versalhes, cuidadosamente adaptados ao clima tropical brasileiro. O paisagismo inclui topiarias artesanais em buxo, espelhos d'água simétricos que refletem o céu e um parterre central com flores sazonais que proporcionam cor durante todo o ano. As áreas de estar foram estrategicamente integradas ao jardim formal, criando múltiplos ambientes de contemplação e convivência social que valorizam cada momento ao ar livre.",
  },
  {
    id: 2,
    title: "Design Biofílico Corporativo - Vila Olímpia",
    description:
      "Ambiente corporativo sustentável com jardins verticais, espécies nativas da Mata Atlântica e sistema inteligente de irrigação para bem-estar dos colaboradores.",
    clientType: "corporativo",
    location: "Vila Olímpia, SP",
    year: "2023",
    area: "650 m²",
    featuredImage: "/images/projects/Jardim-tropical/tropical-hero.webp",
    gallery: [
      "/images/projects/Jardim-tropical/tropical-1.webp",
      "/images/projects/Jardim-tropical/tropical-2.webp",
      "/images/projects/Jardim-tropical/tropical-3.webp",
      "/images/projects/Jardim-tropical/tropical-4.webp",
    ],
    fullDescription:
      "Desenvolvido para uma multinacional de tecnologia, este projeto integra conceitos de design biofílico ao ambiente corporativo. Utilizamos espécies nativas da Mata Atlântica, sistema de captação de água da chuva e áreas de contemplação que promovem o bem-estar dos colaboradores. Os jardins verticais internos conectam os espaços de trabalho com a natureza.",
  },
  {
    id: 3,
    title: "Casa de Campo Moderna",
    description:
      "Paisagismo rural contemporâneo integrando vegetação nativa e áreas de lazer familiares.",
    clientType: "residencial",
    location: "Itatiba, SP",
    year: "2022",
    area: "1.200 m²",
    featuredImage:
      "https://images.unsplash.com/photo-1587502537104-aac10f5fb6f7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1024&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1587502537104-aac10f5fb6f7?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      "https://images.unsplash.com/photo-1588557132645-ff567110cafd?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
    ],
    fullDescription:
      "Esta residência de campo recebeu um projeto que valoriza a vegetação existente e integra novas espécies nativas. O desenho paisagístico inclui trilhas ecológicas, horta orgânica, pomar e áreas de estar que aproveitam as visuais naturais da propriedade. A sustentabilidade foi priorizada com compostagem, reuso de água e energia solar.",
  },
  {
    id: 4,
    title: "Terraço Urbano Premium",
    description:
      "Transformação de cobertura em oásis urbano com jardins suspensos e área gourmet integrada.",
    clientType: "residencial",
    location: "Jardins, SP",
    year: "2023",
    area: "120 m²",
    featuredImage:
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-1.2.1&auto=format&fit=crop&w=1024&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      "https://images.unsplash.com/photo-1588557132645-ff567110cafd?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
    ],
    fullDescription:
      "Este terraço no bairro dos Jardins foi transformado em um refúgio urbano sofisticado. O projeto inclui jardins verticais, deck em madeira de demolição, área gourmet coberta e sistema de irrigação automatizado. A escolha de plantas resistentes ao vento e baixa manutenção garantiu a viabilidade do projeto em altura.",
  },
  {
    id: 5,
    title: "Condomínio Eco Village",
    description:
      "Projeto de áreas comuns com foco em sustentabilidade e interação social entre moradores.",
    clientType: "corporativo",
    location: "Cotia, SP",
    year: "2022",
    area: "2.500 m²",
    featuredImage:
      "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1024&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      "https://images.unsplash.com/photo-1588557132645-ff567110cafd?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      "https://images.unsplash.com/photo-1587502537104-aac10f5fb6f7?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
    ],
    fullDescription:
      "As áreas comuns deste condomínio residencial foram projetadas para promover a sustentabilidade e o convívio social. Inclui horta comunitária, playground natural, trilha ecológica e áreas de convivência com pergolados verdes. O sistema de drenagem sustentável e a compostagem coletiva completam o conceito eco-friendly.",
  },
  {
    id: 6,
    title: "Hotel Boutique Garden",
    description:
      "Jardins temáticos para hotel boutique com ambientes únicos para cada área do empreendimento.",
    clientType: "corporativo",
    location: "Campos do Jordão, SP",
    year: "2021",
    area: "800 m²",
    featuredImage:
      "https://images.unsplash.com/photo-1588557132645-ff567110cafd?ixlib=rb-1.2.1&auto=format&fit=crop&w=1024&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1588557132645-ff567110cafd?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
    ],
    fullDescription:
      "Este hotel boutique em Campos do Jordão recebeu jardins temáticos únicos para cada área: entrada com jardim zen, restaurante com horta orgânica, spa com jardim sensorial e suítes com varandas jardim privativas. A escolha de espécies adaptadas ao clima de montanha e o design contemporâneo criaram uma experiência única para os hóspedes.",
  },
];

const ProjectsPortfolio = ({
  subheading = "Portfólio Exclusivo",
  heading = "Projetos Paisagísticos que Transformam Espaços",
  description = "Mais de 25 anos criando jardins únicos que harmonizam arquitetura e natureza. Cada projeto reflete nossa expertise em paisagismo sustentável, desde residências de alto padrão até ambientes corporativos inovadores. Descubra como podemos transformar seu espaço.",
  currentFilter = "todos",
}) => {
  const [selectedProject, setSelectedProject] = useState(null);
  const [viewingImage, setViewingImage] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const filteredProjects = useMemo(() => {
    return projectsData.filter(
      (project) =>
        currentFilter === "todos" || project.clientType === currentFilter
    );
  }, [currentFilter]);

  const openProjectModal = useCallback((project) => {
    setSelectedProject(project);
  }, []);

  const closeProjectModal = useCallback(() => {
    setSelectedProject(null);
    setViewingImage(null);
  }, []);

  const openImageViewer = useCallback((imageSrc, index) => {
    setViewingImage(imageSrc);
    setCurrentImageIndex(index);
  }, []);

  const closeImageViewer = useCallback(() => {
    setViewingImage(null);
  }, []);

  const nextImage = useCallback(() => {
    if (selectedProject && selectedProject.gallery) {
      const nextIndex =
        (currentImageIndex + 1) % selectedProject.gallery.length;
      setCurrentImageIndex(nextIndex);
      setViewingImage(selectedProject.gallery[nextIndex]);
    }
  }, [selectedProject, currentImageIndex]);

  const prevImage = useCallback(() => {
    if (selectedProject && selectedProject.gallery) {
      const prevIndex =
        currentImageIndex === 0
          ? selectedProject.gallery.length - 1
          : currentImageIndex - 1;
      setCurrentImageIndex(prevIndex);
      setViewingImage(selectedProject.gallery[prevIndex]);
    }
  }, [selectedProject, currentImageIndex]);

  return (
    <Container>
      <ContentWithPaddingXl>
        <HeaderContainer>
          <SubheadingStyled>{subheading}</SubheadingStyled>
          <Heading>{heading}</Heading>
          <Description>{description}</Description>
        </HeaderContainer>

        <ProjectsGrid>
          <AnimatePresence mode="wait">
            {filteredProjects.map((project, index) => (
              <ProjectCard
                key={`project-${project.id}`}
                layout
                onClick={() => openProjectModal(project)}
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.9 }}
                transition={{
                  duration: 0.3,
                  delay: index * 0.05,
                  ease: "easeOut",
                }}
                whileHover={{ y: -8, scale: 1.02 }}
              >
                <ProjectImageContainer>
                  <ProjectImage
                    src={project.featuredImage}
                    alt={project.title}
                    loading="lazy"
                  />
                  <ClientTypeBadge clientType={project.clientType}>
                    {project.clientType === "residencial"
                      ? "Residencial"
                      : "Corporativo"}
                  </ClientTypeBadge>
                </ProjectImageContainer>

                <ProjectInfo>
                  <ProjectTitle>{project.title}</ProjectTitle>
                  <ProjectDescription>{project.description}</ProjectDescription>

                  <ProjectDetails>
                    <DetailItem>
                      <DetailIcon>
                        <LocationIcon size={14} />
                      </DetailIcon>
                      {project.location}
                    </DetailItem>
                    <DetailItem>
                      <DetailIcon>
                        <CalendarIcon size={14} />
                      </DetailIcon>
                      {project.year}
                    </DetailItem>
                    <DetailItem>
                      <DetailIcon>
                        <ClientTypeIcon size={14} />
                      </DetailIcon>
                      {project.area}
                    </DetailItem>
                  </ProjectDetails>

                  <ViewProjectButton>
                    <GalleryIcon size={16} style={{ marginRight: "8px" }} />
                    Explorar Galeria Completa
                  </ViewProjectButton>
                </ProjectInfo>
              </ProjectCard>
            ))}
          </AnimatePresence>
        </ProjectsGrid>

        {/* Modal do Projeto */}
        <AnimatePresence>
          {selectedProject && (
            <ModalOverlay
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeProjectModal}
            >
              <ModalContent
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
              >
                <ModalHeader>
                  <ModalTitle>{selectedProject.title}</ModalTitle>
                  <CloseButton onClick={closeProjectModal}>
                    <CloseIcon size={24} />
                  </CloseButton>
                </ModalHeader>

                <ModalBody>
                  <ProjectDetailsFull>
                    <ProjectDescriptionFull>
                      {selectedProject.fullDescription}
                    </ProjectDescriptionFull>

                    <ProjectMetadata>
                      <MetadataItem>
                        <MetadataIcon>
                          <LocationIcon size={18} />
                        </MetadataIcon>
                        <span>
                          <strong>Local:</strong> {selectedProject.location}
                        </span>
                      </MetadataItem>
                      <MetadataItem>
                        <MetadataIcon>
                          <CalendarIcon size={18} />
                        </MetadataIcon>
                        <span>
                          <strong>Ano:</strong> {selectedProject.year}
                        </span>
                      </MetadataItem>
                      <MetadataItem>
                        <MetadataIcon>
                          <ClientTypeIcon size={18} />
                        </MetadataIcon>
                        <span>
                          <strong>Área:</strong> {selectedProject.area}
                        </span>
                      </MetadataItem>
                    </ProjectMetadata>
                  </ProjectDetailsFull>

                  <GalleryContainer>
                    <GalleryTitle>Galeria de Imagens</GalleryTitle>
                    <GalleryGrid>
                      {selectedProject.gallery.map((image, index) => (
                        <GalleryImage
                          key={image}
                          src={image}
                          alt={`${selectedProject.title} - Imagem ${index + 1}`}
                          onClick={() => openImageViewer(image, index)}
                          loading="lazy"
                        />
                      ))}
                    </GalleryGrid>
                  </GalleryContainer>
                </ModalBody>
              </ModalContent>
            </ModalOverlay>
          )}
        </AnimatePresence>

        {/* Visualizador de Imagem em Tela Cheia */}
        <AnimatePresence>
          {viewingImage && (
            <ImageViewer
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeImageViewer}
            >
              <ImageViewerContent onClick={(e) => e.stopPropagation()}>
                <ImageViewerImage src={viewingImage} alt="Imagem ampliada" />
                <ImageViewerControls>
                  <ControlButton onClick={prevImage}>
                    <ChevronLeftIcon size={20} />
                  </ControlButton>
                  <ControlButton onClick={nextImage}>
                    <ChevronRightIcon size={20} />
                  </ControlButton>
                  <ControlButton onClick={closeImageViewer}>
                    <CloseIcon size={20} />
                  </ControlButton>
                </ImageViewerControls>
              </ImageViewerContent>
            </ImageViewer>
          )}
        </AnimatePresence>
      </ContentWithPaddingXl>
    </Container>
  );
};

ProjectsPortfolio.propTypes = {
  subheading: PropTypes.string,
  heading: PropTypes.string,
  description: PropTypes.string,
  currentFilter: PropTypes.string,
};

ProjectsPortfolio.defaultProps = {
  subheading: "Portfólio Exclusivo",
  heading: "Projetos Paisagísticos que Transformam Espaços",
  description:
    "Mais de 25 anos criando jardins únicos que harmonizam arquitetura e natureza. Cada projeto reflete nossa expertise em paisagismo sustentável, desde residências de alto padrão até ambientes corporativos inovadores. Descubra como podemos transformar seu espaço.",
  currentFilter: "todos",
};

export default memo(ProjectsPortfolio);
