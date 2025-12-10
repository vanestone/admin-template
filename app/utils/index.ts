/**
 * 检查元素是否因为 text-overflow: ellipsis 而被截断
 * @param element - DOM 元素（如 span、a 标签等）
 * @returns boolean - 如果文本被截断返回 true，否则返回 false
 */
export const isTextEllipsis = (element: HTMLElement | null): boolean => {
  if (!element) return false;
  
  // 方法1: 比较 scrollWidth 和 clientWidth
  // 如果内容宽度大于可见宽度，说明被截断了
  return element.scrollWidth > element.clientWidth;
};

/**
 * 检查元素是否因为多行省略而被截断
 * @param element - DOM 元素
 * @returns boolean - 如果文本被截断返回 true，否则返回 false
 */
export const isTextEllipsisMultiline = (element: HTMLElement | null): boolean => {
  if (!element) return false;
  
  // 对于多行文本省略，需要比较 scrollHeight 和 clientHeight
  return element.scrollHeight > element.clientHeight;
};

/**
 * 通用的文本省略检查函数（同时支持单行和多行）
 * @param element - DOM 元素
 * @returns boolean - 如果文本被截断返回 true，否则返回 false
 */
export const isEllipsis = (element: HTMLElement | null): boolean => {
  if (!element) return false;
  
  // 检查水平方向（单行省略）或垂直方向（多行省略）是否被截断
  return (
    element.scrollWidth > element.clientWidth ||
    element.scrollHeight > element.clientHeight
  );
};
