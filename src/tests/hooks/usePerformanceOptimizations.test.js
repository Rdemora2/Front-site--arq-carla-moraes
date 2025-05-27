import { renderHook, act } from '@testing-library/react';
import { usePerformanceOptimizations } from '../../hooks/usePerformanceOptimizations';
import { mockIntersectionObserver, mockResizeObserver } from '../utils/test-utils';

// Mock do requestIdleCallback
global.requestIdleCallback = jest.fn((cb) => setTimeout(cb, 0));
global.cancelIdleCallback = jest.fn();

describe('usePerformanceOptimizations', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockIntersectionObserver();
    mockResizeObserver();
  });

  describe('useLazyLoading', () => {
    it('deve inicializar como não visível', () => {
      const { result } = renderHook(() => 
        usePerformanceOptimizations().useLazyLoading()
      );
      
      expect(result.current.isVisible).toBe(false);
    });

    it('deve retornar ref para observação', () => {
      const { result } = renderHook(() => 
        usePerformanceOptimizations().useLazyLoading()
      );
      
      expect(result.current.ref).toBeDefined();
      expect(result.current.ref.current).toBeNull();
    });

    it('deve configurar threshold personalizado', () => {
      const { result } = renderHook(() => 
        usePerformanceOptimizations().useLazyLoading({ threshold: 0.5 })
      );
      
      expect(result.current.ref).toBeDefined();
    });
  });

  describe('useIntersectionObserver', () => {
    it('deve inicializar observer', () => {
      const callback = jest.fn();
      
      renderHook(() => 
        usePerformanceOptimizations().useIntersectionObserver(callback)
      );
      
      expect(window.IntersectionObserver).toHaveBeenCalled();
    });

    it('deve chamar callback quando elemento entra em vista', () => {
      const callback = jest.fn();
      const mockIO = mockIntersectionObserver(true);
      
      const { result } = renderHook(() => 
        usePerformanceOptimizations().useIntersectionObserver(callback)
      );
      
      // Simula elemento entrando em vista
      const mockElement = document.createElement('div');
      act(() => {
        mockIO.trigger(mockElement);
      });
      
      expect(callback).toHaveBeenCalled();
    });
  });

  describe('useVirtualList', () => {
    const items = Array.from({ length: 1000 }, (_, i) => ({ id: i, name: `Item ${i}` }));

    it('deve calcular itens visíveis corretamente', () => {
      const { result } = renderHook(() => 
        usePerformanceOptimizations().useVirtualList(items, 50, 500)
      );
      
      expect(result.current.visibleItems).toBeDefined();
      expect(result.current.visibleItems.length).toBeLessThanOrEqual(items.length);
    });

    it('deve atualizar ao fazer scroll', () => {
      const { result } = renderHook(() => 
        usePerformanceOptimizations().useVirtualList(items, 50, 500)
      );
      
      const initialStart = result.current.startIndex;
      
      act(() => {
        result.current.onScroll({ target: { scrollTop: 250 } });
      });
      
      expect(result.current.startIndex).toBeGreaterThanOrEqual(initialStart);
    });

    it('deve calcular altura total corretamente', () => {
      const { result } = renderHook(() => 
        usePerformanceOptimizations().useVirtualList(items, 50, 500)
      );
      
      expect(result.current.totalHeight).toBe(items.length * 50);
    });
  });

  describe('useDebounce', () => {
    jest.useFakeTimers();

    afterEach(() => {
      jest.clearAllTimers();
    });

    it('deve debouncar valores', () => {
      const { result, rerender } = renderHook(
        ({ value, delay }) => usePerformanceOptimizations().useDebounce(value, delay),
        { initialProps: { value: 'initial', delay: 500 } }
      );
      
      expect(result.current).toBe('initial');
      
      rerender({ value: 'updated', delay: 500 });
      expect(result.current).toBe('initial');
      
      act(() => {
        jest.advanceTimersByTime(500);
      });
      
      expect(result.current).toBe('updated');
    });

    it('deve cancelar timeout anterior', () => {
      const { result, rerender } = renderHook(
        ({ value, delay }) => usePerformanceOptimizations().useDebounce(value, delay),
        { initialProps: { value: 'initial', delay: 500 } }
      );
      
      rerender({ value: 'first', delay: 500 });
      
      act(() => {
        jest.advanceTimersByTime(250);
      });
      
      rerender({ value: 'second', delay: 500 });
      
      act(() => {
        jest.advanceTimersByTime(500);
      });
      
      expect(result.current).toBe('second');
    });
  });

  describe('useThrottle', () => {
    jest.useFakeTimers();

    afterEach(() => {
      jest.clearAllTimers();
    });

    it('deve throttlar execução', () => {
      const callback = jest.fn();
      
      const { result } = renderHook(() => 
        usePerformanceOptimizations().useThrottle(callback, 1000)
      );
      
      // Primeira chamada deve executar imediatamente
      act(() => {
        result.current();
      });
      
      expect(callback).toHaveBeenCalledTimes(1);
      
      // Chamadas subsequentes devem ser throttled
      act(() => {
        result.current();
        result.current();
      });
      
      expect(callback).toHaveBeenCalledTimes(1);
      
      // Após o delay, deve executar novamente
      act(() => {
        jest.advanceTimersByTime(1000);
        result.current();
      });
      
      expect(callback).toHaveBeenCalledTimes(2);
    });
  });

  describe('useImagePreloader', () => {
    it('deve precarregar imagens', async () => {
      const images = ['image1.jpg', 'image2.jpg'];
      const mockImage = {
        onload: null,
        onerror: null,
        src: '',
      };
      
      global.Image = jest.fn(() => mockImage);
      
      const { result } = renderHook(() => 
        usePerformanceOptimizations().useImagePreloader(images)
      );
      
      expect(result.current.isLoading).toBe(true);
      expect(result.current.loadedImages).toEqual([]);
      
      // Simula carregamento bem-sucedido
      act(() => {
        mockImage.onload();
      });
      
      expect(global.Image).toHaveBeenCalledTimes(2);
    });

    it('deve lidar com erros de carregamento', () => {
      const images = ['invalid-image.jpg'];
      const mockImage = {
        onload: null,
        onerror: null,
        src: '',
      };
      
      global.Image = jest.fn(() => mockImage);
      
      const { result } = renderHook(() => 
        usePerformanceOptimizations().useImagePreloader(images)
      );
      
      // Simula erro de carregamento
      act(() => {
        mockImage.onerror();
      });
      
      expect(result.current.failedImages).toContain('invalid-image.jpg');
    });
  });

  describe('useMemoryCache', () => {
    it('deve cachear valores', () => {
      const { result } = renderHook(() => 
        usePerformanceOptimizations().useMemoryCache()
      );
      
      act(() => {
        result.current.set('key1', 'value1');
      });
      
      expect(result.current.get('key1')).toBe('value1');
    });

    it('deve limpar cache quando cheio', () => {
      const { result } = renderHook(() => 
        usePerformanceOptimizations().useMemoryCache(2)
      );
      
      act(() => {
        result.current.set('key1', 'value1');
        result.current.set('key2', 'value2');
        result.current.set('key3', 'value3'); // Deve limpar key1
      });
      
      expect(result.current.get('key1')).toBeUndefined();
      expect(result.current.get('key2')).toBe('value2');
      expect(result.current.get('key3')).toBe('value3');
    });

    it('deve deletar chaves específicas', () => {
      const { result } = renderHook(() => 
        usePerformanceOptimizations().useMemoryCache()
      );
      
      act(() => {
        result.current.set('key1', 'value1');
        result.current.delete('key1');
      });
      
      expect(result.current.get('key1')).toBeUndefined();
    });

    it('deve limpar todo o cache', () => {
      const { result } = renderHook(() => 
        usePerformanceOptimizations().useMemoryCache()
      );
      
      act(() => {
        result.current.set('key1', 'value1');
        result.current.set('key2', 'value2');
        result.current.clear();
      });
      
      expect(result.current.get('key1')).toBeUndefined();
      expect(result.current.get('key2')).toBeUndefined();
    });
  });

  describe('useDeviceCapabilities', () => {
    it('deve detectar dispositivos low-end', () => {
      // Mock de um dispositivo low-end
      Object.defineProperty(navigator, 'hardwareConcurrency', {
        writable: true,
        value: 2,
      });
      
      Object.defineProperty(navigator, 'deviceMemory', {
        writable: true,
        value: 2,
      });
      
      Object.defineProperty(navigator, 'connection', {
        writable: true,
        value: { effectiveType: '2g' },
      });
      
      const { result } = renderHook(() => 
        usePerformanceOptimizations().useDeviceCapabilities()
      );
      
      expect(result.current.isLowEnd).toBe(true);
    });

    it('deve detectar dispositivos high-end', () => {
      // Mock de um dispositivo high-end
      Object.defineProperty(navigator, 'hardwareConcurrency', {
        writable: true,
        value: 8,
      });
      
      Object.defineProperty(navigator, 'deviceMemory', {
        writable: true,
        value: 8,
      });
      
      Object.defineProperty(navigator, 'connection', {
        writable: true,
        value: { effectiveType: '4g' },
      });
      
      const { result } = renderHook(() => 
        usePerformanceOptimizations().useDeviceCapabilities()
      );
      
      expect(result.current.isLowEnd).toBe(false);
    });
  });
});
