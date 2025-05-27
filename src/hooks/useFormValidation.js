import { useState, useCallback, useMemo } from 'react';

export const validationRules = {
  required: (value) => {
    if (!value || (typeof value === 'string' && value.trim() === '')) {
      return 'Este campo é obrigatório';
    }
    return null;
  },

  email: (value) => {
    if (!value) return null;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      return 'Por favor, insira um email válido';
    }
    return null;
  },

  phone: (value) => {
    if (!value) return null;
    // Aceita formatos: (11) 99999-9999, 11999999999, +5511999999999
    const phoneRegex = /^(\+55\s?)?(\(?[0-9]{2}\)?\s?)?[0-9]{4,5}[\s-]?[0-9]{4}$/;
    if (!phoneRegex.test(value.replace(/\s/g, ''))) {
      return 'Por favor, insira um telefone válido';
    }
    return null;
  },

  minLength: (min) => (value) => {
    if (!value) return null;
    if (value.length < min) {
      return `Este campo deve ter pelo menos ${min} caracteres`;
    }
    return null;
  },

  maxLength: (max) => (value) => {
    if (!value) return null;
    if (value.length > max) {
      return `Este campo deve ter no máximo ${max} caracteres`;
    }
    return null;
  },

  pattern: (regex, message) => (value) => {
    if (!value) return null;
    if (!regex.test(value)) {
      return message || 'Formato inválido';
    }
    return null;
  },

  custom: (validatorFn) => (value) => {
    return validatorFn(value);
  },
};

// Configurações de validação por campo comum
export const fieldConfigs = {
  name: {
    rules: [
      validationRules.required,
      validationRules.minLength(2),
      validationRules.maxLength(100),
      validationRules.pattern(
        /^[a-zA-ZÀ-ÿ\s]+$/,
        'Nome deve conter apenas letras e espaços'
      ),
    ],
    sanitize: (value) => value?.trim().replace(/\s+/g, ' '),
  },

  email: {
    rules: [
      validationRules.required,
      validationRules.email,
      validationRules.maxLength(320), // RFC 5321 limit
    ],
    sanitize: (value) => value?.trim().toLowerCase(),
  },

  phone: {
    rules: [
      validationRules.phone,
    ],
    sanitize: (value) => value?.replace(/\D/g, ''), // Remove non-digits for storage
    format: (value) => {
      if (!value) return '';
      const digits = value.replace(/\D/g, '');
      if (digits.length === 11) {
        return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
      }
      return value;
    },
  },

  message: {
    rules: [
      validationRules.required,
      validationRules.minLength(10),
      validationRules.maxLength(2000),
    ],
    sanitize: (value) => value?.trim(),
  },

  privacy: {
    rules: [
      (value) => {
        if (!value) {
          return 'Você deve aceitar a política de privacidade';
        }
        return null;
      },
    ],
  },
};

/**
 * Hook principal para validação de formulários
 */
export const useFormValidation = (initialValues = {}, fieldConfigOverrides = {}) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitAttempted, setSubmitAttempted] = useState(false);

  // Mesclar configurações padrão com overrides
  const finalConfigs = useMemo(() => ({
    ...fieldConfigs,
    ...fieldConfigOverrides,
  }), [fieldConfigOverrides]);

  // Validar um campo específico
  const validateField = useCallback((fieldName, value, allValues = values) => {
    const config = finalConfigs[fieldName];
    if (!config || !config.rules) return null;

    // Aplicar sanitização se definida
    const sanitizedValue = config.sanitize ? config.sanitize(value) : value;

    // Executar todas as regras de validação
    for (const rule of config.rules) {
      const error = rule(sanitizedValue, allValues);
      if (error) {
        return error;
      }
    }

    return null;
  }, [finalConfigs, values]);

  // Validar todos os campos
  const validateForm = useCallback((valuesToValidate = values) => {
    const newErrors = {};
    let isValid = true;

    Object.keys(finalConfigs).forEach(fieldName => {
      const error = validateField(fieldName, valuesToValidate[fieldName], valuesToValidate);
      if (error) {
        newErrors[fieldName] = error;
        isValid = false;
      }
    });

    return { isValid, errors: newErrors };
  }, [finalConfigs, validateField, values]);

  // Atualizar valor de um campo
  const setValue = useCallback((fieldName, value) => {
    setValues(prev => {
      const newValues = { ...prev, [fieldName]: value };
      
      // Validação em tempo real se o campo já foi tocado ou após tentativa de submit
      if (touched[fieldName] || submitAttempted) {
        const error = validateField(fieldName, value, newValues);
        setErrors(prev => ({
          ...prev,
          [fieldName]: error,
        }));
      }

      return newValues;
    });
  }, [touched, submitAttempted, validateField]);

  // Marcar campo como tocado
  const setFieldTouched = useCallback((fieldName, isTouched = true) => {
    setTouched(prev => ({
      ...prev,
      [fieldName]: isTouched,
    }));

    // Validar campo quando tocado
    if (isTouched) {
      const error = validateField(fieldName, values[fieldName]);
      setErrors(prev => ({
        ...prev,
        [fieldName]: error,
      }));
    }
  }, [validateField, values]);

  // Handler para mudança de input
  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    const finalValue = type === 'checkbox' ? checked : value;
    setValue(name, finalValue);
  }, [setValue]);

  // Handler para blur (perda de foco)
  const handleBlur = useCallback((e) => {
    const { name } = e.target;
    setFieldTouched(name, true);
  }, [setFieldTouched]);

  // Formatar valor para exibição
  const getFormattedValue = useCallback((fieldName) => {
    const config = finalConfigs[fieldName];
    const value = values[fieldName];
    
    if (config && config.format) {
      return config.format(value);
    }
    
    return value || '';
  }, [finalConfigs, values]);

  // Obter valor sanitizado para envio
  const getSanitizedValues = useCallback(() => {
    const sanitized = {};
    
    Object.keys(values).forEach(fieldName => {
      const config = finalConfigs[fieldName];
      const value = values[fieldName];
      
      if (config && config.sanitize) {
        sanitized[fieldName] = config.sanitize(value);
      } else {
        sanitized[fieldName] = value;
      }
    });

    return sanitized;
  }, [values, finalConfigs]);

  // Handler para submit
  const handleSubmit = useCallback(async (onSubmit) => {
    setSubmitAttempted(true);
    setIsSubmitting(true);

    try {
      const { isValid, errors: validationErrors } = validateForm();
      setErrors(validationErrors);

      if (!isValid) {
        // Focar no primeiro campo com erro
        const firstErrorField = Object.keys(validationErrors)[0];
        if (firstErrorField) {
          const element = document.querySelector(`[name="${firstErrorField}"]`);
          if (element) {
            element.focus();
          }
        }
        return false;
      }

      // Executar função de submit se fornecida
      if (onSubmit) {
        const sanitizedValues = getSanitizedValues();
        await onSubmit(sanitizedValues);
      }

      return true;
    } catch (error) {
      console.error('Erro no submit:', error);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, [validateForm, getSanitizedValues]);

  // Reset do formulário
  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setSubmitAttempted(false);
    setIsSubmitting(false);
  }, [initialValues]);

  // Verificar se o formulário é válido
  const isFormValid = useMemo(() => {
    const { isValid } = validateForm();
    return isValid;
  }, [validateForm]);

  // Verificar se há mudanças não salvas
  const isDirty = useMemo(() => {
    return JSON.stringify(values) !== JSON.stringify(initialValues);
  }, [values, initialValues]);

  return {
    // Estado
    values,
    errors,
    touched,
    isSubmitting,
    submitAttempted,
    isFormValid,
    isDirty,

    // Funções
    setValue,
    setFieldTouched,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
    validateField,
    validateForm,
    getFormattedValue,
    getSanitizedValues,
  };
};

export default useFormValidation;
