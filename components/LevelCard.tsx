import type { LevelData, Settings } from '@/game/types';
import { LinkButton } from './Button';

type LevelCardProps = {
  completed: boolean;
  level: LevelData;
  locked: boolean;
  settings: Settings;
};

const puzzleLabels: Record<LevelData['puzzleType'], string> = {
  choose_bridge: 'Bridge',
  choose_color_home: 'Color',
  choose_food: 'Food',
  choose_path: 'Path',
};

export function LevelCard({ completed, level, locked, settings }: LevelCardProps) {
  const instruction =
    settings.language === 'vi' ? level.instructionTextVi : level.instructionTextEn;

  return (
    <article className={`level-card ${locked ? 'locked' : 'unlocked'}`}>
      <div>
        <div className="level-card-top">
          <span className="level-number">{level.id}</span>
          <span className="level-badge">{level.ageMode}</span>
        </div>
        <h2>{level.title}</h2>
        <p>{instruction}</p>
      </div>
      <div className="level-card-footer">
        <span className="compact-status">
          {completed ? 'Done' : puzzleLabels[level.puzzleType]}
        </span>
        {locked ? (
          <span className="kid-button ghost" aria-disabled="true">
            Locked
          </span>
        ) : (
          <LinkButton href={`/game?level=${level.id}`} variant="secondary">
            Play
          </LinkButton>
        )}
      </div>
    </article>
  );
}
