/**
 * 判断一个值是否为 Promise 对象
 * 使用鸭子类型检测，可以检测任何符合 Promise A+ 规范的对象
 * @param value - 要检测的值
 * @returns 如果是 Promise 对象返回 true，否则返回 false
 */
export function isPromise<T = unknown>(value: unknown): value is Promise<T> {
  return (
    value !== null &&
    typeof value === 'object' &&
    typeof (value as Promise<T>).then === 'function' &&
    typeof (value as Promise<T>).catch === 'function'
  );
}

/**
 * 判断一个值是否为 thenable 对象（具有 then 方法的对象）
 * 比 isPromise 更宽松，只要有 then 方法即可
 * @param value - 要检测的值
 * @returns 如果是 thenable 对象返回 true，否则返回 false
 */
export function isThenable<T = unknown>(value: unknown): value is PromiseLike<T> {
  return (
    value !== null &&
    (typeof value === 'object' || typeof value === 'function') &&
    typeof (value as PromiseLike<T>).then === 'function'
  );
}
