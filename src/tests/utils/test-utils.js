import React from 'react';
import { render } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import GlobalStyles from '../../GlobalStyles';
import 'twin.macro';

// Mock do theme para testes
const mockTheme = {
  colors: {
    primary: {
      500: '#3e4d2c',
      600: '#2d3d20',
      700: '#1c2b14',
    },
    secondary: {
      500: '#6b8e23',
      600: '#556b1e',
      700: '#3f4f19',
    },
    gray: {
      100: '#f7fafc',
      500: '#a0aec0',
      600: '#718096',
      800: '#2d3748',
    },
    red: {
      500: '#ef4444',
      600: '#dc2626',
    },
    green: {
      500: '#10b981',
      600: '#059669',
    },
  },
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
  },
  spacing: {
    1: '0.25rem',
    2: '0.5rem',
    3: '0.75rem',
    4: '1rem',
    5: '1.25rem',
    6: '1.5rem',
    8: '2rem',
    10: '2.5rem',
    12: '3rem',
    16: '4rem',
    20: '5rem',
    24: '6rem',
    32: '8rem',
  },
  fontSizes: {
    xs: '0.75rem',
    sm: '0.875rem',
    base: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
    '4xl': '2.25rem',
  },
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  },
};

/**
 * Renderizador customizado que inclui providers necessários
 */
const AllTheProviders = ({ children }) => {
  return (
    <ThemeProvider theme={mockTheme}>
      <GlobalStyles />
      {children}
    </ThemeProvider>
  );
};

/**
 * Re-export tudo do testing-library
 */
export * from '@testing-library/react';
export { userEvent } from '@testing-library/user-event';

/**
 * Override do método render para incluir providers
 */
export const customRender = (ui, options) =>
  render(ui, { wrapper: AllTheProviders, ...options });

/**
 * Helper para criar eventos de formulário
 */
export const createFormEvent = (name, value) => ({
  target: { name, value },
  preventDefault: jest.fn(),
  stopPropagation: jest.fn(),
});

/**
 * Helper para simular delay em testes assíncronos
 */
export const waitFor = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Helper para mock de intersection observer
 */
export const mockIntersectionObserver = (isIntersecting = true) => {
  const mockObserver = jest.fn();
  const mockUnobserve = jest.fn();
  const mockDisconnect = jest.fn();

  window.IntersectionObserver = jest.fn(() => ({
    observe: mockObserver,
    unobserve: mockUnobserve,
    disconnect: mockDisconnect,
  }));

  // Simula a callback do intersection observer
  const mockCallback = (entries) => {
    entries.forEach(entry => {
      entry.isIntersecting = isIntersecting;
    });
  };

  return {
    observer: mockObserver,
    unobserve: mockUnobserve,
    disconnect: mockDisconnect,
    trigger: (element) => {
      const callback = window.IntersectionObserver.mock.calls[0][0];
      callback([{ target: element, isIntersecting }]);
    },
  };
};

/**
 * Helper para mock de resize observer
 */
export const mockResizeObserver = () => {
  const mockObserver = jest.fn();
  const mockUnobserve = jest.fn();
  const mockDisconnect = jest.fn();

  window.ResizeObserver = jest.fn(() => ({
    observe: mockObserver,
    unobserve: mockUnobserve,
    disconnect: mockDisconnect,
  }));

  return {
    observer: mockObserver,
    unobserve: mockUnobserve,
    disconnect: mockDisconnect,
  };
};

/**
 * Helper para mock de media queries
 */
export const mockMatchMedia = (matches = false) => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
      matches,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });
};

/**
 * Helper para mock do analytics
 */
export const mockAnalytics = () => {
  global.gtag = jest.fn();
  global.fbq = jest.fn();
  global.dataLayer = [];
};

/**
 * Helper para testes de acessibilidade
 */
export const testAccessibility = async (component) => {
  const { container } = customRender(component);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
  return results;
};

/**
 * Helper para simular falha de rede
 */
export const mockNetworkError = () => {
  global.fetch = jest.fn().mockRejectedValue(new Error('Network Error'));
};

/**
 * Helper para simular sucesso de rede
 */
export const mockNetworkSuccess = (data = {}) => {
  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: () => Promise.resolve(data),
    text: () => Promise.resolve(JSON.stringify(data)),
  });
};
