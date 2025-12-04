// src/CacheManager.js
export class CacheManager {
  constructor(ttl = 3600000) { // 1 hora
    this.cache = {};
    this.ttl = ttl;
  }

  set(key, value) {
    this.cache[key] = {
      value,
      expires: Date.now() + this.ttl,
      created: new Date().toISOString()
    };
  }

  get(key) {
    const item = this.cache[key];
    if (!item) {
      console.log(`[Cache] Miss: ${key}`);
      return null;
    }

    if (Date.now() > item.expires) {
      delete this.cache[key];
      console.log(`[Cache] Expired: ${key}`);
      return null;
    }

    console.log(`[Cache] Hit: ${key}`);
    return item.value;
  }

  remove(key) {
    delete this.cache[key];
  }

  clear() {
    this.cache = {};
    console.log('[Cache] Cache limpo');
  }

  getStats() {
    const entries = Object.entries(this.cache);
    const active = entries.filter(([_, item]) => Date.now() < item.expires).length;
    return {
      total: entries.length,
      active,
      expired: entries.length - active
    };
  }
}
