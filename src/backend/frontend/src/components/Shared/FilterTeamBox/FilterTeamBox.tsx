import React, { FunctionComponent, useState } from 'react';
import './FilterTeamBox.scss';
import FilterButton from '../FilterButton/FilterButton';
import { SimpleTeamFDRDataModel } from '../../../models/fixturePlanning/TeamFDRData';

type FilterTeamBoxProps = {
    displayUncheckAll: boolean;
    fdrData: SimpleTeamFDRDataModel[];
    setToggleTeams: (value: React.SetStateAction<string[]>) => void
    removeAllText: string;
    addAllText: string;
};

const toggleCheckbox = (
    team: string, 
    setToggleTeams: (value: React.SetStateAction<string[]>) => void
) => {
    const lowerCaseTeam = team.toLowerCase();
    setToggleTeams((prevItems) => {
        if (prevItems.includes(lowerCaseTeam)) {
            return prevItems.filter((item) => item !== lowerCaseTeam);
        } else {
            return [...prevItems, lowerCaseTeam];
        }
    });
};

const uncheckAll = (
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

export const FilterTeamBox : FunctionComponent<FilterTeamBoxProps> = ({
    fdrData,
    displayUncheckAll,
    setToggleTeams,
    removeAllText,
    addAllText
}) => {
    const [ hasToggledOffAll, setHasToggledOffAll ] = useState(false);

    const toggleAll = () => {
        uncheckAll(hasToggledOffAll, fdrData, setToggleTeams);
        setHasToggledOffAll(prev => !prev);
    };

    const handleToggleCheckbox = (e: React.MouseEvent<HTMLInputElement>) => {
        const team = e.currentTarget.value.toLowerCase();
        toggleCheckbox(team, setToggleTeams);
    };

    const formatTeamName = (teamName: string) => {
        return teamName.at(0) + teamName.substring(1).toLocaleLowerCase();
    }
    
    return (
        <div className='filter-teams-container'>
            <div className='filter-teams-list'>
                {fdrData.map(team => (
                    <FilterButton
                        key={team.team_name}
                        onclick={(e: React.MouseEvent<HTMLInputElement, MouseEvent>) => handleToggleCheckbox(e)} 
                        buttonText={formatTeamName(team.team_name)} 
                        checked={team.checked}
                    />
                ))}
                {displayUncheckAll && 
                    <FilterButton 
                        onclick={toggleAll}
                        buttonText={ hasToggledOffAll ? addAllText : removeAllText } 
                        labelClassName={"toggle-all"}
                        checked={true}
                />}
            </div>
        </div>
    );
};

export default FilterTeamBox;