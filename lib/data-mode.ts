/**
 * Utility functions for managing data mode preference
 * (API data vs Dummy data)
 * 
 * This allows developers to easily toggle between using real API calls
 * and dummy data throughout the application.
 * 
 * Usage:
 * - Toggle via the navbar button (shows "API" or "Dummy" badge)
 * - Preference is persisted in localStorage
 * - All API-related components check this preference before making calls
 * 
 * Components using this:
 * - app/app/page.tsx (decision matrix generation)
 * - components/decision-matrix/decision-matrix.tsx (blueprint API call)
 * - app/app/blueprint/page.tsx (blueprint data loading)
 */

const DATA_MODE_KEY = 'useDummyData';

export function getDataMode(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(DATA_MODE_KEY) === 'true';
}

export function setDataMode(useDummy: boolean): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(DATA_MODE_KEY, String(useDummy));
}

export function toggleDataMode(): boolean {
  const newValue = !getDataMode();
  setDataMode(newValue);
  return newValue;
}
