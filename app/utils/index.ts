/**
 * 检测元素是否被文本省略（ellipsis）
 * @param element - 要检测的 DOM 元素（如 span、a 等）
 * @returns 如果文本被省略返回 true，否则返回 false
 */
export function isEllipsis(element: HTMLElement | null): boolean {
  if (!element) {
    return false;
  }

  // 对于水平省略：比较 scrollWidth 和 clientWidth
  // 如果 scrollWidth > clientWidth，说明内容溢出被省略了
  return element.scrollWidth > element.clientWidth;
}

/**
 * 检测元素是否被垂直文本省略（多行省略）
 * @param element - 要检测的 DOM 元素
 * @returns 如果文本被垂直省略返回 true，否则返回 false
 */
export function isEllipsisVertical(element: HTMLElement | null): boolean {
  if (!element) {
    return false;
  }

  // 对于垂直省略：比较 scrollHeight 和 clientHeight
  return element.scrollHeight > element.clientHeight;
}

/**
 * 检测元素是否被省略（支持水平和垂直）
 * @param element - 要检测的 DOM 元素
 * @param direction - 检测方向：'horizontal' | 'vertical' | 'both'，默认为 'horizontal'
 * @returns 如果文本被省略返回 true，否则返回 false
 */
export function checkEllipsis(
  element: HTMLElement | null,
  direction: 'horizontal' | 'vertical' | 'both' = 'horizontal'
): boolean {
  if (!element) {
    return false;
  }

  switch (direction) {
    case 'horizontal':
      return isEllipsis(element);
    case 'vertical':
      return isEllipsisVertical(element);
    case 'both':
      return isEllipsis(element) || isEllipsisVertical(element);
    default:
      return isEllipsis(element);
  }
}

/**
 * 使用选择器获取元素并检测是否被省略
 * @param selector - CSS 选择器（如 'span', '.class', '#id'）
 * @param direction - 检测方向
 * @returns 如果文本被省略返回 true，否则返回 false
 */
export function isEllipsisBySelector(
  selector: string,
  direction: 'horizontal' | 'vertical' | 'both' = 'horizontal'
): boolean {
  const element = document.querySelector<HTMLElement>(selector);
  return checkEllipsis(element, direction);
}
