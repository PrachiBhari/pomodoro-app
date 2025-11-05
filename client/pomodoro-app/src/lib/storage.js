export const save = (key, value) => localStorage.setItem(key, JSON.stringify(value));
export const load = (key, fallback) => {
  try { const v = JSON.parse(localStorage.getItem(key)); return v ?? fallback; }
  catch { return fallback; }
};
