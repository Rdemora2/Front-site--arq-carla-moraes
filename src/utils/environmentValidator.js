import {
  config,
  validateEnvironment,
  isAnalyticsConfigured,
} from "../config/environment";

export class EnvironmentValidator {
  constructor() {
    this.errors = [];
    this.warnings = [];
  }

  validate() {
    this.validateBasicConfig();
    this.validateAnalytics();
    this.validateUrls();
    this.validateFeatureFlags();
    this.validateSecurity();

    return {
      isValid: this.errors.length === 0,
      errors: this.errors,
      warnings: this.warnings,
      summary: this.generateSummary(),
    };
  }

  validateBasicConfig() {
    if (!config.siteName) {
      this.errors.push("VITE_SITE_NAME é obrigatória");
    }

    if (!config.siteDescription) {
      this.errors.push("VITE_SITE_DESCRIPTION é obrigatória");
    }

    if (!config.baseUrl) {
      this.errors.push(
        `URL base não configurada para o ambiente ${config.currentMode}`
      );
    }
  }

  validateAnalytics() {
    if (config.enableAnalytics && config.isProduction) {
      if (!isAnalyticsConfigured()) {
        this.warnings.push(
          "Analytics habilitado mas nenhum provedor válido configurado"
        );
      }

      if (config.googleAnalyticsId) {
        if (!config.hasValidGoogleAnalytics()) {
          this.errors.push(
            'Google Analytics ID inválido - deve começar com "G-"'
          );
        }
      }

      if (config.facebookPixelId) {
        if (!config.hasValidFacebookPixel()) {
          this.errors.push(
            "Facebook Pixel ID inválido - deve conter apenas números"
          );
        }
      }
    }
  }

  validateUrls() {
    const urlFields = [
      {
        key: "VITE_PROD_URL",
        value: config.baseUrl,
        required: config.isProduction,
      },
      { key: "VITE_API_URL", value: config.apiUrl, required: false },
    ];

    urlFields.forEach(({ key, value, required }) => {
      if (required && !value) {
        this.errors.push(`${key} é obrigatória em ${config.currentMode}`);
      }

      if (value && !this.isValidUrl(value)) {
        this.errors.push(`${key} não é uma URL válida: ${value}`);
      }
    });
  }

  validateFeatureFlags() {
    if (config.isProduction) {
      const devFeatures = [
        { flag: "enableDebugMode", name: "Debug Mode" },
        { flag: "enableVerboseLogging", name: "Verbose Logging" },
        { flag: "enableConsoleLogs", name: "Console Logs" },
      ];

      devFeatures.forEach(({ flag, name }) => {
        if (config[flag]) {
          this.warnings.push(`${name} está habilitado em produção`);
        }
      });
    }

    if (config.isProduction) {
      const prodFeatures = [
        { flag: "enableCompression", name: "Compressão" },
        { flag: "enableCache", name: "Cache" },
        { flag: "enableSecurityHeaders", name: "Security Headers" },
      ];

      prodFeatures.forEach(({ flag, name }) => {
        if (!config[flag]) {
          this.warnings.push(`${name} está desabilitado em produção`);
        }
      });
    }
  }

  validateSecurity() {
    if (config.isProduction) {
      if (!config.enableCsp) {
        this.warnings.push("Content Security Policy (CSP) não está habilitado");
      }

      if (!config.enableCorsValidation) {
        this.warnings.push("Validação CORS não está habilitada");
      }
    }
  }

  isValidUrl(string) {
    try {
      new URL(string);
      return true;
    } catch {
      return false;
    }
  }

  generateSummary() {
    return {
      environment: config.currentMode,
      analyticsConfigured: isAnalyticsConfigured(),
      totalErrors: this.errors.length,
      totalWarnings: this.warnings.length,
      readyForProduction: this.errors.length === 0 && config.isProduction,
    };
  }
}

export const validateCurrentEnvironment = () => {
  const validator = new EnvironmentValidator();
  return validator.validate();
};

export const initEnvironmentValidation = () => {
  if (config.isDevelopment && !window.__ENV_VALIDATION_INITIALIZED__) {
    const result = validateCurrentEnvironment();

    console.group("🔍 Environment Validation");

    if (result.errors.length > 0) {
      console.error("❌ Erros encontrados:", result.errors);
    }

    if (result.warnings.length > 0) {
      console.warn("⚠️ Avisos:", result.warnings);
    }

    if (result.isValid) {
      console.log("✅ Configuração válida para", result.summary.environment);
    }

    console.log("📊 Resumo:", result.summary);
    console.groupEnd();

    window.__ENV_VALIDATION_INITIALIZED__ = true;
    return result;
  }
};

export default EnvironmentValidator;
