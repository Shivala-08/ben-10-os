export interface SpokenCommand {
  type: 'activate' | 'random' | 'abilities' | 'wheel' | 'mute' | 'unmute' | 'unknown';
  payload?: string;
}

/**
 * Parses raw speech recognition text into system action commands.
 */
export function parseVoiceCommand(text: string): SpokenCommand {
  const clean = text.toLowerCase().trim();

  if (clean.includes('activate')) {
    const parts = clean.split('activate');
    const target = parts[parts.length - 1].trim().replace(/\s+/g, '_');
    if (target) {
      return { type: 'activate', payload: target };
    }
  }

  if (clean.includes('random') && (clean.includes('alien') || clean.includes('hero'))) {
    return { type: 'random' };
  }

  if (clean.includes('abilities') || clean.includes('skills') || clean.includes('show abilities')) {
    return { type: 'abilities' };
  }

  if (clean.includes('wheel') || clean.includes('go back') || clean.includes('exit') || clean.includes('back')) {
    return { type: 'wheel' };
  }

  if (clean.includes('mute') && !clean.includes('unmute')) {
    return { type: 'mute' };
  }

  if (clean.includes('unmute')) {
    return { type: 'unmute' };
  }

  return { type: 'unknown' };
}
