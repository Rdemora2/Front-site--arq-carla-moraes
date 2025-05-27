import React from 'react';
import { render } from '@testing-library/react';
import { MetaTags } from '../../components/misc/MetaTags';

// Mock do environment config
jest.mock('../../config/environment', () => ({
  config: {
    site: {
      url: 'https://arqcarlamoraes.com.br',
      name: 'Carla Moraes Arquitetura Paisagística',
    },
  },
  getAbsoluteUrl: jest.fn((url) => `https://arqcarlamoraes.com.br${url}`),
}));

describe('MetaTags', () => {
  // Mock do document.head para verificar tags meta
  let mockHead;
  
  beforeEach(() => {
    // Limpa o head antes de cada teste
    document.head.innerHTML = '';
    mockHead = document.head;
  });

  afterEach(() => {
    // Limpa as tags criadas após cada teste
    document.head.innerHTML = '';
  });

  it('deve renderizar tags meta básicas', () => {
    render(<MetaTags />);

    expect(document.title).toBe('Carla Moraes - Arquitetura paisagística');
    expect(document.querySelector('meta[name="description"]')).toHaveAttribute(
      'content',
      'Há mais de 25 anos criando projetos paisagísticos exclusivos que harmonizam arquitetura e natureza'
    );
  });

  it('deve aceitar props customizadas', () => {
    render(
      <MetaTags
        title="Título Customizado"
        description="Descrição customizada para teste"
        keywords="teste, custom, seo"
      />
    );

    expect(document.title).toBe('Título Customizado');
    expect(document.querySelector('meta[name="description"]')).toHaveAttribute(
      'content',
      'Descrição customizada para teste'
    );
    expect(document.querySelector('meta[name="keywords"]')).toHaveAttribute(
      'content',
      'teste, custom, seo'
    );
  });

  it('deve truncar título longo', () => {
    const longTitle = 'Este é um título muito longo que deve ser truncado automaticamente pelo componente para não passar de 60 caracteres';
    
    render(<MetaTags title={longTitle} />);

    const title = document.title;
    expect(title.length).toBeLessThanOrEqual(60);
    expect(title).toMatch(/\.\.\.$/);
  });

  it('deve truncar descrição longa', () => {
    const longDescription = 'Esta é uma descrição muito longa que deve ser truncada automaticamente pelo componente para não passar de 160 caracteres conforme as boas práticas de SEO recomendadas pelos motores de busca principais como Google e Bing';
    
    render(<MetaTags description={longDescription} />);

    const description = document.querySelector('meta[name="description"]').content;
    expect(description.length).toBeLessThanOrEqual(160);
    expect(description).toMatch(/\.\.\.$/);
  });

  it('deve gerar tags Open Graph', () => {
    render(
      <MetaTags
        title="Título OG"
        description="Descrição OG"
        image="/images/og-image.jpg"
        url="/sobre"
        type="article"
      />
    );

    expect(document.querySelector('meta[property="og:title"]')).toHaveAttribute(
      'content',
      'Título OG'
    );
    expect(document.querySelector('meta[property="og:description"]')).toHaveAttribute(
      'content',
      'Descrição OG'
    );
    expect(document.querySelector('meta[property="og:type"]')).toHaveAttribute(
      'content',
      'article'
    );
    expect(document.querySelector('meta[property="og:url"]')).toHaveAttribute(
      'content',
      'https://arqcarlamoraes.com.br/sobre'
    );
  });

  it('deve gerar tags Twitter Card', () => {
    render(
      <MetaTags
        title="Título Twitter"
        description="Descrição Twitter"
        twitterCardType="summary_large_image"
      />
    );

    expect(document.querySelector('meta[name="twitter:card"]')).toHaveAttribute(
      'content',
      'summary_large_image'
    );
    expect(document.querySelector('meta[name="twitter:title"]')).toHaveAttribute(
      'content',
      'Título Twitter'
    );
    expect(document.querySelector('meta[name="twitter:description"]')).toHaveAttribute(
      'content',
      'Descrição Twitter'
    );
  });

  it('deve gerar structured data JSON-LD', () => {
    const structuredData = {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'Carla Moraes Arquitetura',
    };

    render(<MetaTags structuredData={structuredData} />);

    const jsonLdScript = document.querySelector('script[type="application/ld+json"]');
    expect(jsonLdScript).toBeTruthy();
    expect(JSON.parse(jsonLdScript.textContent)).toEqual(structuredData);
  });

  it('deve gerar structured data padrão quando não fornecido', () => {
    render(<MetaTags />);

    const jsonLdScript = document.querySelector('script[type="application/ld+json"]');
    expect(jsonLdScript).toBeTruthy();
    
    const data = JSON.parse(jsonLdScript.textContent);
    expect(data['@type']).toBe('Organization');
    expect(data.name).toBe('Carla Moraes Arquitetura Paisagística');
  });

  it('deve configurar robots corretamente', () => {
    render(<MetaTags robots="noindex, nofollow" />);

    expect(document.querySelector('meta[name="robots"]')).toHaveAttribute(
      'content',
      'noindex, nofollow'
    );
  });

  it('deve configurar viewport', () => {
    render(<MetaTags viewport="width=device-width, initial-scale=1.0, user-scalable=no" />);

    expect(document.querySelector('meta[name="viewport"]')).toHaveAttribute(
      'content',
      'width=device-width, initial-scale=1.0, user-scalable=no'
    );
  });

  it('deve configurar theme-color', () => {
    render(<MetaTags themeColor="#ff0000" />);

    expect(document.querySelector('meta[name="theme-color"]')).toHaveAttribute(
      'content',
      '#ff0000'
    );
  });

  it('deve gerar links de preconnect', () => {
    render(<MetaTags />);

    const preconnects = document.querySelectorAll('link[rel="preconnect"]');
    expect(preconnects.length).toBeGreaterThan(0);
    
    // Verifica se tem preconnect para Google Fonts
    const googleFontsPreconnect = Array.from(preconnects).find(
      link => link.href === 'https://fonts.googleapis.com'
    );
    expect(googleFontsPreconnect).toBeTruthy();
  });

  it('deve gerar links de dns-prefetch', () => {
    render(<MetaTags />);

    const dnsPrefetch = document.querySelectorAll('link[rel="dns-prefetch"]');
    expect(dnsPrefetch.length).toBeGreaterThan(0);
  });

  it('deve gerar links de favicon completos', () => {
    render(<MetaTags />);

    expect(document.querySelector('link[rel="icon"][sizes="32x32"]')).toBeTruthy();
    expect(document.querySelector('link[rel="icon"][sizes="16x16"]')).toBeTruthy();
    expect(document.querySelector('link[rel="apple-touch-icon"]')).toBeTruthy();
    expect(document.querySelector('link[rel="manifest"]')).toBeTruthy();
  });

  it('deve gerar breadcrumbs structured data', () => {
    const breadcrumbs = [
      { name: 'Home', url: '/' },
      { name: 'Projetos', url: '/projetos' },
      { name: 'Jardim Tropical', url: '/projetos/jardim-tropical' },
    ];

    render(<MetaTags breadcrumbs={breadcrumbs} />);

    const scripts = document.querySelectorAll('script[type="application/ld+json"]');
    const breadcrumbScript = Array.from(scripts).find(script => {
      const data = JSON.parse(script.textContent);
      return data['@type'] === 'BreadcrumbList';
    });

    expect(breadcrumbScript).toBeTruthy();
    
    const breadcrumbData = JSON.parse(breadcrumbScript.textContent);
    expect(breadcrumbData.itemListElement).toHaveLength(3);
  });

  it('deve sanitizar dados de entrada', () => {
    render(
      <MetaTags
        title="<script>alert('xss')</script>Título Seguro"
        description="<img src=x onerror=alert('xss')>Descrição segura"
      />
    );

    expect(document.title).not.toContain('<script>');
    expect(document.title).toContain('Título Seguro');
    
    const description = document.querySelector('meta[name="description"]').content;
    expect(description).not.toContain('<img');
    expect(description).toContain('Descrição segura');
  });

  it('deve configurar alternates para múltiplos idiomas', () => {
    const alternates = [
      { hreflang: 'en', href: '/en' },
      { hreflang: 'es', href: '/es' },
    ];

    render(<MetaTags alternates={alternates} />);

    const alternateLinks = document.querySelectorAll('link[rel="alternate"]');
    expect(alternateLinks).toHaveLength(2);
    
    expect(alternateLinks[0]).toHaveAttribute('hreflang', 'en');
    expect(alternateLinks[1]).toHaveAttribute('hreflang', 'es');
  });

  it('deve gerar informações de contato structured data', () => {
    const contactPoint = {
      telephone: '+55-11-99999-9999',
      email: 'contato@exemplo.com',
    };

    render(<MetaTags contactPoint={contactPoint} />);

    const scripts = document.querySelectorAll('script[type="application/ld+json"]');
    const orgScript = Array.from(scripts).find(script => {
      const data = JSON.parse(script.textContent);
      return data['@type'] === 'Organization' && data.contactPoint;
    });

    expect(orgScript).toBeTruthy();
    
    const orgData = JSON.parse(orgScript.textContent);
    expect(orgData.contactPoint.telephone).toBe('+55-11-99999-9999');
    expect(orgData.contactPoint.email).toBe('contato@exemplo.com');
  });

  it('deve limpar tags antigas ao re-renderizar', () => {
    const { rerender } = render(<MetaTags title="Título 1" />);
    
    expect(document.title).toBe('Título 1');
    
    rerender(<MetaTags title="Título 2" />);
    
    expect(document.title).toBe('Título 2');
    // Não deve ter tags duplicadas
    expect(document.querySelectorAll('meta[name="description"]')).toHaveLength(1);
  });

  it('deve validar PropTypes', () => {
    const originalError = console.error;
    console.error = jest.fn();

    render(
      <MetaTags
        title={123} // Deve ser string
        description={true} // Deve ser string
        alternates="invalid" // Deve ser array
      />
    );

    expect(console.error).toHaveBeenCalled();
    console.error = originalError;
  });

  it('deve funcionar sem props (valores padrão)', () => {
    expect(() => {
      render(<MetaTags />);
    }).not.toThrow();

    expect(document.title).toBe('Carla Moraes - Arquitetura paisagística');
  });
});
