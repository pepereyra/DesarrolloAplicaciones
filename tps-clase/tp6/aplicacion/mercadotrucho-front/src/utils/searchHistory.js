// Utilities to store per-user search history in localStorage

const GUEST_KEY = 'mercadolibre-search-guest';

const getKeyForUser = (user) => {
  if (!user) return GUEST_KEY;
  const id = user.id || user.email || 'unknown';
  return `mercadolibre-search-${id}`;
};

export const getSearchHistory = (user) => {
  try {
    const key = getKeyForUser(user);
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    const items = JSON.parse(raw);
    if (!Array.isArray(items)) return [];
    return items;
  } catch (err) {
    console.error('Error reading search history:', err);
    return [];
  }
};

export const addSearchTerm = (user, term, max = 10) => {
  try {
    if (!term || !term.trim()) return;
    const key = getKeyForUser(user);
    const existing = getSearchHistory(user);
    const normalized = term.trim();
    // Move to front if exists
    const filtered = existing.filter(t => t.toLowerCase() !== normalized.toLowerCase());
    filtered.unshift(normalized);
    const sliced = filtered.slice(0, max);
    localStorage.setItem(key, JSON.stringify(sliced));
  } catch (err) {
    console.error('Error saving search term:', err);
  }
};

export const clearSearchHistory = (user) => {
  try {
    const key = getKeyForUser(user);
    localStorage.removeItem(key);
  } catch (err) {
    console.error('Error clearing search history:', err);
  }
};
