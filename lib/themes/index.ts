export * from './aliens/heatblast';
export * from './aliens/xlr8';
export * from './aliens/ghostfreak';
export * from './aliens/diamondhead';
export * from './aliens/upgrade';
export * from './aliens/four_arms';
export * from './aliens/wildmutt';
export * from './aliens/grey_matter';
export * from './aliens/stinkfly';
export * from './aliens/ripjaws';

import { AlienTheme } from './types';
import { heatblastTheme, xlr8Theme, ghostfreakTheme, diamondheadTheme, upgradeTheme, fourarmsTheme, wildmuttTheme, greymatterTheme, stinkflyTheme, ripjawsTheme } from '.';

export const themes: Record<string, AlienTheme> = {
  heatblast: heatblastTheme,
  xlr8: xlr8Theme,
  ghostfreak: ghostfreakTheme,
  diamondhead: diamondheadTheme,
  upgrade: upgradeTheme,
  four_arms: fourarmsTheme,
  wildmutt: wildmuttTheme,
  grey_matter: greymatterTheme,
  stinkfly: stinkflyTheme,
  ripjaws: ripjawsTheme,
};