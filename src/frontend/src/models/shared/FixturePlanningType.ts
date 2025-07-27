export type FixturePlanningType = 'planner' | 'periode' | 'rotation';

export const fdrPlanner: FixturePlanningType = 'planner';
export const fdrPeriode: FixturePlanningType = 'periode';
export const fdrRotation: FixturePlanningType = 'rotation';

export type FixturePlanningProps = {
    fixturePlanningType: FixturePlanningType;
}
