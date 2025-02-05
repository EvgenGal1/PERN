// ^ Кэширование запросов с TTL

const cache = new Map<
  string,
  {
    data: any; // кэш.данн.
    timestamp: number; // время записи (мс)
    ttl: number; // время жизни (мс)
  }
>();

export const queryCache = {
  // проверка наличия кэш и срока TTL(Time To Live)
  get: <T>(key: string): T | null => {
    const entry = cache.get(key);
    if (!entry) return null;
    if (Date.now() - entry.timestamp > entry.ttl) {
      cache.delete(key);
      return null;
    }
    return entry.data;
  },

  // сохр.данн.с указ.TTL
  set: <T>(key: string, data: T, ttl: number = 60_000): void => {
    cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    });
  },

  // удал.данн.по ключу/шаблону(RegExp).
  invalidate: (keyPattern: RegExp): void => {
    Array.from(cache.keys()).forEach((key) => {
      if (keyPattern.test(key)) cache.delete(key);
    });
  },
};
