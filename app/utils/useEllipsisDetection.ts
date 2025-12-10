import { useEffect, useRef, useState } from 'react';
import { isEllipsis } from './index';

/**
 * 自定义 Hook: 检测元素文本是否被 ellipsis 截断
 * 
 * @template T - HTML 元素类型
 * @returns 包含元素引用和截断状态的对象
 * 
 * @example
 * ```tsx
 * const MyComponent = () => {
 *   const { elementRef, isEllipsisActive } = useEllipsisDetection<HTMLSpanElement>();
 *   
 *   return (
 *     <span ref={elementRef} style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
 *       很长的文本内容...
 *     </span>
 *   );
 * };
 * ```
 */
export const useEllipsisDetection = <T extends HTMLElement = HTMLElement>() => {
  const elementRef = useRef<T>(null);
  const [isEllipsisActive, setIsEllipsisActive] = useState(false);

  useEffect(() => {
    const checkEllipsis = () => {
      if (elementRef.current) {
        const hasEllipsis = isEllipsis(elementRef.current);
        setIsEllipsisActive(hasEllipsis);
      }
    };

    // 初始检查
    checkEllipsis();

    // 监听窗口大小变化
    window.addEventListener('resize', checkEllipsis);

    // 使用 ResizeObserver 监听元素自身大小变化（更精确）
    let resizeObserver: ResizeObserver | null = null;
    
    if (typeof ResizeObserver !== 'undefined' && elementRef.current) {
      resizeObserver = new ResizeObserver(checkEllipsis);
      resizeObserver.observe(elementRef.current);
    }

    return () => {
      window.removeEventListener('resize', checkEllipsis);
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
    };
  }, []);

  return { elementRef, isEllipsisActive };
};

/**
 * 自定义 Hook: 检测元素文本是否被 ellipsis 截断（带防抖）
 * 
 * @template T - HTML 元素类型
 * @param delay - 防抖延迟时间（毫秒），默认 100ms
 * @returns 包含元素引用和截断状态的对象
 * 
 * @example
 * ```tsx
 * const MyComponent = () => {
 *   const { elementRef, isEllipsisActive } = useEllipsisDetectionDebounced<HTMLSpanElement>(200);
 *   // ...
 * };
 * ```
 */
export const useEllipsisDetectionDebounced = <T extends HTMLElement = HTMLElement>(
  delay: number = 100
) => {
  const elementRef = useRef<T>(null);
  const [isEllipsisActive, setIsEllipsisActive] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const checkEllipsis = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        if (elementRef.current) {
          const hasEllipsis = isEllipsis(elementRef.current);
          setIsEllipsisActive(hasEllipsis);
        }
      }, delay);
    };

    // 初始检查
    checkEllipsis();

    // 监听窗口大小变化
    window.addEventListener('resize', checkEllipsis);

    // 使用 ResizeObserver 监听元素自身大小变化
    let resizeObserver: ResizeObserver | null = null;
    
    if (typeof ResizeObserver !== 'undefined' && elementRef.current) {
      resizeObserver = new ResizeObserver(checkEllipsis);
      resizeObserver.observe(elementRef.current);
    }

    return () => {
      window.removeEventListener('resize', checkEllipsis);
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [delay]);

  return { elementRef, isEllipsisActive };
};
