import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import tw from "twin.macro";
import { useWebVitals } from "../../hooks/useWebVitals";
import { usePerformanceOptimizations } from "../../hooks/usePerformanceOptimizations";
import usePerformanceMonitoring from "../../hooks/usePerformanceMonitoring";
import { useEnvironment } from "../../hooks/useEnvironment";

const MonitorContainer = styled.div`
  ${tw`fixed bg-white shadow-lg rounded-lg p-4 border-2 z-50`}
  bottom: 1rem;
  right: 1rem;
  width: 300px;
  max-height: 400px;
  overflow-y: auto;

  ${(props) => props.isMinimized && tw`h-12 overflow-hidden cursor-pointer`}

  @media (max-width: 768px) {
    left: 0.5rem;
    bottom: 0.5rem;
    right: 0.5rem;
    width: auto;
  }
`;

const Header = styled.div`
  ${tw`flex items-center justify-between mb-3 cursor-pointer`}
`;

const Title = styled.h3`
  ${tw`text-sm font-bold text-gray-900`}
`;

const ToggleButton = styled.button`
  ${tw`text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded transition-colors`}
`;

const ScoreContainer = styled.div`
  ${tw`flex items-center justify-between mb-3`}
`;

const OverallScore = styled.div`
  ${tw`text-lg font-bold`}
  color: ${(props) => {
    if (props.score >= 80) return "#10b981"; // green
    if (props.score >= 50) return "#f59e0b"; // yellow
    return "#ef4444"; // red
  }};
`;

const ScoreLabel = styled.span`
  ${tw`text-xs text-gray-500`}
`;

const MetricsList = styled.div`
  ${tw`space-y-2`}
`;

const MetricItem = styled.div`
  ${tw`flex items-center justify-between p-2 bg-gray-100 rounded text-xs`}
`;

const MetricName = styled.span`
  ${tw`font-medium text-gray-600`}
`;

const MetricValue = styled.span`
  ${tw`font-bold`}
  color: ${(props) => {
    switch (props.rating) {
      case "good":
        return "#10b981";
      case "needs-improvement":
        return "#f59e0b";
      case "poor":
        return "#ef4444";
      default:
        return "#6b7280";
    }
  }};
`;

const Tooltip = styled.div`
  ${tw`absolute bg-gray-900 text-white text-xs rounded px-2 py-1 pointer-events-none z-10`}
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  margin-bottom: 4px;
  white-space: nowrap;
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;

  &::after {
    content: "";
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border: 4px solid transparent;
    border-top-color: #1a202c;
  }
`;

const Tabs = styled.div`
  ${tw`flex border-b border-gray-200 mb-3`}
`;

const Tab = styled.button`
  ${tw`px-3 py-1 text-xs transition-colors`}
  ${(props) =>
    props.active
      ? tw`bg-blue-500 text-white font-medium`
      : tw`bg-gray-100 text-gray-600 hover:bg-gray-200`}
  border-radius: 4px 4px 0 0;
`;

const LighthouseScoresGrid = styled.div`
  ${tw`grid grid-cols-2 gap-2 mb-3`}
`;

const LighthouseScoreItem = styled.div`
  ${tw`p-2 rounded bg-gray-100 text-center`}
`;

const ScoreCircle = styled.div`
  ${tw`w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-1 text-white font-bold text-xs`}
  background-color: ${(props) => {
    if (props.score >= 90) return "#10b981";
    if (props.score >= 50) return "#f59e0b";
    return "#ef4444";
  }}
`;

const ScoreName = styled.div`
  ${tw`text-xs text-gray-600`}
`;

const ActionButtons = styled.div`
  ${tw`flex gap-2 mt-3 pt-3 border-t border-gray-200`}
`;

const ActionButton = styled.button`
  ${tw`flex-1 text-xs bg-blue-500 hover:bg-blue-600 text-white py-1 px-2 rounded transition-colors`}
`;

const ExportButton = styled.button`
  ${tw`flex-1 text-xs bg-green-500 hover:bg-green-600 text-white py-1 px-2 rounded transition-colors`}
`;

const PerformanceMonitor = ({
  isEnabled = import.meta.env?.MODE === "development",
  showInProduction = false,
  enableAutoHide = true,
  autoHideDelay = 10000,
  position = "bottom-right",
  showTooltips = true,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [hoveredMetric, setHoveredMetric] = useState(null);
  const [autoHideTimer, setAutoHideTimer] = useState(null);
  const [selectedTab, setSelectedTab] = useState("metrics"); // 'metrics' ou 'lighthouse'

  const { isFeatureEnabled } = useEnvironment();
  const isPerformanceMonitoringEnabled = isFeatureEnabled(
    "performanceMonitoring"
  );
  const shouldShow = isEnabled && isPerformanceMonitoringEnabled;

  const performanceMonitoring = usePerformanceMonitoring();
  const { useMemoryCache } = usePerformanceOptimizations();
  const cache = useMemoryCache();

  const metrics = performanceMonitoring.getMetrics();
  const overallScore = performanceMonitoring.performanceScore;
  const lighthouseScores = performanceMonitoring.getLighthouseScores();

  useEffect(() => {
    if (metrics.length > 0 && !isVisible && shouldShow) {
      setIsVisible(true);

      if (enableAutoHide) {
        if (autoHideTimer) clearTimeout(autoHideTimer);
        const timer = setTimeout(() => {
          setIsMinimized(true);
        }, autoHideDelay);
        setAutoHideTimer(timer);
      }
    }
  }, [metrics, isVisible, shouldShow, enableAutoHide, autoHideDelay]);

  const formatMetricValue = (name, value) => {
    switch (name) {
      case "CLS":
        return value.toFixed(3);
      case "LCP":
      case "FCP":
      case "FID":
      case "TTFB":
      case "TTI":
      case "TBT":
      case "SI":
        return `${Math.round(value)}ms`;
      default:
        return Math.round(value);
    }
  };

  const getTooltip = (metricName) => {
    const tooltips = {
      LCP: "Tempo de carregamento do maior elemento visível",
      FID: "Tempo de resposta à primeira interação",
      CLS: "Estabilidade visual da página",
      FCP: "Tempo para o primeiro conteúdo aparecer",
      TTFB: "Tempo de resposta do servidor",
      TTI: "Tempo até a interatividade completa",
      SI: "Velocidade de exibição visual",
      TBT: "Tempo de bloqueio do thread principal",
      performance: "Desempenho geral",
      accessibility: "Acessibilidade",
      bestPractices: "Boas práticas de desenvolvimento",
      seo: "Otimização para buscadores",
    };
    return tooltips[metricName] || "";
  };

  const handleExportData = () => {
    const data = performanceMonitoring.exportLighthouseData();
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `lighthouse-data-${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleClearCache = () => {
    cache.clear();
    localStorage.removeItem("webVitals");
    localStorage.removeItem("performance_cache");

    if (confirm("Limpar cache de performance? A página será recarregada.")) {
      window.location.reload();
    }
  };

  useEffect(() => {
    return () => {
      if (autoHideTimer) {
        clearTimeout(autoHideTimer);
      }
    };
  }, [autoHideTimer]);

  if (!shouldShow || !isVisible) {
    return null;
  }

  return (
    <MonitorContainer
      isMinimized={isMinimized}
      onClick={isMinimized ? () => setIsMinimized(false) : undefined}
      style={{
        bottom: position.includes("bottom") ? "1rem" : "auto",
        top: position.includes("top") ? "1rem" : "auto",
        right: position.includes("right") ? "1rem" : "auto",
        left: position.includes("left") ? "1rem" : "auto",
      }}
    >
      <Header onClick={() => setIsMinimized(!isMinimized)}>
        <Title>Lighthouse Monitor</Title>
        <ToggleButton>{isMinimized ? "▲" : "▼"}</ToggleButton>
      </Header>

      {!isMinimized && (
        <>
          <Tabs>
            <Tab
              active={selectedTab === "metrics"}
              onClick={() => setSelectedTab("metrics")}
            >
              Web Vitals
            </Tab>
            <Tab
              active={selectedTab === "lighthouse"}
              onClick={() => setSelectedTab("lighthouse")}
            >
              Lighthouse
            </Tab>
          </Tabs>

          {selectedTab === "metrics" && (
            <>
              <ScoreContainer>
                <div>
                  <OverallScore score={overallScore || 0}>
                    {overallScore || 0}
                  </OverallScore>
                  <ScoreLabel>Score de Performance</ScoreLabel>
                </div>
                <div style={{ fontSize: "10px", color: "#6b7280" }}>
                  {metrics.length} métricas coletadas
                </div>
              </ScoreContainer>

              <MetricsList>
                {metrics.map((metric) => (
                  <MetricItem
                    key={metric.name}
                    onMouseEnter={() =>
                      showTooltips && setHoveredMetric(metric.name)
                    }
                    onMouseLeave={() => setHoveredMetric(null)}
                    style={{ position: "relative" }}
                  >
                    <MetricName>{metric.name}</MetricName>
                    <MetricValue rating={metric.rating}>
                      {formatMetricValue(metric.name, metric.value)}
                    </MetricValue>

                    {showTooltips && hoveredMetric === metric.name && (
                      <Tooltip>{getTooltip(metric.name)}</Tooltip>
                    )}
                  </MetricItem>
                ))}
              </MetricsList>
            </>
          )}

          {selectedTab === "lighthouse" && (
            <>
              <LighthouseScoresGrid>
                {Object.entries(lighthouseScores).map(([key, score]) => (
                  <LighthouseScoreItem
                    key={key}
                    onMouseEnter={() => showTooltips && setHoveredMetric(key)}
                    onMouseLeave={() => setHoveredMetric(null)}
                    style={{ position: "relative" }}
                  >
                    <ScoreCircle score={score || 0}>{score || 0}</ScoreCircle>
                    <ScoreName>
                      {key === "performance"
                        ? "Desempenho"
                        : key === "accessibility"
                          ? "Acessibilidade"
                          : key === "bestPractices"
                            ? "Boas Práticas"
                            : key === "seo"
                              ? "SEO"
                              : key}
                    </ScoreName>

                    {showTooltips && hoveredMetric === key && (
                      <Tooltip>{getTooltip(key)}</Tooltip>
                    )}
                  </LighthouseScoreItem>
                ))}
              </LighthouseScoresGrid>

              <p
                style={{
                  fontSize: "12px",
                  color: "#6b7280",
                  marginBottom: "12px",
                  textAlign: "center",
                }}
              >
                Os scores do Lighthouse são estimativas baseadas nas métricas
                coletadas no navegador.
              </p>
            </>
          )}

          <ActionButtons>
            <ActionButton onClick={handleClearCache}>Limpar Cache</ActionButton>
            <ExportButton onClick={handleExportData}>
              Exportar Relatório
            </ExportButton>
          </ActionButtons>
        </>
      )}
    </MonitorContainer>
  );
};

PerformanceMonitor.propTypes = {
  isEnabled: PropTypes.bool,
  showInProduction: PropTypes.bool,
  enableAutoHide: PropTypes.bool,
  autoHideDelay: PropTypes.number,
  position: PropTypes.oneOf([
    "top-left",
    "top-right",
    "bottom-left",
    "bottom-right",
  ]),
  showTooltips: PropTypes.bool,
};

export default PerformanceMonitor;
