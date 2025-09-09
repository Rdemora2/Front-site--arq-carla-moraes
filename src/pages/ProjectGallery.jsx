import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AnimationRevealPage from "helpers/AnimationRevealPage.jsx";
import MetaTags from "components/misc/MetaTags.jsx";
import Header from "components/navbar/navbar.jsx";
import Footer from "components/footers/FiveColumnWithInputForm.jsx";
import { getProjectById } from "../data/projectsData";
import tw from "twin.macro";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft as BackIcon,
  MapPin as LocationIcon,
  Calendar as CalendarIcon,
  User as ClientTypeIcon,
  X as CloseIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Maximize2 as ExpandIcon,
} from "react-feather";

const Container = tw.div`relative py-8 lg:py-12`;
const ContentWithPaddingXl = tw.div`max-w-screen-xl mx-auto px-4 lg:px-8`;

// Header da galeria
const GalleryHeader = tw.div`mb-8`;
const BackButton = styled(motion.button)`
  ${tw`flex items-center mb-4 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300`}
  background-color: rgba(145, 160, 130, 0.1);
  color: var(--color-primary-text);
  border: 1px solid rgba(107, 121, 89, 0.2);

  &:hover {
    background-color: rgba(107, 121, 89, 0.1);
    border-color: var(--color-primary);
    transform: translateX(-2px);
  }
`;

const ProjectTitle = tw.h1`text-3xl lg:text-4xl font-bold text-gray-800 mb-4`;
const ProjectDescription = tw.p`text-gray-600 leading-relaxed mb-6 max-w-3xl`;

const ProjectMetadata = tw.div`flex flex-wrap gap-6 mb-8`;
const MetadataItem = tw.div`flex items-center text-sm text-gray-600`;
const MetadataIcon = tw.div`mr-2 text-green-600`;

// Grid da galeria
const GalleryGrid = tw.div`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6`;
const GalleryImageContainer = styled(motion.div)`
  ${tw`relative overflow-hidden rounded-lg cursor-pointer`}
  aspect-ratio: 4/3;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(107, 121, 89, 0.2);
  }
`;

const GalleryImage = styled.img`
  ${tw`w-full h-full object-cover transition-transform duration-300`}

  .group:hover & {
    transform: scale(1.05);
  }
`;

const ImageOverlay = styled(motion.div)`
  ${tw`absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300`}
  background: rgba(0, 0, 0, 0.4);

  .group:hover & {
    opacity: 1;
  }
`;

const ExpandButton = styled.div`
  ${tw`w-12 h-12 bg-white rounded-full flex items-center justify-center`}
  color: var(--color-primary);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
`;

// Modal de visualização de imagem em tela cheia
const ImageModal = styled(motion.div)`
  ${tw`fixed inset-0 bg-black flex items-center justify-center p-4`}
  background-color: rgba(0, 0, 0, 0.95);
  z-index: 10000;
`;

const ModalContent = tw.div`relative max-w-full max-h-full`;
const ModalImage = tw.img`max-w-full max-h-full object-contain`;
const ModalControls = tw.div`absolute top-0 right-0 m-4 flex gap-2`;
const ControlButton = styled.button`
  ${tw`p-2 bg-white rounded-full text-gray-800 transition-all hover:bg-gray-200`}
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
`;

const NavigationButtons = tw.div`absolute top-1/2 transform -translate-y-1/2 left-0 right-0 px-4 flex justify-between pointer-events-none`;
const NavButton = styled.button`
  ${tw`p-3 bg-white rounded-full text-gray-800 transition-all hover:bg-gray-200 pointer-events-auto`}
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
`;

const ProjectGallery = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);

  useEffect(() => {
    const foundProject = getProjectById(projectId);
    if (foundProject) {
      setProject(foundProject);
    } else {
      navigate("/projetos");
    }
  }, [projectId, navigate]);

  const openImageModal = useCallback((index) => {
    setSelectedImageIndex(index);
  }, []);

  const closeImageModal = useCallback(() => {
    setSelectedImageIndex(null);
  }, []);

  const nextImage = useCallback(() => {
    if (project && selectedImageIndex !== null) {
      const nextIndex = (selectedImageIndex + 1) % project.gallery.length;
      setSelectedImageIndex(nextIndex);
    }
  }, [project, selectedImageIndex]);

  const prevImage = useCallback(() => {
    if (project && selectedImageIndex !== null) {
      const prevIndex =
        selectedImageIndex === 0
          ? project.gallery.length - 1
          : selectedImageIndex - 1;
      setSelectedImageIndex(prevIndex);
    }
  }, [project, selectedImageIndex]);

  const handleKeyPress = useCallback(
    (e) => {
      if (selectedImageIndex !== null) {
        if (e.key === "Escape") closeImageModal();
        if (e.key === "ArrowRight") nextImage();
        if (e.key === "ArrowLeft") prevImage();
      }
    },
    [selectedImageIndex, closeImageModal, nextImage, prevImage]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [handleKeyPress]);

  if (!project) return null;

  return (
    <>
      <AnimationRevealPage>
        <MetaTags
          title={`${project.title} | Galeria Completa | Carla Moraes Arquitetura Paisagística`}
          description={project.fullDescription}
          imageUrl={project.featuredImage}
        />

        <Header />

        <Container>
          <ContentWithPaddingXl>
            <GalleryHeader>
              <BackButton
                onClick={() => navigate("/projetos")}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <BackIcon size={16} style={{ marginRight: "8px" }} />
                Voltar aos Projetos
              </BackButton>

              <ProjectTitle>{project.title}</ProjectTitle>
              <ProjectDescription>{project.fullDescription}</ProjectDescription>

              <ProjectMetadata>
                <MetadataItem>
                  <MetadataIcon>
                    <LocationIcon size={18} />
                  </MetadataIcon>
                  <span>
                    <strong>Local:</strong> {project.location}
                  </span>
                </MetadataItem>
                <MetadataItem>
                  <MetadataIcon>
                    <CalendarIcon size={18} />
                  </MetadataIcon>
                  <span>
                    <strong>Ano:</strong> {project.year}
                  </span>
                </MetadataItem>
              </ProjectMetadata>
            </GalleryHeader>

            <GalleryGrid>
              {project.gallery.map((image, index) => (
                <GalleryImageContainer
                  key={image}
                  className="group"
                  onClick={() => openImageModal(index)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  whileHover={{ y: -4 }}
                >
                  <GalleryImage
                    src={image}
                    alt={`${project.title} - Imagem ${index + 1}`}
                    loading="lazy"
                  />
                  <ImageOverlay>
                    <ExpandButton>
                      <ExpandIcon size={20} />
                    </ExpandButton>
                  </ImageOverlay>
                </GalleryImageContainer>
              ))}
            </GalleryGrid>

            {/* Modal de imagem em tela cheia */}
            <AnimatePresence>
              {selectedImageIndex !== null && (
                <ImageModal
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={closeImageModal}
                >
                  <ModalContent onClick={(e) => e.stopPropagation()}>
                    <ModalImage
                      src={project.gallery[selectedImageIndex]}
                      alt={`${project.title} - Imagem ${selectedImageIndex + 1}`}
                    />

                    <ModalControls>
                      <ControlButton onClick={closeImageModal}>
                        <CloseIcon size={20} />
                      </ControlButton>
                    </ModalControls>

                    <NavigationButtons>
                      <NavButton onClick={prevImage}>
                        <ChevronLeftIcon size={24} />
                      </NavButton>
                      <NavButton onClick={nextImage}>
                        <ChevronRightIcon size={24} />
                      </NavButton>
                    </NavigationButtons>
                  </ModalContent>
                </ImageModal>
              )}
            </AnimatePresence>
          </ContentWithPaddingXl>
        </Container>
      </AnimationRevealPage>

      {/* Footer fora do AnimationRevealPage para remover a animação */}
      <Footer />
    </>
  );
};

export default ProjectGallery;
