import { renderHook, act } from '@testing-library/react';
import { useFormValidation, validationRules } from '../../hooks/useFormValidation';

describe('useFormValidation', () => {
  describe('validationRules', () => {
    describe('required', () => {
      it('deve retornar erro para valor vazio', () => {
        expect(validationRules.required('')).toBe('Este campo é obrigatório');
        expect(validationRules.required(null)).toBe('Este campo é obrigatório');
        expect(validationRules.required(undefined)).toBe('Este campo é obrigatório');
        expect(validationRules.required('   ')).toBe('Este campo é obrigatório');
      });

      it('deve retornar null para valor válido', () => {
        expect(validationRules.required('valor')).toBeNull();
        expect(validationRules.required('  valor  ')).toBeNull();
      });
    });

    describe('email', () => {
      it('deve validar emails corretos', () => {
        expect(validationRules.email('test@example.com')).toBeNull();
        expect(validationRules.email('user.name@domain.co.uk')).toBeNull();
        expect(validationRules.email('user+tag@example.org')).toBeNull();
      });

      it('deve rejeitar emails inválidos', () => {
        expect(validationRules.email('invalid-email')).toBe('Por favor, insira um email válido');
        expect(validationRules.email('test@')).toBe('Por favor, insira um email válido');
        expect(validationRules.email('@domain.com')).toBe('Por favor, insira um email válido');
        expect(validationRules.email('test.domain.com')).toBe('Por favor, insira um email válido');
      });

      it('deve permitir valores vazios', () => {
        expect(validationRules.email('')).toBeNull();
        expect(validationRules.email(null)).toBeNull();
      });
    });

    describe('phone', () => {
      it('deve validar telefones brasileiros', () => {
        expect(validationRules.phone('(11) 99999-9999')).toBeNull();
        expect(validationRules.phone('11999999999')).toBeNull();
        expect(validationRules.phone('+5511999999999')).toBeNull();
        expect(validationRules.phone('11 99999-9999')).toBeNull();
      });

      it('deve rejeitar telefones inválidos', () => {
        expect(validationRules.phone('123')).toBe('Por favor, insira um telefone válido');
        expect(validationRules.phone('11999999')).toBe('Por favor, insira um telefone válido');
        expect(validationRules.phone('abc123456789')).toBe('Por favor, insira um telefone válido');
      });
    });

    describe('minLength', () => {
      it('deve validar comprimento mínimo', () => {
        const minLength5 = validationRules.minLength(5);
        expect(minLength5('12345')).toBeNull();
        expect(minLength5('123456')).toBeNull();
        expect(minLength5('1234')).toBe('Este campo deve ter pelo menos 5 caracteres');
      });
    });

    describe('maxLength', () => {
      it('deve validar comprimento máximo', () => {
        const maxLength10 = validationRules.maxLength(10);
        expect(maxLength10('1234567890')).toBeNull();
        expect(maxLength10('123456789')).toBeNull();
        expect(maxLength10('12345678901')).toBe('Este campo deve ter no máximo 10 caracteres');
      });
    });
  });

  describe('useFormValidation hook', () => {
    const schema = {
      name: [validationRules.required, validationRules.minLength(2)],
      email: [validationRules.required, validationRules.email],
      phone: [validationRules.phone],
    };

    it('deve inicializar com estado vazio', () => {
      const { result } = renderHook(() => useFormValidation(schema));

      expect(result.current.values).toEqual({});
      expect(result.current.errors).toEqual({});
      expect(result.current.touched).toEqual({});
      expect(result.current.isValid).toBe(false);
      expect(result.current.isSubmitting).toBe(false);
    });

    it('deve atualizar valores e validar', () => {
      const { result } = renderHook(() => useFormValidation(schema));

      act(() => {
        result.current.setValue('name', 'João');
      });

      expect(result.current.values.name).toBe('João');
      expect(result.current.errors.name).toBeUndefined();
      expect(result.current.touched.name).toBe(true);
    });

    it('deve mostrar erros de validação', () => {
      const { result } = renderHook(() => useFormValidation(schema));

      act(() => {
        result.current.setValue('name', '');
      });

      expect(result.current.errors.name).toBe('Este campo é obrigatório');

      act(() => {
        result.current.setValue('email', 'email-inválido');
      });

      expect(result.current.errors.email).toBe('Por favor, insira um email válido');
    });

    it('deve validar todos os campos', () => {
      const { result } = renderHook(() => useFormValidation(schema));

      act(() => {
        result.current.setValue('name', 'João Silva');
        result.current.setValue('email', 'joao@email.com');
        result.current.setValue('phone', '(11) 99999-9999');
      });

      act(() => {
        const isValid = result.current.validateAll();
        expect(isValid).toBe(true);
      });

      expect(result.current.isValid).toBe(true);
      expect(Object.keys(result.current.errors)).toHaveLength(0);
    });

    it('deve resetar o formulário', () => {
      const { result } = renderHook(() => useFormValidation(schema));

      act(() => {
        result.current.setValue('name', 'João');
        result.current.setValue('email', 'joao@email.com');
      });

      act(() => {
        result.current.reset();
      });

      expect(result.current.values).toEqual({});
      expect(result.current.errors).toEqual({});
      expect(result.current.touched).toEqual({});
      expect(result.current.isValid).toBe(false);
    });

    it('deve lidar com validação assíncrona', async () => {
      const asyncValidation = jest.fn().mockResolvedValue(null);
      const schemaWithAsync = {
        username: [asyncValidation],
      };

      const { result } = renderHook(() => useFormValidation(schemaWithAsync));

      await act(async () => {
        await result.current.setValue('username', 'testuser');
      });

      expect(asyncValidation).toHaveBeenCalledWith('testuser');
    });

    it('deve sanitizar valores', () => {
      const { result } = renderHook(() => useFormValidation(schema));

      act(() => {
        result.current.setValue('name', '  João Silva  ');
      });

      expect(result.current.values.name).toBe('João Silva');
    });

    it('deve formatar telefone', () => {
      const { result } = renderHook(() => useFormValidation(schema));

      act(() => {
        result.current.setValue('phone', '11999999999');
      });

      expect(result.current.values.phone).toBe('(11) 99999-9999');
    });

    it('deve validar condicionalmente', () => {
      const conditionalSchema = {
        hasAddress: [],
        address: {
          rules: [validationRules.required],
          condition: (values) => values.hasAddress === true,
        },
      };

      const { result } = renderHook(() => useFormValidation(conditionalSchema));

      // Sem condição, endereço não é obrigatório
      act(() => {
        result.current.setValue('hasAddress', false);
        const isValid = result.current.validateAll();
        expect(isValid).toBe(true);
      });

      // Com condição, endereço é obrigatório
      act(() => {
        result.current.setValue('hasAddress', true);
        const isValid = result.current.validateAll();
        expect(isValid).toBe(false);
      });

      expect(result.current.errors.address).toBe('Este campo é obrigatório');
    });

    it('deve gerenciar estado de submissão', () => {
      const { result } = renderHook(() => useFormValidation(schema));

      act(() => {
        result.current.setSubmitting(true);
      });

      expect(result.current.isSubmitting).toBe(true);

      act(() => {
        result.current.setSubmitting(false);
      });

      expect(result.current.isSubmitting).toBe(false);
    });

    it('deve calcular progresso de preenchimento', () => {
      const { result } = renderHook(() => useFormValidation(schema));

      expect(result.current.progress).toBe(0);

      act(() => {
        result.current.setValue('name', 'João');
      });

      expect(result.current.progress).toBe(33.33);

      act(() => {
        result.current.setValue('email', 'joao@email.com');
      });

      expect(result.current.progress).toBe(66.67);

      act(() => {
        result.current.setValue('phone', '(11) 99999-9999');
      });

      expect(result.current.progress).toBe(100);
    });
  });
});
