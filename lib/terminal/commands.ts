import { fetchAllAliens, fetchRandomAlien } from '@/lib/api/ben10';
import { getHistory, getMostUsedAlien, getTotalSessionTime } from '@/lib/utils/history';
import { BIG_10_NAMES } from '@/lib/api/ben10';
import { synth } from '@/lib/utils/WebAudioSynth';

export interface CommandResult {
  output: string[];
  error?: boolean;
  clear?: boolean;
  action?: (context: any) => void;
}

export const COMMANDS: Record<string, (args: string[]) => Promise<CommandResult>> = {
  help: async () => {
    return {
      output: [
        'AVAILABLE OMNITRIX OS DIAGNOSTIC UTILITIES:',
        '==================================================',
        '  help                       - DISPLAY SYSTEM MANUAL',
        '  list aliens                - VIEW AVAILABLE ORIGINAL DNA SPECIMENS',
        '  activate [alien]           - LOAD TARGET HERO DNA & INITIATE TRANSFORMATION',
        '  scan                       - ATTAIN CAUSTIC RANDOM BIO-STRAND SPECTRUM',
        '  stats                      - RENDER LIVE BIOMETRICS HUD REPORT',
        '  history                    - PULL METAMORPHIC SEQUENCE DATASTREAM',
        '  fusion [alien1] [alien2]   - SEQUENCE BIO-FUSION MATRIX SIMULATOR',
        '  unlock all                 - COMMAND CODE OVERRIDE: ACQUIRE COMPLETE DECK',
        '  clear                      - FLUSH OPERATIONAL CONSOLE OVERLAY',
        '  exit                       - POWER DOWN SYSTEM CORE',
        '==================================================',
      ]
    };
  },

  list: async (args) => {
    if (args[0]?.toLowerCase() !== 'aliens') {
      return {
        output: ['ERROR: INVALID UTILITY ATTRIBUTE. TRY: "list aliens"'],
        error: true
      };
    }

    try {
      const res = await fetchAllAliens();
      const originalSeries = res.aliens.filter(
        (a) => a.series === 'Original Series' || a.series === 'Original'
      );

      const header = 'NAME             | SPECIES              | HOME WORLD';
      const separator = '------------------------------------------------------------';
      
      const rows = originalSeries.map((a) => {
        const name = a.general.name.toUpperCase().padEnd(16);
        const species = a.general.species.toUpperCase().padEnd(20);
        const world = a.general.homeWorld.toUpperCase();
        return `${name} | ${species} | ${world}`;
      });

      return {
        output: [
          'RETRIEVING ORIGINAL SERIES BIOMETRIC STRANDS...',
          header,
          separator,
          ...rows,
          separator,
          `TOTAL SAMPLES RETRIEVED: ${originalSeries.length}`
        ]
      };
    } catch (e) {
      return {
        output: ['ERROR: METRIC QUERY TRANSMISSION FAILED. BIOMETRIC SERVER OFFLINE.'],
        error: true
      };
    }
  },

  activate: async (args) => {
    if (args.length === 0) {
      return {
        output: ['ERROR: SPECIFY TARGET DNA CELLULAR PROFILE. USAGE: "activate [name]"'],
        error: true
      };
    }

    const alienNameInput = args.join(' ').toLowerCase();
    const formattedId = alienNameInput.replace(/\s+/g, '_');

    try {
      const res = await fetchAllAliens();
      // Search by name match or formatted ID
      const match = res.aliens.find(
        (a) =>
          a.general.name.toLowerCase() === alienNameInput ||
          a.general.name.toLowerCase().replace(/\s+/g, '_') === formattedId ||
          a._id === formattedId
      );

      if (!match) {
        return {
          output: [`ERROR: ALIEN SPECIMEN [${alienNameInput.toUpperCase()}] NOT FOUND IN DECK.`],
          error: true
        };
      }

      const matchName = match.general.name;
      const matchId = match.general.name.toLowerCase().replace(/\s+/g, '_');

      return {
        output: [
          `LOCKING ON TO ${matchName.toUpperCase()} DNA PROFILE...`,
          'ESTABLISHING BIOMETRIC MATRIX MATCH...',
          'TRANSFORMATION AUTHORIZED. CORE OVERLOAD INITIATED.'
        ],
        action: (ctx) => {
          synth.playTransform();
          ctx.unlockAlien(matchId);
          ctx.setIsTransforming(true);
          
          setTimeout(() => {
            ctx.setActiveAlien(matchId);
            ctx.setIsTransforming(false);
            ctx.router.push(`/alien/${matchId}`);
          }, 600);
        }
      };
    } catch (e) {
      return {
        output: ['ERROR: BIOMETRIC LINK INSUFFICIENT. MATRIX COMMS OFFLINE.'],
        error: true
      };
    }
  },

  scan: async () => {
    try {
      const randomAlien = await fetchRandomAlien();
      return {
        output: [
          'INITIATING SECTOR BIO-RADAR DNA SWEEP...',
          'INTERCEPTING ATMOSPHERIC PARTICLES...',
          '==================================================',
          'DNA SAMPLE IDENTIFIED: ' + randomAlien.general.name.toUpperCase(),
          'SPECIES:             ' + randomAlien.general.species.toUpperCase(),
          'HOME WORLD:          ' + randomAlien.general.homeWorld.toUpperCase(),
          '==================================================',
          'BIOMETRIC DATA ADDED TO CORE CACHE.'
        ]
      };
    } catch (e) {
      return {
        output: ['ERROR: RADAR REFRACTOR FAILURE. COLD BIO-RADAR BLOCKED.'],
        error: true
      };
    }
  },

  stats: async () => {
    const history = getHistory();
    const mostUsed = getMostUsedAlien();
    const sessionTime = getTotalSessionTime();

    const formatSessionTime = (seconds: number) => {
      if (seconds < 60) return `${seconds}s`;
      const m = Math.floor(seconds / 60);
      const s = seconds % 60;
      return `${m}m ${s}s`;
    };

    return {
      output: [
        'BIOMETRIC HARDWARE STATUS REPORT:',
        '==================================================',
        `  DIAGNOSTIC UPTIME  - ONLINE`,
        `  ACTIVE SES_TIME    - ${formatSessionTime(sessionTime)}`,
        `  TOTAL MUTATIONS    - ${history.length} SEQUENCES LOGGED`,
        `  FAVORITE HERO      - ${mostUsed ? `${mostUsed.name.toUpperCase()} [${mostUsed.count} TIMES]` : 'NO ACTIVE TRANSFORMS'}`,
        '  BIOMATRIX STATUS   - CORE INTEGRITY 100%',
        '=================================================='
      ]
    };
  },

  history: async () => {
    const history = getHistory();
    if (history.length === 0) {
      return {
        output: ['OPERATIONAL ARCHIVE IS EMPTY. NO FORMER ENCODINGS RECORDED.']
      };
    }

    const rows = history.map((log) => {
      const time = new Date(log.timestamp).toLocaleTimeString([], { hour12: false });
      return `[${time}] ${log.alienName.toUpperCase().padEnd(16)} | DURATION: ${log.duration}s | TRANSACTION ID: ${log.id.slice(0, 8)}`;
    });

    return {
      output: [
        'PULLING SYSTEM METAMORPHIC SEQUENCE DATASTREAM...',
        '------------------------------------------------------------',
        ...rows,
        '------------------------------------------------------------',
        `TOTAL LOGGED MUTATIONS: ${history.length}`
      ]
    };
  },

  fusion: async (args) => {
    if (args.length < 2) {
      return {
        output: ['ERROR: BIOMETRIC PROTOCOL COMPROMISED. ARGUMENTS SPECIFYING 2 ALIENS REQUIRED.', 'USAGE: "fusion [alien1] [alien2]"'],
        error: true
      };
    }

    const a1 = args[0].toLowerCase();
    const a2 = args[1].toLowerCase();

    try {
      const res = await fetchAllAliens();
      
      const match1 = res.aliens.find(
        (a) =>
          a.general.name.toLowerCase() === a1 ||
          a.general.name.toLowerCase().replace(/\s+/g, '_') === a1
      );
      const match2 = res.aliens.find(
        (a) =>
          a.general.name.toLowerCase() === a2 ||
          a.general.name.toLowerCase().replace(/\s+/g, '_') === a2
      );

      if (!match1 || !match2) {
        const missing = !match1 ? a1.toUpperCase() : a2.toUpperCase();
        return {
          output: [`ERROR: BIOMETRIC INSUFFICIENT. SPECIMEN [${missing}] NOT MAPPED IN RADAR.`],
          error: true
        };
      }

      return {
        output: [
          'DNA FUSION MATRIX SYNC INITIATED...',
          `BLENDING SPECIMEN CELLULAR CORES OF ${match1.general.name.toUpperCase()} AND ${match2.general.name.toUpperCase()}...`,
          'FUSION CHAMBER CHARGED. ROUTING CORE CONTEXT...'
        ],
        action: (ctx) => {
          synth.playMalfunction();
          ctx.router.push(`/lab?alien1=${match1.general.name.toLowerCase().replace(/\s+/g, '_')}&alien2=${match2.general.name.toLowerCase().replace(/\s+/g, '_')}`);
        }
      };
    } catch (e) {
      return {
        output: ['ERROR: CELLULAR BLEND CORE ENCOUNTERED DATA COLLISION.'],
        error: true
      };
    }
  },

  'unlock': async (args) => {
    if (args[0]?.toLowerCase() !== 'all') {
      return {
        output: ['ERROR: COMMAND CODE OVERRIDE FAILURE. TRY: "unlock all"'],
        error: true
      };
    }

    return {
      output: [
        'INITIATING SYSTEM EXPLOIT PROTOCOL...',
        'BYPASSING BIOMETRIC SEQUENCE SAFEGUARDS...',
        'CELLULAR OVERRIDE AUTHORIZED.',
        '==================================================',
        '  HEATBLAST    - DNA MATRIX SECURED',
        '  XLR8         - DNA MATRIX SECURED',
        '  GHOSTFREAK   - DNA MATRIX SECURED',
        '  DIAMONDHEAD  - DNA MATRIX SECURED',
        '  UPGRADE      - DNA MATRIX SECURED',
        '  FOUR ARMS    - DNA MATRIX SECURED',
        '  WILDMUTT     - DNA MATRIX SECURED',
        '  GREY MATTER  - DNA MATRIX SECURED',
        '  STINKFLY     - DNA MATRIX SECURED',
        '  RIPJAWS      - DNA MATRIX SECURED',
        '==================================================',
        'ALL SPECIMENS SECURED. COMMAND INTERFACE INITIATED.'
      ],
      action: (ctx) => {
        synth.playTransform();
        BIG_10_NAMES.forEach((name) => {
          const id = name.toLowerCase().replace(' ', '_');
          ctx.unlockAlien(id);
        });
      }
    };
  },

  clear: async () => {
    return {
      output: [],
      clear: true
    };
  },

  exit: async () => {
    return {
      output: ['POWERING DOWN SYSTEM BIOMETRICS CONSOLE...', 'GOODBYE.'],
      action: (ctx) => {
        ctx.router.push('/');
      }
    };
  }
};
