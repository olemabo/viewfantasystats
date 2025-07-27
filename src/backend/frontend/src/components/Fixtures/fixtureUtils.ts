import { FDRFormInput } from "../../models/fixturePlanning/FDRFormInput";
import { TeamCheckedModel } from "../../models/fixturePlanning/TeamChecked";
import { SimpleTeamFDRDataModel } from "../../models/fixturePlanning/TeamFDRData";

export function createSearchQueryFromForminput(forminput: FDRFormInput): string {
    const queryString = Object.entries(forminput)
        .map(([key, value]) => {
            if (Array.isArray(value)) {
                return `${encodeURIComponent(key)}=${value.join(',')}`;
            }
            return `${encodeURIComponent(key)}=${value as string | number}`;
        })
        .join('&');
    return queryString;
}

export function setExcludedGwsFromSearchParams(): number[] {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const exclude_gws = urlParams.getAll('excludeGws')

    const temp: number[] = [];
    if (exclude_gws !== null && Array.isArray(exclude_gws)) {
        exclude_gws.forEach((x: string) => {
            const myNumber = Number(x);
            if (!isNaN(myNumber)) {
                temp.push(myNumber)
            }

        })
    }

    return temp
};

export const filterFdrData = (fdrData: SimpleTeamFDRDataModel[], toggleTeams: string[]) => {
    return fdrData.map((x) => ({
        ...x,
        checked: !toggleTeams.includes(x.team_name.toLowerCase()) ? x.checked : !x.checked
    }));
};

export const toggleCheckbox = (
    e: React.MouseEvent<HTMLInputElement>,
    setToggleTeams: (value: React.SetStateAction<string[]>) => void
) => {
    const team = e.currentTarget.value.toLowerCase();
    setToggleTeams((prevItems) => {
        if (prevItems.includes(team)) {
            return prevItems.filter((item) => item !== team);
        } else {
            return [...prevItems, team];
        }
    });
};

export const uncheckAll = (
    uncheck: boolean,
    fdrData: SimpleTeamFDRDataModel[],
    setToggleTeams: (value: React.SetStateAction<string[]>) => void
) => {
    if (uncheck) {
        setToggleTeams([]);
    } else {
        const listTeams = fdrData.map((x) => x.team_name.toLowerCase());
        setToggleTeams(listTeams);
    }
};

type ToggleFilterButtonParams = {
    e: React.MouseEvent<HTMLSpanElement, MouseEvent>;
    teamData: TeamCheckedModel[];
    setTeamData: React.Dispatch<React.SetStateAction<TeamCheckedModel[]>>;
};

export const toggleFilterButton = ({ e, teamData, setTeamData }: ToggleFilterButtonParams) => {
    const temp: TeamCheckedModel[] = [];
    const classList = e.currentTarget.classList;
    const elementId = e.currentTarget.id;
    let newClassName = '';
    let currentClasslist = '';

    if (classList.contains('can-be-in-solution')) {
        currentClasslist = 'can-be-in-solution';
        newClassName = 'must-be-in-solution';
    } else if (classList.contains('must-be-in-solution')) {
        currentClasslist = 'must-be-in-solution';
        newClassName = 'not-in-solution';
    } else if (classList.contains('not-in-solution')) {
        currentClasslist = 'not-in-solution';
        newClassName = 'can-be-in-solution';
    }

    teamData.forEach((x) => {
        const clickedOnCurrent = x.team_name === elementId;
        let canBeInSolution = x.checked;
        let mustBeInSolution = x.checked_must_be_in_solution;

        if (newClassName === 'can-be-in-solution' && clickedOnCurrent) {
            canBeInSolution = true;
            mustBeInSolution = false;
        }
        if (newClassName === 'must-be-in-solution' && clickedOnCurrent) {
            canBeInSolution = true;
            mustBeInSolution = true;
        }
        if (newClassName === 'not-in-solution' && clickedOnCurrent) {
            canBeInSolution = false;
            mustBeInSolution = false;
        }

        temp.push({
            team_name: x.team_name,
            checked: canBeInSolution,
            checked_must_be_in_solution: mustBeInSolution,
        });
    });

    setTeamData(temp);
    classList.replace(currentClasslist, newClassName);
};

export function filterTeamData(teamData: TeamCheckedModel[]) {
    const not_in_solution: string[] = [];
    const must_be_in_solution: string[] = [];
    
    teamData.map(team_data => {
        if (team_data.checked_must_be_in_solution) {
            must_be_in_solution.push(team_data.team_name)
        }
        if (!team_data.checked) {
            not_in_solution.push(team_data.team_name)
        }
    });

    const number_of_not_in_solution = not_in_solution.length;
    const number_of_must_be_in_solution = must_be_in_solution.length;
    const number_can_be_in_solution = teamData.length - number_of_not_in_solution - number_of_must_be_in_solution;
    
    return { number_of_not_in_solution: number_of_not_in_solution, number_of_must_be_in_solution:number_of_must_be_in_solution , number_can_be_in_solution: number_can_be_in_solution }
};

type ValidateInputParams = {
    body: FDRFormInput;
    propsContent: any;
    setValidationErrorMessage: React.Dispatch<React.SetStateAction<string>>;
    setShowTeamFilters: React.Dispatch<React.SetStateAction<boolean>>;
};

export const validateInput = ({
    body,
    propsContent,
    setValidationErrorMessage,
    setShowTeamFilters,
}: ValidateInputParams): boolean => {
    if (body.startGw > body.endGw) {
        setValidationErrorMessage(
            `'${propsContent.Fixture.gw_start.replace(":", "")} ${propsContent.Fixture.must_be_smaller} '${propsContent.Fixture.gw_end.replace(":", "")}'.`
        );
        return false;
    }

    if (body.teamsToPlay && body.teamsToCheck && body.teamsToPlay > body.teamsToCheck) {
        setValidationErrorMessage(
            `'${propsContent.Fixture.teams_to_play.replace(":", "")}' ${propsContent.Fixture.must_be_smaller} '${propsContent.Fixture.teams_to_check.replace(":", "")}'.`
        );
        return false;
    }

    if (body.teamsInSolution && body.teamsToCheck && body.teamsInSolution.length > body.teamsToCheck) {
        const validationText = `'Antall lag' (${body.teamsToCheck}) bestemmer hvor mange lag som skal være i løsningen. 'Lag må være i løsningen' kan derfor ikke være ${body.teamsInSolution.length}.`;
        setValidationErrorMessage(validationText);
        setShowTeamFilters(true);
        return false;
    }

    return true;
};

export const extractTeamsToUseAndTeamsInSolution = (teamData: TeamCheckedModel[]) => {
    var teamsToCheck: any[] = [];
    const teamsMustBeInSolution: string[] = [];

    teamData.forEach((team) => {
        if (team.checked) {
            teamsToCheck.push(team.team_name);
        }
        if (team.checked_must_be_in_solution) {
            teamsMustBeInSolution.push(team.team_name);
        }
    });

    if (teamsToCheck.length === 0) {
        teamsToCheck = [-1];
    }

    return [teamsToCheck, teamsMustBeInSolution];
};
