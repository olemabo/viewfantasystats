import { RotationPlannerTeamModel } from "../../models/fixturePlanning/RotationPlannerTeam";
import { TeamCheckedModel } from "../../models/fixturePlanning/TeamChecked";

export interface FDRRotationData {
    fdrData: RotationPlannerTeamModel[];
    teamData: TeamCheckedModel[];
}