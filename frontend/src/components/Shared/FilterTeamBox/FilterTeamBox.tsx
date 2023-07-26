import React, { FunctionComponent, useState } from 'react';
import './FilterTeamBox.scss';
import FilterButton from '../FilterButton/FilterButton';
import { SimpleTeamFDRDataModel } from '../../../models/fixturePlanning/TeamFDRData';


type FilterTeamBoxProps = {
    displayUncheckAll: boolean;
    fdrData: SimpleTeamFDRDataModel[];
    toggleCheckBox: (e: React.MouseEvent<HTMLInputElement, MouseEvent>) => void;
    uncheckAll: (e: boolean) => void;
    removeAllText: string;
    addAllText: string;
}

export const FilterTeamBox : FunctionComponent<FilterTeamBoxProps> = ({
    fdrData,
    toggleCheckBox,
    displayUncheckAll,
    uncheckAll,
    removeAllText,
    addAllText
}) => {
    const [ hasToggledOffAll, setHasToggledOffAll ] = useState(false);

    function toggleAll() {
        uncheckAll(hasToggledOffAll);
        setHasToggledOffAll(value => !value);
    }
    
    return <div className='filter-teams-container'>
        <div className='filter-teams-list'>
        { fdrData.map(team_name =>
            <FilterButton onclick={(e: React.MouseEvent<HTMLInputElement, MouseEvent>) => 
                toggleCheckBox(e)} 
                buttonText={team_name.team_name} 
                checked={team_name.checked} 
            />
        )}
        { displayUncheckAll && 
            <FilterButton 
                onclick={() => toggleAll()} 
                buttonText={hasToggledOffAll ? removeAllText : addAllText} 
                labelClassName={"toggle-all"}
                checked={true}
            /> }
        </div>
    </div>
};

export default FilterTeamBox;