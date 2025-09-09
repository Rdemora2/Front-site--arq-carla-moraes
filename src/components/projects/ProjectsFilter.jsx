import React, { useState, memo, useEffect } from "react";
import PropTypes from "prop-types";
import tw from "twin.macro";
import styled from "styled-components";
import { motion } from "framer-motion";
import { SectionHeading } from "components/misc/Headings";

const Container = tw.div`relative py-12 bg-gray-100`;
const ContentWithPaddingXl = tw.div`max-w-screen-xl mx-auto px-4 lg:px-8`;

const HeaderContainer = tw.div`text-center mb-12`;
const Heading = tw(SectionHeading)`text-center text-2xl mb-6 text-gray-800`;

const FiltersContainer = tw.div`flex flex-wrap justify-center gap-4`;

const FilterButton = styled(motion.button)`
  ${tw`px-8 py-4 rounded-full font-semibold text-sm transition-all duration-300 border-2 shadow-md`}

  ${(props) =>
    props.active
      ? `${tw`text-white shadow-lg`} background-color: var(--color-primary); border-color: var(--color-primary);`
      : `${tw`bg-white text-gray-700 hover:text-white hover:shadow-lg`} border-color: var(--color-primary); &:hover { background-color: var(--color-primary); }`}
`;

const FilterCount = tw.span`ml-2 text-xs opacity-75`;

const ProjectsFilter = ({
  heading = "Explore Nossos Projetos por Categoria",
  onFilterChange,
  activeFilter = "todos",
}) => {
  const [selectedFilter, setSelectedFilter] = useState(activeFilter);

  useEffect(() => {
    if (activeFilter !== selectedFilter) {
      setSelectedFilter(activeFilter);
    }
  }, [activeFilter, selectedFilter]);

  const filters = [
    { key: "todos", label: "Todos os Projetos", count: 6 },
    { key: "residencial", label: "Paisagismo Residencial", count: 3 },
    { key: "corporativo", label: "Projetos Corporativos", count: 3 },
  ];

  const handleFilterClick = (filterKey) => {
    if (filterKey !== selectedFilter) {
      setSelectedFilter(filterKey);
      if (onFilterChange) {
        onFilterChange(filterKey);
      }
    }
  };

  return (
    <Container>
      <ContentWithPaddingXl>
        <HeaderContainer>
          <Heading>{heading}</Heading>
        </HeaderContainer>

        <FiltersContainer>
          {filters.map((filter) => (
            <FilterButton
              key={filter.key}
              active={selectedFilter === filter.key}
              onClick={() => handleFilterClick(filter.key)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {filter.label}
              <FilterCount>({filter.count})</FilterCount>
            </FilterButton>
          ))}
        </FiltersContainer>
      </ContentWithPaddingXl>
    </Container>
  );
};

ProjectsFilter.propTypes = {
  heading: PropTypes.string,
  onFilterChange: PropTypes.func,
  activeFilter: PropTypes.string,
};

ProjectsFilter.defaultProps = {
  heading: "Explore Nossos Projetos por Categoria",
  onFilterChange: null,
  activeFilter: "todos",
};

export default memo(ProjectsFilter);
