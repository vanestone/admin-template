import { useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { useLatest, useMemoizedFn, useRequest } from 'ahooks';
import isEqual from 'lodash/isEqual';

export interface BaseSelectOption {
  label: ReactNode;
  value: string | number;
  [key: string]: unknown;
}

export interface UseSessionCachedOptionsConfig<T extends BaseSelectOption> {
  /**
   * sessionStorage key，建议结合业务含义设置，确保唯一
   */
  storageKey: string;
  /**
   * 异步获取最新 options 的方法
   */
  request: () => Promise<T[]>;
  /**
   * 是否在组件初始化时自动触发 request
   * @default true
   */
  immediate?: boolean;
  /**
   * ProFormSelect 的 onChange 回调
   */
  onChange?: (value: unknown, option: unknown, extra?: unknown) => void;
  /**
   * options 序列化方法，默认使用 JSON.stringify
   */
  serializer?: (options: T[]) => string;
  /**
   * options 反序列化方法，默认使用 JSON.parse
   */
  deserializer?: (value: string) => T[];
}

export interface UseSessionCachedOptionsResult<T extends BaseSelectOption> {
  options: T[];
  loading: boolean;
  refresh: () => Promise<T[] | undefined>;
  clearCache: () => void;
  /**
   * 可直接透传给 MuiProFormSelect.fieldProps 的对象
   */
  fieldProps: {
    options: T[];
    loading: boolean;
    onChange: (value: unknown, option: unknown, extra?: unknown) => void;
  };
}

const isBrowser = () => typeof window !== 'undefined';

function defaultSerializer<T extends BaseSelectOption>(options: T[]) {
  return JSON.stringify(options);
}

function defaultDeserializer<T extends BaseSelectOption>(value: string) {
  return JSON.parse(value) as T[];
}

export function useSessionCachedOptions<T extends BaseSelectOption>(
  config: UseSessionCachedOptionsConfig<T>,
): UseSessionCachedOptionsResult<T> {
  const {
    storageKey,
    request,
    immediate = true,
    onChange,
    serializer = defaultSerializer,
    deserializer = defaultDeserializer,
  } = config;

  const readCache = useMemoizedFn(() => {
    if (!isBrowser()) return undefined;
    try {
      const cached = window.sessionStorage.getItem(storageKey);
      if (!cached) return undefined;
      const parsed = deserializer(cached);
      return Array.isArray(parsed) ? parsed : undefined;
    } catch (error) {
      if (process.env.NODE_ENV !== 'production') {
        // eslint-disable-next-line no-console
        console.warn('[useSessionCachedOptions] 反序列化失败:', error);
      }
      return undefined;
    }
  });

  const persist = useMemoizedFn((nextOptions: T[]) => {
    if (!isBrowser()) return;
    try {
      window.sessionStorage.setItem(storageKey, serializer(nextOptions));
    } catch (error) {
      if (process.env.NODE_ENV !== 'production') {
        // eslint-disable-next-line no-console
        console.warn('[useSessionCachedOptions] 缓存失败:', error);
      }
    }
  });

  const [options, setOptions] = useState<T[]>(() => readCache() ?? []);
  const latestOptions = useLatest(options);

  const saveOptions = useMemoizedFn((nextOptions: T[]) => {
    setOptions((prev) => (isEqual(prev, nextOptions) ? prev : nextOptions));
    persist(nextOptions);
  });

  const clearCache = useMemoizedFn(() => {
    if (isBrowser()) {
      window.sessionStorage.removeItem(storageKey);
    }
    setOptions([]);
  });

  const { runAsync: fetchOptions, loading } = useRequest(request, {
    manual: true,
    onSuccess: (data) => {
      if (Array.isArray(data)) {
        saveOptions(data);
      }
    },
  });

  useEffect(() => {
    const cached = readCache();
    if (cached && cached.length) {
      saveOptions(cached);
    }
    if (immediate) {
      fetchOptions();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = useMemoizedFn(
    (value: unknown, option: unknown, extra?: unknown) => {
      if (latestOptions.current?.length) {
        persist(latestOptions.current);
      }
      onChange?.(value, option, extra);
    },
  );

  const fieldProps = useMemo(
    () => ({
      options,
      loading,
      onChange: handleChange,
    }),
    [options, loading, handleChange],
  );

  return {
    options,
    loading,
    refresh: fetchOptions,
    clearCache,
    fieldProps,
  };
}

