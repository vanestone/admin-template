# 文本省略（Ellipsis）检测工具使用指南

## 概述

本文档介绍如何使用 JavaScript/TypeScript 检测 `span`、`a` 标签或其他元素的文本是否被 `text-overflow: ellipsis` 截断。

## 核心原理

### 单行文本省略检测

当元素应用了 `text-overflow: ellipsis` 时，判断是否被截断的方法是：

```javascript
element.scrollWidth > element.clientWidth
```

- **scrollWidth**: 元素内容的完整宽度（包括被隐藏的部分）
- **clientWidth**: 元素可见区域的宽度

如果内容宽度大于可见宽度，说明文本被截断了。

### 多行文本省略检测

对于使用 `-webkit-line-clamp` 的多行省略，需要检查高度：

```javascript
element.scrollHeight > element.clientHeight
```

- **scrollHeight**: 元素内容的完整高度（包括被隐藏的部分）
- **clientHeight**: 元素可见区域的高度

## 工具函数

### 1. isTextEllipsis - 单行文本检测

```typescript
import { isTextEllipsis } from './utils';

const element = document.querySelector('.my-span');
const isEllipsis = isTextEllipsis(element);

if (isEllipsis) {
  console.log('文本被截断了');
}
```

### 2. isTextEllipsisMultiline - 多行文本检测

```typescript
import { isTextEllipsisMultiline } from './utils';

const element = document.querySelector('.multi-line-text');
const isEllipsis = isTextEllipsisMultiline(element);
```

### 3. isEllipsis - 通用检测（推荐）

```typescript
import { isEllipsis } from './utils';

const element = document.querySelector('.any-element');
const hasEllipsis = isEllipsis(element);
```

## 使用场景

### 场景 1: React 组件中使用

```tsx
import React, { useEffect, useRef, useState } from 'react';
import { isTextEllipsis } from './utils';

const MyComponent = () => {
  const textRef = useRef<HTMLSpanElement>(null);
  const [isEllipsisActive, setIsEllipsisActive] = useState(false);
  const text = '这是一段很长的文本...';

  useEffect(() => {
    const checkEllipsis = () => {
      if (textRef.current) {
        setIsEllipsisActive(isTextEllipsis(textRef.current));
      }
    };

    checkEllipsis();
    window.addEventListener('resize', checkEllipsis);
    return () => window.removeEventListener('resize', checkEllipsis);
  }, [text]);

  return (
    <span
      ref={textRef}
      style={{
        maxWidth: '200px',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
      }}
      title={isEllipsisActive ? text : undefined}
    >
      {text}
    </span>
  );
};
```

### 场景 2: 原生 JavaScript

```javascript
// HTML: <span id="mySpan" class="ellipsis-text">很长的文本...</span>

const span = document.getElementById('mySpan');

// 方法1: 直接比较
if (span.scrollWidth > span.clientWidth) {
  console.log('文本被截断');
  span.title = span.textContent; // 添加 title 提示
}

// 方法2: 使用工具函数
import { isTextEllipsis } from './utils';

if (isTextEllipsis(span)) {
  console.log('文本被截断');
}
```

### 场景 3: a 标签链接

```tsx
const LinkComponent = ({ url }) => {
  const linkRef = useRef<HTMLAnchorElement>(null);
  const [needTooltip, setNeedTooltip] = useState(false);

  useEffect(() => {
    if (linkRef.current) {
      setNeedTooltip(isTextEllipsis(linkRef.current));
    }
  }, [url]);

  return (
    <a
      ref={linkRef}
      href={url}
      style={{
        maxWidth: '300px',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        display: 'inline-block',
      }}
      title={needTooltip ? url : undefined}
    >
      {url}
    </a>
  );
};
```

### 场景 4: 表格单元格

```tsx
const TableCell = ({ text }) => {
  const cellRef = useRef(null);
  const [showTooltip, setShowTooltip] = useState(false);

  const handleMouseEnter = () => {
    if (cellRef.current && isTextEllipsis(cellRef.current)) {
      setShowTooltip(true);
    }
  };

  return (
    <td
      ref={cellRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={() => setShowTooltip(false)}
      title={showTooltip ? text : undefined}
      style={{
        maxWidth: '150px',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
      }}
    >
      {text}
    </td>
  );
};
```

### 场景 5: 多行文本省略

```tsx
const MultiLineText = ({ text }) => {
  const textRef = useRef<HTMLDivElement>(null);
  const [isEllipsis, setIsEllipsis] = useState(false);

  useEffect(() => {
    if (textRef.current) {
      // 多行文本需要检查高度
      setIsEllipsis(
        textRef.current.scrollHeight > textRef.current.clientHeight
      );
    }
  }, [text]);

  return (
    <div
      ref={textRef}
      title={isEllipsis ? text : undefined}
      style={{
        display: '-webkit-box',
        WebkitLineClamp: 3, // 最多显示3行
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden',
        maxWidth: '400px',
      }}
    >
      {text}
    </div>
  );
};
```

## 必需的 CSS 样式

### 单行省略

```css
.ellipsis-single {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 200px; /* 必须设置宽度 */
}
```

### 多行省略

```css
.ellipsis-multi {
  display: -webkit-box;
  -webkit-line-clamp: 2; /* 显示行数 */
  -webkit-box-orient: vertical;
  overflow: hidden;
  max-width: 300px; /* 必须设置宽度 */
}
```

## 自定义 Hook（推荐）

```tsx
import { useEffect, useRef, useState } from 'react';
import { isEllipsis } from './utils';

export const useEllipsisDetection = <T extends HTMLElement>() => {
  const elementRef = useRef<T>(null);
  const [isEllipsisActive, setIsEllipsisActive] = useState(false);

  useEffect(() => {
    const checkEllipsis = () => {
      if (elementRef.current) {
        setIsEllipsisActive(isEllipsis(elementRef.current));
      }
    };

    // 初始检查
    checkEllipsis();

    // 监听窗口大小变化
    window.addEventListener('resize', checkEllipsis);

    // 使用 ResizeObserver 监听元素自身变化（推荐）
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

// 使用方式
const MyComponent = () => {
  const { elementRef, isEllipsisActive } = useEllipsisDetection<HTMLSpanElement>();
  
  return (
    <span ref={elementRef} className="ellipsis-text">
      很长的文本...
    </span>
  );
};
```

## 注意事项

### 1. 时机问题

元素必须已经渲染到 DOM 中才能正确检测，建议在 `useEffect` 或 `componentDidMount` 中进行检查。

```tsx
// ✅ 正确
useEffect(() => {
  if (elementRef.current) {
    const isEllipsis = isTextEllipsis(elementRef.current);
  }
}, []);

// ❌ 错误 - 元素可能还未渲染
const MyComponent = () => {
  const elementRef = useRef(null);
  const isEllipsis = isTextEllipsis(elementRef.current); // 此时 ref 可能为 null
  // ...
};
```

### 2. 响应式处理

当窗口大小改变时，元素的截断状态可能会变化，需要监听 `resize` 事件：

```tsx
useEffect(() => {
  const checkEllipsis = () => {
    // 检查逻辑
  };

  window.addEventListener('resize', checkEllipsis);
  return () => window.removeEventListener('resize', checkEllipsis);
}, []);
```

### 3. ResizeObserver（推荐）

使用 `ResizeObserver` 可以更精确地监听元素自身大小变化：

```tsx
const resizeObserver = new ResizeObserver(() => {
  if (elementRef.current) {
    setIsEllipsis(isTextEllipsis(elementRef.current));
  }
});

if (elementRef.current) {
  resizeObserver.observe(elementRef.current);
}

return () => resizeObserver.disconnect();
```

### 4. 性能优化

频繁检查可能影响性能，考虑使用防抖：

```tsx
import { debounce } from 'lodash';

const checkEllipsis = debounce(() => {
  if (elementRef.current) {
    setIsEllipsis(isTextEllipsis(elementRef.current));
  }
}, 100);
```

### 5. display 属性

元素必须是块级元素或 `inline-block`，纯 `inline` 元素无法设置宽度：

```css
/* ✅ 正确 */
span {
  display: inline-block;
  max-width: 200px;
}

/* ❌ 错误 - inline 元素无法设置宽度 */
span {
  display: inline;
  max-width: 200px; /* 无效 */
}
```

## 完整示例

参考 `ellipsis-examples.tsx` 文件查看更多完整示例。

## 浏览器兼容性

- **scrollWidth/clientWidth**: 所有现代浏览器都支持
- **ResizeObserver**: Chrome 64+, Firefox 69+, Safari 13.1+
- **-webkit-line-clamp**: Chrome, Safari, Edge (需要 -webkit- 前缀)

## 总结

检测元素是否被 ellipsis 的核心方法：

1. **单行**: `element.scrollWidth > element.clientWidth`
2. **多行**: `element.scrollHeight > element.clientHeight`
3. **通用**: 同时检查宽度和高度

使用提供的工具函数可以简化代码，提高可维护性。
