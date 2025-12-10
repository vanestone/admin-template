/**
 * 检测元素是否被 ellipsis 截断的示例用法
 */

import React, { useEffect, useRef, useState } from 'react';
import { isTextEllipsis, isTextEllipsisMultiline, isEllipsis } from './index';

// ============================================
// 示例 1: 使用原生 DOM API 检查
// ============================================

/**
 * 方法1: 直接使用 DOM API（适用于任何场景）
 */
export const checkEllipsisWithDOM = () => {
  // 获取元素
  const spanElement = document.querySelector('.my-span') as HTMLElement;
  const aElement = document.querySelector('.my-link') as HTMLElement;

  if (spanElement) {
    // 方式1: 检查单行文本是否被截断
    const isSpanEllipsis = spanElement.scrollWidth > spanElement.clientWidth;
    console.log('span 是否被截断:', isSpanEllipsis);
  }

  if (aElement) {
    // 方式2: 检查多行文本是否被截断
    const isLinkEllipsis = aElement.scrollHeight > aElement.clientHeight;
    console.log('a 标签是否被截断:', isLinkEllipsis);
  }
};

// ============================================
// 示例 2: React Hook 方式
// ============================================

/**
 * 自定义 Hook: 检测元素是否被 ellipsis
 */
export const useEllipsisDetection = () => {
  const elementRef = useRef<HTMLElement>(null);
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
    const resizeObserver = new ResizeObserver(checkEllipsis);
    if (elementRef.current) {
      resizeObserver.observe(elementRef.current);
    }

    return () => {
      window.removeEventListener('resize', checkEllipsis);
      resizeObserver.disconnect();
    };
  }, []);

  return { elementRef, isEllipsisActive };
};

// ============================================
// 示例 3: React 组件使用示例
// ============================================

/**
 * 单行文本省略示例
 */
export const SingleLineEllipsisExample: React.FC = () => {
  const { elementRef, isEllipsisActive } = useEllipsisDetection();
  const text = '这是一段很长的文本内容，可能会被截断';

  return (
    <div>
      <span
        ref={elementRef as React.RefObject<HTMLSpanElement>}
        style={{
          display: 'inline-block',
          maxWidth: '200px',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
        title={isEllipsisActive ? text : undefined}
      >
        {text}
      </span>
      {isEllipsisActive && <span style={{ color: 'red' }}> (已截断)</span>}
    </div>
  );
};

/**
 * 多行文本省略示例
 */
export const MultiLineEllipsisExample: React.FC = () => {
  const elementRef = useRef<HTMLDivElement>(null);
  const [isEllipsisActive, setIsEllipsisActive] = useState(false);
  const text = '这是一段很长的文本内容，可能会被截断。这个示例展示了多行文本省略的情况。当文本超过指定行数时，会显示省略号。';

  useEffect(() => {
    const checkEllipsis = () => {
      if (elementRef.current) {
        // 多行文本需要检查高度
        const hasEllipsis = isTextEllipsisMultiline(elementRef.current);
        setIsEllipsisActive(hasEllipsis);
      }
    };

    checkEllipsis();
    window.addEventListener('resize', checkEllipsis);
    return () => window.removeEventListener('resize', checkEllipsis);
  }, []);

  return (
    <div>
      <div
        ref={elementRef}
        style={{
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          maxWidth: '300px',
        }}
        title={isEllipsisActive ? text : undefined}
      >
        {text}
      </div>
      {isEllipsisActive && <div style={{ color: 'red' }}>文本已被截断</div>}
    </div>
  );
};

/**
 * a 标签链接示例
 */
export const LinkEllipsisExample: React.FC = () => {
  const linkRef = useRef<HTMLAnchorElement>(null);
  const [isEllipsisActive, setIsEllipsisActive] = useState(false);
  const linkText = 'https://www.example.com/very/long/url/path/that/might/be/truncated';

  useEffect(() => {
    if (linkRef.current) {
      const hasEllipsis = isTextEllipsis(linkRef.current);
      setIsEllipsisActive(hasEllipsis);
    }
  }, []);

  return (
    <a
      ref={linkRef}
      href={linkText}
      style={{
        display: 'inline-block',
        maxWidth: '200px',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
      }}
      title={isEllipsisActive ? linkText : undefined}
    >
      {linkText}
    </a>
  );
};

// ============================================
// 示例 4: 手动触发检测
// ============================================

/**
 * 手动检查元素是否被截断
 */
export const manualCheckExample = () => {
  // 通过 id 获取元素
  const element = document.getElementById('my-element');
  
  if (element) {
    const isEllipsisActive = isTextEllipsis(element as HTMLElement);
    
    if (isEllipsisActive) {
      console.log('元素被截断了');
      // 可以添加 title 属性
      element.setAttribute('title', element.textContent || '');
      // 或者显示 tooltip
      // showTooltip(element);
    } else {
      console.log('元素未被截断');
      // 移除 title 属性
      element.removeAttribute('title');
    }
  }
};

// ============================================
// 示例 5: 表格中的应用
// ============================================

/**
 * 表格单元格文本省略检测
 */
export const TableCellEllipsisExample: React.FC<{ text: string }> = ({ text }) => {
  const cellRef = useRef<HTMLTableCellElement>(null);
  const [showTooltip, setShowTooltip] = useState(false);

  const handleMouseEnter = () => {
    if (cellRef.current && isTextEllipsis(cellRef.current)) {
      setShowTooltip(true);
    }
  };

  const handleMouseLeave = () => {
    setShowTooltip(false);
  };

  return (
    <td
      ref={cellRef}
      style={{
        maxWidth: '150px',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      title={showTooltip ? text : undefined}
    >
      {text}
    </td>
  );
};

// ============================================
// CSS 样式参考
// ============================================

/**
 * 单行文本省略的 CSS 样式
 */
export const singleLineEllipsisStyle = {
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap' as const,
  maxWidth: '200px', // 根据需要设置
};

/**
 * 多行文本省略的 CSS 样式
 */
export const multiLineEllipsisStyle = {
  display: '-webkit-box',
  WebkitLineClamp: 2, // 显示的行数
  WebkitBoxOrient: 'vertical' as const,
  overflow: 'hidden',
  maxWidth: '300px', // 根据需要设置
};
