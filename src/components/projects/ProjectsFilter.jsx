import React, { useState, memo, useEffect } from "react";
import PropTypes from "prop-types";
import tw from "twin.macro";
import styled from "styled-components";
import { motion } from "framer-motion";

const Container = tw.div`relative py-6 bg-transparent`;
const ContentWithPaddingXl = tw.div`max-w-screen-xl mx-auto px-4 lg:px-8`;

const FilterRow = tw.div`flex items-center justify-center gap-6 mb-8`;
const FilterLabel = tw.span`text-sm font-medium text-gray-600 hidden sm:block`;

const FiltersContainer = tw.div`flex flex-wrap justify-center gap-2 sm:gap-3`;

const FilterButton = styled(motion.button)`
  ${tw`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 border border-transparent relative overflow-hidden`}

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
  
  &:active {
    transform: translateY(0);
  }
`;

const FilterCount = styled.span`
  ${tw`ml-2 text-xs opacity-75`}
  ${(props) => (props.active ? `opacity: 0.9;` : `opacity: 0.6;`)}
`;

const ActiveIndicator = styled(motion.div)`
  position: absolute;
  bottom: -4px;
  left: 50%;
  width: 20px;
  height: 2px;
  background-color: var(--color-primary);
  border-radius: 1px;
  transform: translateX(-50%);
`;

const ProjectsFilter = ({ onFilterChange, activeFilter = "todos" }) => {
  const [selectedFilter, setSelectedFilter] = useState(activeFilter);

  useEffect(() => {
    if (activeFilter !== selectedFilter) {
      setSelectedFilter(activeFilter);
    }
  }, [activeFilter, selectedFilter]);

  const filters = [
    { key: "todos", label: "Todos", count: 6 },
    { key: "residencial", label: "Residencial", count: 3 },
    { key: "corporativo", label: "Corporativo", count: 3 },
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
        <FilterRow>
          <FilterLabel>Filtrar por:</FilterLabel>
          <FiltersContainer>
            {filters.map((filter) => (
              <FilterButton
                key={`filter-${filter.key}`}
                active={selectedFilter === filter.key}
                onClick={() => handleFilterClick(filter.key)}
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
                <FilterCount active={selectedFilter === filter.key}>
                  ({filter.count})
                </FilterCount>
                {selectedFilter === filter.key && (
                  <ActiveIndicator
                    layoutId="activeIndicator"
                    transition={{ type: "spring", damping: 20, stiffness: 300 }}
                  />
                )}
              </FilterButton>
            ))}
          </FiltersContainer>
        </FilterRow>
      </ContentWithPaddingXl>
    </Container>
  );
};

ProjectsFilter.propTypes = {
  onFilterChange: PropTypes.func,
  activeFilter: PropTypes.string,
};

ProjectsFilter.defaultProps = {
  onFilterChange: null,
  activeFilter: "todos",
};

export default memo(ProjectsFilter);
