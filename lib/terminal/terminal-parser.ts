export interface ParsedCommand {
  command: string;
  args: string[];
}

/**
 * Parses user input into a standardized command token and a list of arguments.
 */
export function parseCommand(rawInput: string): ParsedCommand {
  const trimmed = rawInput.trim();
  if (!trimmed) {
    return { command: '', args: [] };
  }

  // Split by spaces, collapsing consecutive spaces
  const parts = trimmed.split(/\s+/);
  const command = parts[0].toLowerCase();
  const args = parts.slice(1);

  return { command, args };
}
