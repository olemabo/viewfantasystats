import { FixturePlanningType, fdrPeriode, fdrPlanner, fdrRotation } from "../../models/shared/PageProps";

export function getTitleAndDescriptionESF(content: any, fixturePlanningType: FixturePlanningType) {
    const title_fixture_planner = content.Fixture.FixturePlanner?.title;
    const title_period_planner = content.Fixture.PeriodPlanner?.title;

    const title = fixturePlanningType === fdrPlanner ? title_fixture_planner : title_period_planner;
    const gw_start = content.Fixture.gw_start;
    const gw_end = content.Fixture.gw_end;

    let description = '';
    if (fixturePlanningType === fdrPlanner) {
        description = `${title} (Fixture Difficulty Rating) ${content.LongTexts.rankTeams} ('${gw_start}' ${content.General.and} '${gw_end}').\n\n${content.LongTexts.bestFixture}`;
    } else if (fixturePlanningType === fdrPeriode) {
        description = `${title} ${content.LongTexts.markPeriode_1}\n\n${content.LongTexts.markPeriode_2} '${gw_start}' ${content.General.and} '${gw_end}' ${content.LongTexts.becomesRes} '${content.Fixture.min_fixtures}' ${content.LongTexts.leastNumber}`;
    }

    return { title, description };
}

export const getTitleAndDescriptionFPL = (content: any, fixturePlanningType: FixturePlanningType) => {
    const title_fixture_planner = content.Fixture.FixturePlanner?.title;
    const title_rotation_planner = content.Fixture.RotationPlanner?.title;
    const title_period_planner = content.Fixture.PeriodPlanner?.title;

    let title = title_fixture_planner;
    let description = "";

    switch (fixturePlanningType) {
        case fdrRotation:
            title = title_rotation_planner;
            break;
        case fdrPeriode:
            title = title_period_planner;
            description = `${title} ${content.LongTexts.markPeriode_1} 
        
            ${content.LongTexts.markPeriode_2}'${content.Fixture.gw_start}' ${content.General.and} '${content.Fixture.gw_end}' ${content.LongTexts.becomesRes}
            
            '${content.Fixture.min_fixtures} ' ${content.LongTexts.leastNumber}`;
            break;
        case fdrPlanner:
            title = title_fixture_planner;
            description = `${title} (Fixture Difficulty Rating) ${content.LongTexts.rankTeams} ('${content.Fixture.gw_start}' ${content.General.and} ' ${content.Fixture.gw_end}').
            
            ${content.LongTexts.bestFixture}`;
            break;
        default:
            break;
    }

    return { title, description };
};