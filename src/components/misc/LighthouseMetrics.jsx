import React, { useState, useEffect } from "react";
import usePerformanceMonitoring from "../../hooks/usePerformanceMonitoring";
import { useEnvironment } from "../../hooks/useEnvironment";
import styled from "styled-components";
import LighthouseDetailedReport from "./LighthouseDetailedReport";

const MetricsContainer = styled.div`
  position: fixed;
  bottom: ${(props) => (props.$isOpen ? "0" : "-400px")};
  right: 20px;
  width: 340px;
  background: rgba(30, 32, 40, 0.95);
  border-radius: 8px 8px 0 0;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.3);
  color: #fff;
  font-family:
    system-ui,
    -apple-system,
    sans-serif;
  transition: bottom 0.3s ease;
  z-index: 9999;
`;

const MetricsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  cursor: pointer;
`;

const DetailButton = styled.button`
  background: rgba(80, 120, 255, 0.8);
  color: white;
  border: none;
  border-radius: 4px;
  padding: 4px 8px;
  font-size: 12px;
  margin-right: 10px;
  cursor: pointer;

  &:hover {
    background: rgba(100, 140, 255, 0.9);
  }
`;

const MetricsTitle = styled.h3`
  margin: 0;
  font-size: 14px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const MetricsContent = styled.div`
  padding: 16px;
  max-height: 350px;
  overflow-y: auto;
`;

const ScoreGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
  margin-bottom: 16px;
`;

const ScoreCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px 8px;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.08);
`;

const ScoreCircle = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 700;
  font-size: 14px;
  margin-bottom: 8px;
  background: ${(props) => {
    if (props.$score >= 90) return "rgba(0, 200, 100, 0.8)";
    if (props.$score >= 50) return "rgba(255, 160, 0, 0.8)";
    return "rgba(255, 80, 80, 0.8)";
  }};
`;

const ScoreLabel = styled.span`
  font-size: 12px;
  opacity: 0.8;
  text-align: center;
`;

const MetricsList = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 8px;
`;

const MetricItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.08);
`;

const MetricName = styled.div`
  font-size: 13px;
  display: flex;
  align-items: center;
  gap: 6px;
`;

const MetricValue = styled.div`
  font-weight: 500;
  font-size: 13px;
  color: ${(props) => {
    if (props.$rating === "good") return "#4caf50";
    if (props.$rating === "needs-improvement") return "#ff9800";
    return "#f44336";
  }};
`;

const StatusDot = styled.span`
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-right: 4px;
  background-color: ${(props) => {
    if (props.$rating === "good") return "#4caf50";
    if (props.$rating === "needs-improvement") return "#ff9800";
    return "#f44336";
  }};
`;

const LighthouseMetrics = ({ showInDevelopment = true }) => {
  const { getMetrics, getLighthouseScores, score } = usePerformanceMonitoring();
  const { isFeatureEnabled, isDevelopment } = useEnvironment();

  const [isOpen, setIsOpen] = useState(false);
  const [showDetailedReport, setShowDetailedReport] = useState(false);
  const [metrics, setMetrics] = useState([]);
  const [scores, setScores] = useState({
    performance: null,
    accessibility: null,
    bestPractices: null,
    seo: null,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const currentMetrics = Object.values(getMetrics());
      if (currentMetrics.length > 0) {
        setMetrics(currentMetrics);
      }

      const currentScores = getLighthouseScores();
      if (currentScores.performance) {
        setScores(currentScores);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [getMetrics, getLighthouseScores]);

  const isLighthouseMonitorEnabled = isFeatureEnabled("lighthouseMonitor");
  const shouldShow =
    (isDevelopment && showInDevelopment) || isLighthouseMonitorEnabled;

  if (!shouldShow) {
    return null;
  }

  // Métricas a serem exibidas, na ordem
  const metricOrder = ["LCP", "FID", "CLS", "FCP", "TTFB", "TTI", "TBT", "SI"];
  const sortedMetrics = metricOrder
    .map((metricName) => metrics.find((m) => m.name === metricName))
    .filter(Boolean);

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
  return (
    <>
      <MetricsContainer $isOpen={isOpen}>
        <MetricsHeader>
          <MetricsTitle onClick={() => setIsOpen(!isOpen)}>
            <svg
              width="16"
              height="16"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="#fff"
            >
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h2v2h-2v-2zm0-10h2v8h-2V7z" />
            </svg>
            Lighthouse Metrics
          </MetricsTitle>
          <div>
            <DetailButton
              onClick={(e) => {
                e.stopPropagation();
                setShowDetailedReport(true);
              }}
            >
              Relatório Detalhado
            </DetailButton>
            <span onClick={() => setIsOpen(!isOpen)}>{isOpen ? "▼" : "▲"}</span>
          </div>
        </MetricsHeader>
        {isOpen && (
          <MetricsContent>
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
                  <ScoreCard key={key}>
                    <ScoreCircle $score={value}>{value}</ScoreCircle>
                    <ScoreLabel>{label}</ScoreLabel>
                  </ScoreCard>
                );
              })}
            </ScoreGrid>

            <MetricsList>
              {sortedMetrics.map((metric) => (
                <MetricItem key={metric.name}>
                  <MetricName>
                    <StatusDot $rating={metric.rating} />
                    {metricLabels[metric.name] || metric.name}
                  </MetricName>
                  <MetricValue $rating={metric.rating}>
                    {metric.value}
                    {metric.unit}
                  </MetricValue>
                </MetricItem>
              ))}
            </MetricsList>
          </MetricsContent>
        )}{" "}
      </MetricsContainer>
      {showDetailedReport && (
        <LighthouseDetailedReport
          isOpen={showDetailedReport}
          onClose={() => setShowDetailedReport(false)}
        />
      )}
    </>
  );
};

export default LighthouseMetrics;
