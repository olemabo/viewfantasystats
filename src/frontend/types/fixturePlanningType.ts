export type FixturePlanningType = 'planner' | 'periode' | 'rotation';

export const FixturePlanningTypes = {
  PLANNER: 'planner',
  PERIODE: 'periode',
  ROTATION: 'rotation',
} as const;

export type FixturePlanningTypeKey = keyof typeof FixturePlanningTypes;
export type FixturePlanningTypeValue = typeof FixturePlanningTypes[FixturePlanningTypeKey];

export type FixturePlanningProps = {
  fixturePlanningType: FixturePlanningType;
};