import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import tw from "twin.macro";
import usePerformanceMonitoring from "../../hooks/usePerformanceMonitoring";
// Removida importação da função incompatível

// Componentes estilizados
const ReportContainer = styled.div`
  ${tw`fixed inset-0 bg-black bg-opacity-75 z-50 overflow-auto flex justify-center`}
  background-color: rgba(0, 0, 0, 0.8); /* Aplicando opacidade de 0.8 diretamente */
  padding: 2rem;
`;

const ReportContent = styled.div`
  ${tw`bg-white rounded-lg shadow-lg w-full max-w-5xl`}
  max-height: 90vh;
  overflow-y: auto;
`;

const ReportHeader = styled.div`
  ${tw`sticky top-0 bg-gray-800 text-white p-4 flex justify-between items-center`}
`;

const CloseButton = styled.button`
  ${tw`bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-3 rounded`}
`;

const ExportButton = styled.button`
  ${tw`bg-blue-600 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded ml-2`}
`;

const ScoreGrid = styled.div`
  ${tw`grid grid-cols-1 md:grid-cols-4 gap-4 p-4`}
`;

const ScoreCard = styled.div`
  ${tw`border rounded-lg p-4 flex flex-col items-center justify-center`}
  background-color: ${(props) => {
    if (props.score >= 90) return "#e6f7ed";
    if (props.score >= 50) return "#fef7e6";
    return "#fde8e8";
  }};
  border-color: ${(props) => {
    if (props.score >= 90) return "#34d399";
    if (props.score >= 50) return "#fbbf24";
    return "#f87171";
  }};
`;

const ScoreCircle = styled.div`
  ${tw`rounded-full w-24 h-24 flex items-center justify-center mb-2 text-2xl font-bold`}
  background-color: ${(props) => {
    if (props.score >= 90) return "#10b981";
    if (props.score >= 50) return "#f59e0b";
    return "#ef4444";
  }};
  color: white;
`;

const ScoreLabel = styled.div`
  ${tw`text-lg font-medium`}
`;

const MetricsSection = styled.div`
  ${tw`p-4`}
`;

const SectionTitle = styled.h3`
  ${tw`text-xl font-bold mb-3 text-gray-800`}
`;

const MetricTable = styled.table`
  ${tw`w-full border-collapse`}
`;

const MetricRow = styled.tr`
  ${tw`border-b`}
  &:hover {
    background-color: #f9fafb; /* Equivalente ao bg-gray-50 (cinza muito claro) */
  }
`;

const MetricHeader = styled.th`
  ${tw`text-left p-2 bg-gray-100`}
`;

const MetricCell = styled.td`
  ${tw`p-2`}
`;

const MetricRatingBadge = styled.span`
  ${tw`inline-block py-1 px-2 rounded text-white text-xs font-bold`}
  background-color: ${(props) => {
    if (props.rating === "good") return "#10b981";
    if (props.rating === "needs-improvement") return "#f59e0b";
    return "#ef4444";
  }};
`;

const LighthouseDetailedReport = ({ isOpen, onClose }) => {
  const { getMetrics, getLighthouseScores, exportLighthouseData } =
    usePerformanceMonitoring();
  const [metrics, setMetrics] = useState([]);
  const [scores, setScores] = useState({
    performance: null,
    accessibility: null,
    bestPractices: null,
    seo: null,
  });

  // Atualizar métricas quando o relatório é aberto
  useEffect(() => {
    if (isOpen) {
      const currentMetrics = Object.values(getMetrics());
      if (currentMetrics.length > 0) {
        setMetrics(currentMetrics);
      }

      const currentScores = getLighthouseScores();
      if (currentScores.performance) {
        setScores(currentScores);
      }

      // Atualizar métricas a cada segundo
      const interval = setInterval(() => {
        setMetrics(Object.values(getMetrics()));
        setScores(getLighthouseScores());
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isOpen, getMetrics, getLighthouseScores]);

  if (!isOpen) return null;

  // Agrupar métricas por categorias
  const metricsByCategory = {
    "Core Web Vitals": metrics.filter((m) =>
      ["LCP", "FID", "CLS"].includes(m.name)
    ),
    "Outras Métricas de Performance": metrics.filter((m) =>
      ["FCP", "TTFB", "TTI", "TBT", "SI"].includes(m.name)
    ),
    "Métricas de Recursos": metrics.filter((m) =>
      m.name.startsWith("Resource_")
    ),
    "Métricas de Componentes": metrics.filter((m) =>
      m.name.startsWith("Component_")
    ),
    Eventos: metrics.filter((m) => m.name.startsWith("Event_")),
  };

  // Labels para nomes das métricas
  const metricLabels = {
    LCP: "Largest Contentful Paint",
    FID: "First Input Delay",
    CLS: "Cumulative Layout Shift",
    FCP: "First Contentful Paint",
    TTFB: "Time to First Byte",
    TTI: "Time to Interactive",
    TBT: "Total Blocking Time",
    SI: "Speed Index",
  };

  const getMetricDescription = (name) => {
    switch (name) {
      case "LCP":
        return "Tempo até o maior elemento visível ser renderizado";
      case "FID":
        return "Tempo até o navegador processar o primeiro clique/toque";
      case "CLS":
        return "Soma das mudanças de layout inesperadas";
      case "FCP":
        return "Tempo até o primeiro conteúdo ser renderizado";
      case "TTFB":
        return "Tempo até o primeiro byte ser recebido";
      case "TTI":
        return "Tempo até a página se tornar interativa";
      case "TBT":
        return "Tempo total bloqueando o thread principal";
      case "SI":
        return "Velocidade de carregamento visual da página";
      default:
        return "";
    }
  };
  const handleExport = () => {
    // Usar diretamente a função do hook
    const data = exportLighthouseData();

    // Criar um Blob com os dados JSON
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });

    // Criar URL para o blob
    const url = URL.createObjectURL(blob);

    // Criar link para download
    const link = document.createElement("a");
    link.href = url;
    link.download = `lighthouse-report-${new Date().toISOString().slice(0, 10)}.json`;

    // Adicionar o link ao documento e clicar automaticamente
    document.body.appendChild(link);
    link.click();

    // Limpar
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <ReportContainer onClick={(e) => e.target === e.currentTarget && onClose()}>
      <ReportContent>
        <ReportHeader>
          <h2>Relatório Detalhado do Lighthouse</h2>
          <div>
            <ExportButton onClick={handleExport}>Exportar JSON</ExportButton>
            <CloseButton onClick={onClose}>Fechar</CloseButton>
          </div>
        </ReportHeader>

        <ScoreGrid>
          {Object.entries(scores).map(([key, value]) => {
            if (value === null) return null;

            let label = "";
            switch (key) {
              case "performance":
                label = "Desempenho";
                break;
              case "accessibility":
                label = "Acessibilidade";
                break;
              case "bestPractices":
                label = "Boas Práticas";
                break;
              case "seo":
                label = "SEO";
                break;
              default:
                label = key;
            }

            return (
              <ScoreCard key={key} score={value}>
                <ScoreCircle score={value}>{value}</ScoreCircle>
                <ScoreLabel>{label}</ScoreLabel>
              </ScoreCard>
            );
          })}
        </ScoreGrid>

        {Object.entries(metricsByCategory).map(
          ([category, categoryMetrics]) => {
            if (categoryMetrics.length === 0) return null;

            return (
              <MetricsSection key={category}>
                <SectionTitle>{category}</SectionTitle>
                <MetricTable>
                  <thead>
                    <tr>
                      <MetricHeader>Métrica</MetricHeader>
                      <MetricHeader>Valor</MetricHeader>
                      <MetricHeader>Classificação</MetricHeader>
                      <MetricHeader>Descrição</MetricHeader>
                    </tr>
                  </thead>
                  <tbody>
                    {categoryMetrics.map((metric) => (
                      <MetricRow key={metric.name}>
                        <MetricCell>
                          <strong>
                            {metricLabels[metric.name] || metric.name}
                          </strong>
                        </MetricCell>
                        <MetricCell>
                          {metric.value}
                          {metric.unit}
                        </MetricCell>
                        <MetricCell>
                          {metric.rating && (
                            <MetricRatingBadge rating={metric.rating}>
                              {metric.rating === "good"
                                ? "Bom"
                                : metric.rating === "needs-improvement"
                                  ? "Precisa melhorar"
                                  : "Ruim"}
                            </MetricRatingBadge>
                          )}
                        </MetricCell>
                        <MetricCell>
                          {getMetricDescription(metric.name)}
                        </MetricCell>
                      </MetricRow>
                    ))}
                  </tbody>
                </MetricTable>
              </MetricsSection>
            );
          }
        )}
      </ReportContent>
    </ReportContainer>
  );
};

LighthouseDetailedReport.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default LighthouseDetailedReport;
