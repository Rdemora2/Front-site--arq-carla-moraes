export const projectsData = [
  {
    id: 1,
    title: "Jardim Francês Clássico",
    description:
      "Um estilo de jardim clássico e elegante com simetria perfeita, formas geométricas e topiarias artesanais. Características marcantes incluem a ordem simétrica e plantas podadas em formas geométricas.",
    clientType: "residencial",
    location: "Morumbi, SP",
    year: "2023",
    featuredImage: "/images/components/hero/Frances-hero",
    gallery: [
      "/images/projects/Jardim-frances/Frances-1",
      "/images/projects/Jardim-frances/Frances-2",
      "/images/projects/Jardim-frances/Frances-3",
      "/images/projects/Jardim-frances/Frances-4",
      "/images/projects/Jardim-frances/Frances-5",
    ],
    fullDescription:
      "Este projeto residencial no Morumbi apresenta um jardim francês clássico e elegante, conhecido por sua simetria e ordem impecáveis. As características principais incluem simetria perfeita em todos os elementos, formas geométricas como retângulos e círculos, e topiarias que são plantas cuidadosamente podadas em formas geométricas. O design reflete a tradição dos jardins franceses, criando um ambiente sofisticado e harmonioso que valoriza a precisão e a beleza formal.",
    featured: true,
  },
  {
    id: 2,
    title: "Jardim Tropical Moderno",
    description:
      "Jardim tropical com folhagem diversa no caminho que conduz ao espelho d'água composto de pedras roladas, bromélias e orquídeas. Moderno e elegante.",
    clientType: "residencial",
    location: "São Paulo, SP",
    year: "2023",
    featuredImage: "/images/projects/Jardim-tropical/tropical-2",
    gallery: [
      "/images/projects/Jardim-tropical/tropical-1",
      "/images/projects/Jardim-tropical/tropical-2",
      "/images/projects/Jardim-tropical/tropical-3",
      "/images/projects/Jardim-tropical/tropical-4",
      "/images/projects/Jardim-tropical/tropical-5",
      "/images/projects/Jardim-tropical/tropical-6",
    ],
    fullDescription:
      "Este jardim tropical apresenta um design moderno e elegante, criando um caminho através do jardim de entrada que conduz desde a rampa de acesso até o espelho d'água. O projeto incorpora folhagem diversificada, pedras roladas naturais, bromélias coloridas e orquídeas exóticas, criando um ambiente tropical sofisticado. A composição harmoniosa entre os elementos naturais e o espelho d'água proporciona uma experiência sensorial única, conectando os moradores com a natureza de forma contemporânea e refinada.",
    featured: true,
  },
  {
    id: 3,
    title: "Paisagismo Hotel nos Jardins",
    description:
      "Implantação de novo paisagismo em hotel nos Jardins, SP. Projeto que manteve as palmeiras Phoenix existentes e criou formas e volumes nos canteiros para movimento visual.",
    clientType: "corporativo",
    location: "Jardins, SP",
    year: "2022",
    featuredImage: "/images/projects/Hotel-jardins/jardins-01",
    gallery: [
      "/images/projects/Hotel-jardins/jardins-01",
      "/images/projects/Hotel-jardins/jardins-02",
      "/images/projects/Hotel-jardins/jardins-03",
      "/images/projects/Hotel-jardins/jardins-04",
      "/images/projects/Hotel-jardins/jardins-05",
      "/images/projects/Hotel-jardins/jardins-06",
      "/images/projects/Hotel-jardins/jardins-07",
      "/images/projects/Hotel-jardins/jardins-08",
      "/images/projects/Hotel-jardins/jardins-09",
    ],
    fullDescription:
      "Este projeto de paisagismo para um hotel no bairro dos Jardins representa uma inovação em sua área verde externa. Mantivemos estrategicamente apenas as palmeiras Phoenix existentes, que serviram como elementos estruturais do novo design. Criamos formas e volumes dinâmicos nos canteiros para gerar movimento visual e interesse estético. As espécies selecionadas incluem Strelitzia para altura e cor, buxus para estrutura e forma, murta para cobrir alvenaria na base da fonte, dianella para contraste foliar e moreia para pontos focais. Esta combinação resulta em um paisagismo comercial sofisticado e de baixa manutenção.",
    featured: true,
  },
  {
    id: 4,
    title: "SICOOB Metalcred - Sede Corporativa",
    description:
      "Paisagismo desenvolvido para a sede da SICOOB em 2020, no bairro da Liberdade. Projeto com peças internas em fibra branca e área externa com vasos em cimento natural.",
    clientType: "corporativo",
    location: "Liberdade, SP",
    year: "2020",
    featuredImage: "/images/projects/Sicoob-liberdade/sicoob-02",
    gallery: [
      "/images/projects/Sicoob-liberdade/sicoob-01",
      "/images/projects/Sicoob-liberdade/sicoob-02",
      "/images/projects/Sicoob-liberdade/sicoob-03",
      "/images/projects/Sicoob-liberdade/sicoob-04",
      "/images/projects/Sicoob-liberdade/sicoob-05",
      "/images/projects/Sicoob-liberdade/sicoob-06",
      "/images/projects/Sicoob-liberdade/sicoob-07",
      "/images/projects/Sicoob-liberdade/sicoob-08",
      "/images/projects/Sicoob-liberdade/sicoob-09",
      "/images/projects/Sicoob-liberdade/sicoob-10",
      "/images/projects/Sicoob-liberdade/sicoob-12",
      "/images/projects/Sicoob-liberdade/sicoob-13",
      "/images/projects/Sicoob-liberdade/sicoob-14",
      "/images/projects/Sicoob-liberdade/sicoob-15",
      "/images/projects/Sicoob-liberdade/sicoob-16",
    ],
    fullDescription:
      "Projeto paisagístico desenvolvido para a sede corporativa da SICOOB Metalcred no bairro da Liberdade, São Paulo, em 2020. O conceito do projeto combina funcionalidade empresarial com elementos naturais, utilizando uma abordagem diferenciada para ambientes internos e externos. Nas áreas internas, optamos por peças em fibra na cor branca, criando um visual clean e moderno que complementa o ambiente corporativo. Para as áreas externas, escolhemos vasos em cimento natural que conferem robustez e durabilidade. O destaque do projeto é a composição com vasos em cimento plantados com bambu mosso torto, criando um elemento visual marcante e trazendo movimento natural à área de eventos externa.",
    featured: true,
  },
];

export const getFeaturedProjects = (limit = 5) => {
  return projectsData.filter((project) => project.featured).slice(0, limit);
};

export const getAllProjects = () => {
  return projectsData;
};

export const getProjectsByFilter = (filter = "todos") => {
  if (filter === "todos") {
    return projectsData;
  }
  return projectsData.filter((project) => project.clientType === filter);
};

export const getProjectById = (id) => {
  return projectsData.find((project) => project.id === parseInt(id));
};

export const getProjectStats = () => {
  const total = projectsData.length;
  const residential = projectsData.filter(
    (p) => p.clientType === "residencial"
  ).length;
  const corporate = projectsData.filter(
    (p) => p.clientType === "corporativo"
  ).length;

  return {
    total,
    residential,
    corporate,
  };
};

let cachedClientTypes = null;

export const getAvailableClientTypes = () => {
  if (cachedClientTypes) {
    return cachedClientTypes;
  }

  const clientTypes = [
    ...new Set(projectsData.map((project) => project.clientType)),
  ];

  // Mapeamento para labels amigáveis
  const clientTypeLabels = {
    residencial: "Residencial",
    corporativo: "Corporativo",
    comercial: "Comercial",
    publico: "Público",
    institucional: "Institucional",
  };

  cachedClientTypes = clientTypes.map((type) => ({
    key: type,
    label:
      clientTypeLabels[type] || type.charAt(0).toUpperCase() + type.slice(1),
    count: projectsData.filter((p) => p.clientType === type).length,
  }));

  return cachedClientTypes;
};

export const getDynamicFilterOptions = () => {
  const availableTypes = getAvailableClientTypes();
  const total = projectsData.length;

  const filters = [{ key: "todos", label: "Todos", count: total }];

  const sortedTypes = availableTypes.sort((a, b) =>
    a.label.localeCompare(b.label)
  );
  filters.push(...sortedTypes);

  return filters;
};
