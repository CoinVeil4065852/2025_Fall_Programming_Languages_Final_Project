import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const { getComputedStyle } = window;
window.getComputedStyle = (elt) => getComputedStyle(elt);
window.HTMLElement.prototype.scrollIntoView = () => {};

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

window.ResizeObserver = ResizeObserver;

// Minimal i18n setup for tests to avoid network requests and warnings
i18n.use && i18n.use(initReactI18next).init({
  resources: { en: { translation: {} } },
  lng: 'en',
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
});
