# 文本省略检测工具（Ellipsis Detection Utils）

## 快速开始

### 基本用法

```tsx
import { isTextEllipsis } from './utils';

// 检查元素是否被截断
const element = document.querySelector('.my-text');
if (isTextEllipsis(element)) {
  console.log('文本被截断了！');
}
```

## 核心函数

### 1. `isTextEllipsis(element)`
检查**单行**文本是否被截断

```typescript
import { isTextEllipsis } from './utils';

const span = document.querySelector('span');
const isEllipsis = isTextEllipsis(span);
// 返回 true 表示文本被截断，false 表示未截断
```

### 2. `isTextEllipsisMultiline(element)`
检查**多行**文本是否被截断

```typescript
import { isTextEllipsisMultiline } from './utils';

const div = document.querySelector('.multi-line');
const isEllipsis = isTextEllipsisMultiline(div);
```

### 3. `isEllipsis(element)` ⭐ 推荐
通用检测函数，同时支持单行和多行

```typescript
import { isEllipsis } from './utils';

const element = document.querySelector('.any-text');
const hasEllipsis = isEllipsis(element);
```

## React Hook

### 基本 Hook

```tsx
import { useEllipsisDetection } from './useEllipsisDetection';

const MyComponent = () => {
  const { elementRef, isEllipsisActive } = useEllipsisDetection<HTMLSpanElement>();
  
  return (
    <span
      ref={elementRef}
      style={{
        maxWidth: '200px',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
      }}
      title={isEllipsisActive ? '完整文本' : undefined}
    >
      这是一段很长的文本...
    </span>
  );
};
```

### 带防抖的 Hook

```tsx
import { useEllipsisDetectionDebounced } from './useEllipsisDetection';

const MyComponent = () => {
  // 延迟 200ms 检测，避免频繁触发
  const { elementRef, isEllipsisActive } = useEllipsisDetectionDebounced<HTMLSpanElement>(200);
  
  return (
    <span ref={elementRef}>长文本...</span>
  );
};
```

## 实际应用示例

### 示例 1: span 标签

```tsx
const SpanExample = () => {
  const spanRef = useRef<HTMLSpanElement>(null);
  const [isEllipsis, setIsEllipsis] = useState(false);

  useEffect(() => {
    if (spanRef.current) {
      setIsEllipsis(isTextEllipsis(spanRef.current));
    }
  }, []);

  return (
    <span
      ref={spanRef}
      style={{
        display: 'inline-block',
        maxWidth: '200px',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
      }}
      title={isEllipsis ? '完整文本内容' : undefined}
    >
      很长的文本内容...
    </span>
  );
};
```

### 示例 2: a 标签

```tsx
const LinkExample = () => {
  const { elementRef, isEllipsisActive } = useEllipsisDetection<HTMLAnchorElement>();
  const url = 'https://www.example.com/very/long/url/path';

  return (
    <a
      ref={elementRef}
      href={url}
      style={{
        display: 'inline-block',
        maxWidth: '300px',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
      }}
      title={isEllipsisActive ? url : undefined}
    >
      {url}
    </a>
  );
};
```

### 示例 3: 表格单元格

```tsx
const TableCellExample = ({ text }) => {
  const cellRef = useRef(null);

  const handleMouseEnter = () => {
    if (cellRef.current && isTextEllipsis(cellRef.current)) {
      // 显示 tooltip
      console.log('需要显示提示');
    }
  };

  return (
    <td
      ref={cellRef}
      onMouseEnter={handleMouseEnter}
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

### 示例 4: 多行文本

```tsx
const MultiLineExample = () => {
  const textRef = useRef<HTMLDivElement>(null);
  const [isEllipsis, setIsEllipsis] = useState(false);

  useEffect(() => {
    if (textRef.current) {
      // 多行文本使用 isTextEllipsisMultiline
      setIsEllipsis(isTextEllipsisMultiline(textRef.current));
    }
  }, []);

  return (
    <div
      ref={textRef}
      style={{
        display: '-webkit-box',
        WebkitLineClamp: 3,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden',
        maxWidth: '400px',
      }}
      title={isEllipsis ? '完整文本' : undefined}
    >
      这是一段很长的文本内容，可能会超过三行...
    </div>
  );
};
```

## 必需的 CSS

### 单行省略

```css
.ellipsis-single {
  display: inline-block; /* 或 block */
  max-width: 200px;      /* 必需：设置最大宽度 */
  overflow: hidden;      /* 必需 */
  text-overflow: ellipsis; /* 必需 */
  white-space: nowrap;   /* 必需 */
}
```

### 多行省略

```css
.ellipsis-multi {
  display: -webkit-box;         /* 必需 */
  -webkit-line-clamp: 2;       /* 必需：显示的行数 */
  -webkit-box-orient: vertical; /* 必需 */
  overflow: hidden;            /* 必需 */
  max-width: 300px;            /* 建议设置 */
}
```

## 原理说明

### 单行检测原理

```javascript
element.scrollWidth > element.clientWidth
```

- `scrollWidth`: 内容的完整宽度（包括被隐藏的部分）
- `clientWidth`: 可见区域的宽度

### 多行检测原理

```javascript
element.scrollHeight > element.clientHeight
```

- `scrollHeight`: 内容的完整高度（包括被隐藏的部分）
- `clientHeight`: 可见区域的高度

## 常见问题

### 1. 为什么检测不准确？

确保元素已经渲染到 DOM：

```tsx
// ❌ 错误：元素可能还未渲染
const isEllipsis = isTextEllipsis(elementRef.current);

// ✅ 正确：在 useEffect 中检测
useEffect(() => {
  if (elementRef.current) {
    const isEllipsis = isTextEllipsis(elementRef.current);
  }
}, []);
```

### 2. 窗口大小改变后状态不更新

需要监听 resize 事件：

```tsx
useEffect(() => {
  const checkEllipsis = () => {
    // 检测逻辑
  };

  window.addEventListener('resize', checkEllipsis);
  return () => window.removeEventListener('resize', checkEllipsis);
}, []);
```

### 3. inline 元素无法检测

必须设置为 `inline-block` 或 `block`：

```css
/* ❌ 错误 */
span {
  display: inline;
  max-width: 200px; /* 无效 */
}

/* ✅ 正确 */
span {
  display: inline-block;
  max-width: 200px;
}
```

## 文件说明

- **`index.ts`**: 核心工具函数
- **`useEllipsisDetection.ts`**: React Hooks
- **`ellipsis-examples.tsx`**: 完整示例代码
- **`ELLIPSIS_DETECTION.md`**: 详细文档

## 相关文件

- 实际应用: `app/layout/default/user-info.tsx`
- 工具函数: `app/utils/index.ts`
- 自定义 Hook: `app/utils/useEllipsisDetection.ts`
- 示例代码: `app/utils/ellipsis-examples.tsx`
- 详细文档: `app/utils/ELLIPSIS_DETECTION.md`

## 总结

检测文本是否被 ellipsis 的三种方法：

1. **使用工具函数**: `isTextEllipsis(element)` 或 `isEllipsis(element)`
2. **使用 React Hook**: `useEllipsisDetection()` 或 `useEllipsisDetectionDebounced()`
3. **原生 JS**: `element.scrollWidth > element.clientWidth`

推荐使用提供的工具函数和 Hook，代码更简洁、更易维护。
