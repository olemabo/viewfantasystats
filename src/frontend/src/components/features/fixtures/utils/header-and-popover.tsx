import React from "react";
import Popover from "@/components/shared/popover/popover";
import FdrBox from "@/components/shared/FDR-explaination/fdr-box";
import { FixturePlanningType } from "@/types/page";
import { getTranslations } from "next-intl/server";
import { esf, fpl, LeagueType } from "@/models/shared/LeagueType";
import { fdrPeriode, fdrPlanner, fdrRotation } from "@/models/shared/FixturePlanningType";
import { URLS } from "@/constants/urls";

type FixturePlannerHeaderProps = {
  fixturePlanningType: FixturePlanningType;
  leagueType: LeagueType;
};

export default async function FixturePlannerHeader({ fixturePlanningType, leagueType }: FixturePlannerHeaderProps) {
    const t = await getTranslations();

    const { title, description } = getTitleAndDescription(fixturePlanningType, t);

    return (
        <h1>
            {title}
            <Popover
              popoverTitle={title}
              iconSize={14}
              iconPosition={[-10, 0, 0, 3]}
              alignLeft
            >
            {description} 
            {"\n\n"}
            {t("Fixture.FixtureAreFrom")}
            { leagueType === esf && (
              <>
                <a href={URLS.EXTERNAL.SPREADSHEETS.DAGFINN_THON}>{t("Fixture.ExcelSheet")}</a> 
                {t("Fixture.to")} Dagfinn Thon.
              </>
            )
            }
            { leagueType === fpl &&
              <a href={URLS.EXTERNAL.OFFICIAL.FPL}>Fantasy Premier League.</a>
            }
            <FdrBox 
              leagueType={leagueType} 
              fdrValues={String(t("Fixture.FixturePlanner.FdrValues"))} 
              FdrDescription={String(t("Fixture.FixturePlanner.FdrDescription"))}
            />
            </Popover>
        </h1>
  );
}


export const getTitleAndDescription = (fixturePlanningType: FixturePlanningType, t: Function) => {
    const title_fixture_planner = t("Fixture.FixturePlanner.Title");
    const title_rotation_planner = t("Fixture.RotationPlanner.Title");
    const title_period_planner = t("Fixture.PeriodPlanner.Title");

    const gw_start = t("Fixture.FixturePlanner.PageDescription.GwStart");
    const gw_end = t("Fixture.FixturePlanner.PageDescription.GwEnd");
    const min_fixtures = t("Fixture.FixturePlanner.PageDescription.MinFixtures");

    let title = title_fixture_planner;
    let description = "";

    switch (fixturePlanningType) {
        case fdrRotation:
            title = title_rotation_planner;
            description = t("Fixture.RotationPlanner.PageDescription.Text", {
                title,
                rotationPlannerDescription_first: t("Fixture.RotationPlanner.PageDescription.Description1"),
                rotationPlannerDescription_second: t("Fixture.RotationPlanner.PageDescription.Description2"),
                gw_start,
                and: t("General.and"),
                gw_end,
                becomesRes: t("Fixture.RotationPlanner.PageDescription.BecomesRes"),
                teams_to_check: t("Fixture.teams_to_check"),
                rotationPlannerDescription_1: t("Fixture.RotationPlanner.PageDescription.Description3"),
                teams_to_play: t("Fixture.teams_to_play"),
                rotationPlannerDescription_2: t("Fixture.RotationPlanner.PageDescription.Description4")
            });
            break;
        case fdrPeriode:
            title = title_period_planner;
            description = t("Fixture.PeriodPlanner.PageDescription.Text", {
                title,
                markPeriode_1: t("Fixture.PeriodPlanner.PageDescription.MarkPeriode1"),
                markPeriode_2: t("Fixture.PeriodPlanner.PageDescription.MarkPeriode2"),
                gw_start,
                and: t("General.and"),
                gw_end,
                becomesRes: t("Fixture.PeriodPlanner.PageDescription.BecomesRes"),
                min_fixtures,
                leastNumber: t("Fixture.PeriodPlanner.PageDescription.LeastNumber")
            });
            break;
        case fdrPlanner:
            title = title_fixture_planner;
            description = t("Fixture.FixturePlanner.PageDescription.ESF", {
                title,
                rankTeams: t("Fixture.FixturePlanner.PageDescription.RankTeams"),
                gw_start,
                and: t("General.and"),
                gw_end,
                bestFixture: t("Fixture.FixturePlanner.PageDescription.BestFixture")
            });
            break;
        default:
            break;
    }

    return { title, description };
};