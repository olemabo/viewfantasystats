"use server"

import { getFixtureDataESFServer } from "../fixture-planner/esf-api";
import { getTeamDataESF, getTeamDataFPL } from "../../../pages/rotation-planner/api";
import { getFixtureDataFPLServerFPL } from "../../../../lib/api/fixturePlanner/getFixturePlannerData";
import { getKickoffTimesESF, getKickoffTimesFPL } from "../../../../lib/api/kickoffTimes/getKickOffTimes";
import { FDRFormInput } from "../../../../models/fixturePlanning/FDRFormInput";
import { esf, fpl } from "../../../../models/shared/LeagueType";
import { LeagueType } from "../../../../types/league";

export async function getFixtureData(defaultForm: FDRFormInput, leagueType: LeagueType) {
    if (leagueType === fpl) {
        return await getFixtureDataFPLServerFPL(defaultForm);
    }

    if (leagueType === esf) {
        return await getFixtureDataESFServer(defaultForm);
    }

    throw new Error();
}

export async function getKickoffTimes(leagueType: LeagueType) {
    if (leagueType === fpl) {
        return await getKickoffTimesFPL();
    }

    if (leagueType === esf) {
        return await getKickoffTimesESF();
    }

    throw new Error();
}

export async function getTeamData(leagueType: LeagueType) {
    if (leagueType === fpl) {
        return await getTeamDataFPL();
    }

    if (leagueType === esf) {
        return await getTeamDataESF();
    }

    throw new Error();
}