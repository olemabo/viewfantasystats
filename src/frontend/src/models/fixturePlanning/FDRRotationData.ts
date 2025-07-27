import { RotationPlannerTeamModel } from "./RotationPlannerTeam";
import { TeamCheckedModel } from "./TeamChecked";

export interface FDRRotationData {
    fdrData: RotationPlannerTeamModel[];
    teamData: TeamCheckedModel[];
}