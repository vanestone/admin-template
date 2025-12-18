/**
 * 递归遍历对象或数组，将所有字符串属性值中的 `$` 转义为 `\$`
 * 以防止 amis 将其误识别为变量。
 *
 * @param data 需要处理的数据
 * @returns 处理后的数据
 */
export const escapeAmisVar = (data: any): any => {
  if (typeof data === 'string') {
    // 替换所有的 $ 为 \$
    // 注意：在 JSON 字符串中，\ 需要转义
    return data.replace(/\$/g, '\\$');
  }

  if (Array.isArray(data)) {
    return data.map(escapeAmisVar);
  }

  if (data !== null && typeof data === 'object') {
    const result: any = {};
    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        result[key] = escapeAmisVar(data[key]);
      }
    }
    return result;
  }

  return data;
};
