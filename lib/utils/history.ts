export interface HistoryLog {
  id: string;
  alienId: string;
  alienName: string;
  timestamp: number; // Date.now()
  duration: number; // in seconds
}

export function getHistory(): HistoryLog[] {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem('omnitrix_history');
  if (!stored) return [];
  try {
    return JSON.parse(stored);
  } catch (e) {
    console.error('Failed to parse history logs', e);
    return [];
  }
}

export function addHistoryLog(alienId: string, duration: number): void {
  if (typeof window === 'undefined') return;
  const history = getHistory();
  const alienName = alienId
    .split('_')
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join(' ');
  
  const newLog: HistoryLog = {
    id: Math.random().toString(36).substring(2, 9) + Date.now(),
    alienId,
    alienName,
    timestamp: Date.now(),
    duration,
  };

  const updated = [newLog, ...history].slice(0, 100); // Limit to 100 entries
  localStorage.setItem('omnitrix_history', JSON.stringify(updated));

  // Trigger a custom event to notify components that history has updated
  window.dispatchEvent(new Event('omnitrix_history_updated'));
}

export function getMostUsedAlien(): { name: string; count: number } | null {
  const history = getHistory();
  if (history.length === 0) return null;

  const counts: Record<string, number> = {};
  history.forEach((log) => {
    counts[log.alienName] = (counts[log.alienName] || 0) + 1;
  });

  let mostUsed = '';
  let maxCount = 0;
  Object.entries(counts).forEach(([name, count]) => {
    if (count > maxCount) {
      maxCount = count;
      mostUsed = name;
    }
  });

  return mostUsed ? { name: mostUsed, count: maxCount } : null;
}

export function getTotalSessionTime(): number {
  const history = getHistory();
  return history.reduce((sum, log) => sum + log.duration, 0);
}
