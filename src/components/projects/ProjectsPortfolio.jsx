import React, { useCallback, memo, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import tw from "twin.macro";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { SectionHeading } from "components/misc/Headings";
import { PrimaryButton as PrimaryButtonBase } from "components/misc/Buttons";
import {
  getProjectsByFilter,
  getDynamicFilterOptions,
} from "../../data/projectsData";
import {
  MapPin as LocationIcon,
  Calendar as CalendarIcon,
  User as ClientTypeIcon,
  Image as GalleryIcon,
} from "react-feather";

const Container = tw.div`relative py-8 lg:py-12`;
const ContentWithPaddingXl = tw.div`max-w-screen-xl mx-auto px-4 lg:px-8`;

const HeaderContainer = tw.div`text-center mb-12`;
const SubheadingStyled = tw.div`text-center text-green-600 mb-3 text-sm uppercase tracking-widest font-bold`;
const Heading = tw(SectionHeading)`text-center text-gray-800`;
const Description = tw.p`text-center max-w-4xl mx-auto mt-4 text-gray-700 leading-relaxed text-base lg:text-lg`;

const ContentSection = tw.div`mt-8`;
const FiltersRow = tw.div`flex justify-end mb-6`;
const FiltersContainer = tw.div`flex items-center gap-2`;
const FilterButton = styled(motion.button)`
  ${tw`px-3 py-1 rounded-full text-xs font-medium transition-all duration-300 border border-transparent relative`}

  ${(props) =>
    props.active
      ? `
        background-color: var(--color-primary);
        color: white;
        box-shadow: 0 2px 8px rgba(107, 121, 89, 0.2);
      `
      : `
        background-color: rgba(145, 160, 130, 0.1);
        color: var(--color-primary-text);
        border-color: rgba(107, 121, 89, 0.2);
        
        &:hover {
          background-color: rgba(107, 121, 89, 0.1);
          border-color: var(--color-primary);
          transform: translateY(-1px);
          box-shadow: 0 2px 12px rgba(107, 121, 89, 0.15);
        }
      `}
`;
const FilterCount = tw.span`ml-1 text-xs opacity-75`;

const ProjectsGrid = tw.div`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8`;

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

const ClientTypeBadge = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== "clientType",
})`
  ${tw`absolute top-0 left-0 m-4 px-3 py-1 rounded-full text-xs font-bold text-white`}
  background-color: ${(props) =>
    props.clientType === "residencial" ? "#6b7959" : "#a99960"};
`;

const ProjectInfo = styled.div`
  ${tw`p-6 flex flex-col`}
  min-height: 280px; /* Altura mínima fixa para uniformizar os cards */

  /* Remove hovers específicos dos textos internos */
  * {
    pointer-events: none;
  }
`;
const ProjectTitle = styled.h3`
  ${tw`text-xl font-bold text-gray-800 mb-3 leading-tight`}
  height: 3.5rem; /* Altura fixa para comportar 2 linhas de texto */
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.4;
`;
const ProjectDescription = tw.p`text-gray-600 text-sm leading-relaxed mb-6 line-clamp-3`;

const ProjectDetails = tw.div`flex flex-wrap gap-4 text-xs text-gray-500 mb-4`;
const DetailItem = tw.div`flex items-center`;
const DetailIcon = tw.div`mr-2 text-green-600`;

const ViewProjectButton = styled(PrimaryButtonBase)`
  ${tw`w-full text-sm transition-colors duration-300 mt-auto flex items-center justify-center`}
  background-color: #6b7959;
  pointer-events: auto; /* Re-habilita eventos para o botão */

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

/* eslint-disable react/prop-types */
const ProjectsPortfolio = ({
  subheading = "Portfólio Exclusivo",
  heading = "Projetos Paisagísticos que Transformam Espaços",
  description = "Mais de 25 anos criando jardins únicos que harmonizam arquitetura e natureza. Cada projeto reflete nossa expertise em paisagismo sustentável, desde residências de alto padrão até ambientes corporativos inovadores. Descubra como podemos transformar seu espaço.",
  currentFilter = "todos",
  onFilterChange,
}) => {
  const navigate = useNavigate();

  // Usa filtros dinâmicos baseados nos dados disponíveis
  const filters = useMemo(() => {
    return getDynamicFilterOptions();
  }, []);

  const filteredProjects = useMemo(() => {
    return getProjectsByFilter(currentFilter);
  }, [currentFilter]);

  const handleFilterChange = (filterKey) => {
    if (onFilterChange) {
      onFilterChange(filterKey);
    }
  };

  const viewProjectGallery = useCallback(
    (project) => {
      navigate(`/projetos/${project.id}/galeria`);
    },
    [navigate],
  );

  return (
    <Container>
      <ContentWithPaddingXl>
        <HeaderContainer>
          <SubheadingStyled>{subheading}</SubheadingStyled>
          <Heading>{heading}</Heading>
          <Description>{description}</Description>
        </HeaderContainer>

        <ContentSection>
          <FiltersRow>
            <FiltersContainer>
              {filters.map((filter) => (
                <FilterButton
                  key={`filter-${filter.key}`}
                  active={currentFilter === filter.key}
                  onClick={() => handleFilterChange(filter.key)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.2,
                    delay: filters.indexOf(filter) * 0.05,
                  }}
                >
                  {filter.label}
                  <FilterCount>({filter.count})</FilterCount>
                </FilterButton>
              ))}
            </FiltersContainer>
          </FiltersRow>

          <ProjectsGrid>
            <AnimatePresence>
              {filteredProjects.map((project, index) => (
                <ProjectCard
                  key={`project-${project.id}`}
                  layout
                  onClick={() => viewProjectGallery(project)}
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
                    <ProjectDescription>
                      {project.description}
                    </ProjectDescription>

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
        </ContentSection>
      </ContentWithPaddingXl>
    </Container>
  );
};
export default memo(ProjectsPortfolio);
