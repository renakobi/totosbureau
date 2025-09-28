// Accessibility utilities
export const generateId = (prefix: string) => `${prefix}-${Math.random().toString(36).substr(2, 9)}`;

export const announceToScreenReader = (message: string) => {
  const announcement = document.createElement('div');
  announcement.setAttribute('aria-live', 'polite');
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.textContent = message;
  
  document.body.appendChild(announcement);
  
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
};

export const focusElement = (selector: string) => {
  const element = document.querySelector(selector) as HTMLElement;
  if (element) {
    element.focus();
  }
};

// Keyboard navigation helpers
export const handleKeyDown = (event: React.KeyboardEvent, actions: {
  onEnter?: () => void;
  onEscape?: () => void;
  onArrowUp?: () => void;
  onArrowDown?: () => void;
  onArrowLeft?: () => void;
  onArrowRight?: () => void;
  onSpace?: () => void;
}) => {
  switch (event.key) {
    case 'Enter':
      actions.onEnter?.();
      break;
    case 'Escape':
      actions.onEscape?.();
      break;
    case 'ArrowUp':
      actions.onArrowUp?.();
      break;
    case 'ArrowDown':
      actions.onArrowDown?.();
      break;
    case 'ArrowLeft':
      actions.onArrowLeft?.();
      break;
    case 'ArrowRight':
      actions.onArrowRight?.();
      break;
    case ' ':
      event.preventDefault();
      actions.onSpace?.();
      break;
  }
};

// Screen reader only text
export const srOnly = 'sr-only absolute w-px h-px p-0 -m-px overflow-hidden whitespace-nowrap border-0';
