const HISTORY_KEY = 'omnitrix_terminal_command_history';
const MAX_HISTORY_LEN = 50;

/**
 * Retrieves the user's previously executed command history.
 */
export function getCommandHistory(): string[] {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(HISTORY_KEY);
  if (!stored) return [];
  try {
    return JSON.parse(stored);
  } catch (e) {
    return [];
  }
}

/**
 * Saves a new executed command to local storage history.
 */
export function saveCommandHistory(command: string): void {
  const trimmed = command.trim();
  if (typeof window === 'undefined' || !trimmed) return;
  
  const history = getCommandHistory();
  // Prevent duplicate consecutive entries
  if (history[0] === trimmed) return;
  
  const updated = [trimmed, ...history].slice(0, MAX_HISTORY_LEN);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
}
