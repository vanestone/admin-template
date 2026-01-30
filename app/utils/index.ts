/**
 * 验证 HTTP header 名称是否有效
 * Header 名称必须是非空字符串，且只能包含有效的 token 字符
 * @param name - header 名称
 * @returns 是否为有效的 header 名称
 */
export function isValidHeaderName(name: unknown): boolean {
  if (typeof name !== 'string' || name.length === 0) {
    return false;
  }
  // HTTP header 名称只能包含 token 字符: !#$%&'*+-.0-9A-Z^_`a-z|~
  // 不能包含空格、换行符、冒号等特殊字符
  const validHeaderNameRegex = /^[!#$%&'*+\-.0-9A-Z^_`a-z|~]+$/;
  return validHeaderNameRegex.test(name);
}

/**
 * 过滤掉无效的 headers
 * @param headers - 原始 headers 对象
 * @returns 过滤后的有效 headers 对象
 */
export function filterValidHeaders(
  headers: Record<string, string | undefined | null>
): Record<string, string> {
  const validHeaders: Record<string, string> = {};

  for (const [name, value] of Object.entries(headers)) {
    if (isValidHeaderName(name) && value != null && value !== '') {
      validHeaders[name] = String(value);
    } else if (!isValidHeaderName(name)) {
      console.warn(`[Headers] 无效的 header 名称被过滤: "${name}"`);
    }
  }

  return validHeaders;
}

/**
 * 创建安全的 Headers 对象
 * 会自动过滤掉无效的 header 名称和值
 * @param init - 初始化参数
 * @returns Headers 对象
 */
export function createSafeHeaders(
  init?: HeadersInit | Record<string, string | undefined | null>
): Headers {
  const headers = new Headers();

  if (!init) {
    return headers;
  }

  // 如果是 Headers 实例，直接返回
  if (init instanceof Headers) {
    return init;
  }

  // 如果是数组格式
  if (Array.isArray(init)) {
    for (const [name, value] of init) {
      if (isValidHeaderName(name) && value != null) {
        headers.append(name, String(value));
      }
    }
    return headers;
  }

  // 如果是对象格式
  for (const [name, value] of Object.entries(init)) {
    if (isValidHeaderName(name) && value != null && value !== '') {
      headers.append(name, String(value));
    } else if (!isValidHeaderName(name)) {
      console.warn(`[Headers] 无效的 header 名称被过滤: "${name}"`);
    }
  }

  return headers;
}
