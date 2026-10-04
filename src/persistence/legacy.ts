import { STORAGE_KEY, type State } from '../state';

// Bản v1 tiếp tục dùng key cũ. IndexedDB và migration v2 được triển khai ở task riêng.
export function saveLegacyState(state: State): boolean {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    return true;
  } catch {
    return false;
  }
}
