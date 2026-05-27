import { Alien } from '@/lib/api/types';

export interface BattleRound {
  round: number;
  text: string;
  type: 'intro' | 'clash' | 'verdict';
}

export interface BattleResult {
  winner: Alien;
  loser: Alien;
  winnerScore: number;
  loserScore: number;
  rounds: BattleRound[];
}

const POWER_KEYWORDS: Record<string, number> = {
  fire: 10,
  heat: 9,
  flame: 10,
  speed: 8,
  fast: 8,
  velocity: 9,
  diamond: 9,
  crystal: 9,
  shield: 8,
  ghost: 7,
  shadow: 7,
  invisible: 8,
  strength: 8,
  muscle: 8,
  power: 9,
  electric: 8,
  spark: 8,
  lightning: 9,
  water: 6,
  swim: 6,
  aquatic: 7
};

/**
 * Calculates a combat capability rating for an alien specimen by matching keywords inside its abilities.
 */
export function calculateAlienScore(alien: Alien): number {
  let score = 10; // Base baseline score

  alien.abilities.forEach((ability) => {
    const abLower = ability.toLowerCase();
    Object.entries(POWER_KEYWORDS).forEach(([keyword, weight]) => {
      if (abLower.includes(keyword)) {
        score += weight;
      }
    });
  });

  return score;
}

/**
 * Simulates a chronological, turn-based biometric combat simulation between two DNA strands.
 */
export function runBattle(alienA: Alien, alienB: Alien): BattleResult {
  const scoreA = calculateAlienScore(alienA) + Math.round(Math.random() * 15);
  const scoreB = calculateAlienScore(alienB) + Math.round(Math.random() * 15);

  const nameA = alienA.general.name.toUpperCase();
  const nameB = alienB.general.name.toUpperCase();

  const rounds: BattleRound[] = [
    {
      round: 1,
      text: `⬡ BIOMETRIC DUEL DETECTED: [${nameA}] VS [${nameB}]`,
      type: 'intro'
    },
    {
      round: 2,
      text: `CELLULAR MATCH: ${nameA} (${alienA.general.species.toUpperCase()}) ENTERS THE SECTOR IN STANDBY MODE.`,
      type: 'intro'
    },
    {
      round: 3,
      text: `CELLULAR MATCH: ${nameB} (${alienB.general.species.toUpperCase()}) CHARGES PROTOCOL CORES.`,
      type: 'intro'
    }
  ];

  // Randomize fight narrative descriptors depending on scores
  const actionListA = [
    `${nameA} deploys metamorphic core spikes!`,
    `${nameA} executes standard tactical maneuvers!`,
    `${nameA} discharges high-frequency energy charges!`,
    `${nameA} locks biometric coordinate tracking!`
  ];
  const actionListB = [
    `${nameB} launches heavy counter-strikes!`,
    `${nameB} creates localized refractor barriers!`,
    `${nameB} sweeps horizontal combat vectors!`,
    `${nameB} overloads core thruster modules!`
  ];

  rounds.push({
    round: 4,
    text: `[ROUND 1] ${actionListA[Math.floor(Math.random() * actionListA.length)]} ${nameB} absorbs biometric feedback.`,
    type: 'clash'
  });

  rounds.push({
    round: 5,
    text: `[ROUND 2] ${actionListB[Math.floor(Math.random() * actionListB.length)]} ${nameA} evades with swift dexterity.`,
    type: 'clash'
  });

  rounds.push({
    round: 6,
    text: `[ROUND 3] CRITICAL MASS! Both specimen cores spike to maximum thermal ratings. Kinetic energy discharge detected!`,
    type: 'clash'
  });

  // Determine winner based on score
  const isAWinner = scoreA >= scoreB;
  const winner = isAWinner ? alienA : alienB;
  const loser = isAWinner ? alienB : alienA;
  const winnerScore = isAWinner ? scoreA : scoreB;
  const loserScore = isAWinner ? scoreB : scoreA;
  const winnerName = winner.general.name.toUpperCase();
  const loserName = loser.general.name.toUpperCase();

  rounds.push({
    round: 7,
    text: `==================================================\nVERDICT: [${winnerName}] OVERPOWERS [${loserName}] IN EXTREME KINETIC CLASH.\n==================================================`,
    type: 'verdict'
  });

  rounds.push({
    round: 8,
    text: `SYS_MUTATION: BATTLE COMPLETED. FINAL RATING: [${winnerName}: ${winnerScore}] - [${loserName}: ${loserScore}]. WINNER CELLULAR THEME ASSIMILATED.`,
    type: 'verdict'
  });

  return {
    winner,
    loser,
    winnerScore,
    loserScore,
    rounds
  };
}
