// ^ КЭШирование запросов с TTL

type CacheEntry<T> = {
  data: T; // кэш.данн.
  timestamp: number; // время записи (мс)
  ttl: number; // время жизни (мс)
};

class RequestCache {
  private cache = new Map<string, CacheEntry<any>>();

  // проверка наличия кэш и сроки TTL(вр.жизни)
  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  // сохр.данн.с указ.TTL
  set<T>(key: string, data: T, ttl: number): void {
    this.cache.set(key, { data, timestamp: Date.now(), ttl });
  }

  // удал.данн.по ключу/шаблону(RegExp).
  delete(key: string | RegExp): void {
    if (typeof key === "string") this.cache.delete(key);
    else {
      Array.from(this.cache.keys()).forEach((k) => {
        if (key.test(k)) this.cache.delete(k);
      });
    }
  }

  // очистка кэш
  clear(): void {
    this.cache.clear();
  }
}

export const requestCache = new RequestCache();
