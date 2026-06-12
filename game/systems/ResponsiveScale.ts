export const GAME_WIDTH = 900;
export const GAME_HEIGHT = 1600;

export function optionScale(optionCount: number) {
  if (optionCount >= 4) {
    return 0.82;
  }

  if (optionCount === 3) {
    return 0.9;
  }

  return 1;
}
