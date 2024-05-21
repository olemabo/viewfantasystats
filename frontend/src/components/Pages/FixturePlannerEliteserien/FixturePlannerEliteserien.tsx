import { DefaultPageContainer } from '../../Layout/DefaultPageContainer/DefaultPageContainer';
import { useState, FunctionComponent } from 'react';
import { ShowFDRData } from '../../Fixtures/ShowFDRData/ShowFDRData';
import * as external_urls from '../../../static_urls/externalUrls';
import { FixturePlanningProps, PageProps, esf, fdrPeriode } from '../../../models/shared/PageProps';
import FdrBox from '../../Shared/FDR-explaination/FdrBox';
import TextInput from '../../Shared/TextInput/TextInput';
import "../../Pages/FixturePlanner/FixturePlanner.scss";
import { Spinner } from '../../Shared/Spinner/Spinner';
import { Button } from '../../Shared/Button/Button';
import Popover from '../../Shared/Popover/Popover';
import useFixtureDataESF from '../../../hooks/useFixtureDataESF';
import { getTitleAndDescriptionESF } from '../../Fixtures/fixtureTitleDescriptionUtils';
import { createSearchQueryFromForminput, filterFdrData, setExcludedGwsFromSearchParams } from '../../Fixtures/fixtureUtils';
import { maxGwEsf, minGwEsf, minNumberOfFixture } from '../../../constants/gws';
import { FDRFormInput } from '../../../models/fixturePlanning/FDRFormInput';
import FilterTeamBox from '../../Shared/FilterTeamBox/FilterTeamBox';
 
export const FixturePlannerEliteserienPage : FunctionComponent<PageProps & FixturePlanningProps> = (props) => {       
    const [ showTeamFilters, setShowTeamFilters ] = useState(false);
    const [ toggleTeams, SetToggleTeams ] = useState<string[]>([]);
    const [ formInput, setFormInput ] = useState<FDRFormInput>({
        startGw: -1,
        endGw: maxGwEsf,
        minNumFixtures: 3,
        fdrType: '',
        excludeGws: setExcludedGwsFromSearchParams(),
        fixturePlanningType: props.fixturePlanningType
    });

    const [ fixturePlannerSearchQuery, setFixturePlannerSearchQuery ] = useState<string>(
        createSearchQueryFromForminput(formInput)
    );

    const { 
        isLoading, 
        fdrData,
        kickOffTimes,
        maxGw 
    } = useFixtureDataESF(fixturePlannerSearchQuery, setFormInput, props.fixturePlanningType);

    function updateFDRData() {
        const query = createSearchQueryFromForminput(formInput);
        setFixturePlannerSearchQuery(query);
    }

    const filteredFdrData = filterFdrData(fdrData, toggleTeams);

    if (isLoading) {
        return <Spinner />;
    }

    const { title, description } = getTitleAndDescriptionESF(props.content, props.fixturePlanningType);
    
    return <>
    <DefaultPageContainer 
        pageClassName='fixture-planner-container'
        leagueType={props.league_type}
        description={description}
        heading={title} 
        >
        <h1>
            {title}
            <Popover 
                id='rotations-planner-id'
                alignLeft={true}
                popoverTitle={title} 
                iconSize={14}
                iconPosition={[-10, 0, 0, 3]}
                popoverText={description}
            >
                { props.content.LongTexts.fixtureAreFrom }
                <a href={external_urls.url_spreadsheets_dagfinn_thon}>{ props.content.LongTexts.ExcelSheet }</a> { props.content.LongTexts.to } Dagfinn Thon.
                <FdrBox leagueType={esf} content={props.content} />
            </Popover>
        </h1>
        { maxGw > 0 && 
            <div className='input-row-container'>
                {/* <ToggleButton 
                    onclick={(checked: string) => changeXlsxSheet(checked)} 
                    toggleButtonName="FDR-toggle"
                    defaultToggleList={[ 
                        { name: props.content.General.defence, value: "_defensivt", checked: fdrType === "_defensivt", classname: "defensiv" },
                        { name: "FDR", value: "", checked: fdrType === "", classname: "fdr" },
                        { name: props.content.General.offence, value: "_offensivt", checked: fdrType === "_offensivt", classname: "offensiv"}
                    ]}
                /> */}
                <Button 
                    buttonText={props.content.Fixture.filter_button_text} 
                    iconClass={`fa fa-chevron-${showTeamFilters ? "up" : "down"}`} 
                    onclick={() => setShowTeamFilters(showTeamFilters ? false : true)} 
                    color='white'
                />
                <form onSubmit={(e) =>  {updateFDRData(); e.preventDefault()}}>
                    <TextInput 
                        htmlFor='input-form-start-gw'
                        min={minGwEsf}
                        max={maxGw}
                        onInput={(e: number) => setFormInput((prevFormInput) => ({
                            ...prevFormInput,
                            startGw: e,
                        }))} 
                        defaultValue={formInput.startGw}>
                        {props.content.Fixture.gw_start}
                    </TextInput>
                    <TextInput 
                        htmlFor='input-form-end-gw'
                        min={formInput.startGw}
                        max={maxGw}
                        onInput={(e: number) => setFormInput((prevFormInput) => ({
                            ...prevFormInput,
                            endGw: e,
                        }))} 
                        defaultValue={formInput.endGw}>
                        {props.content.Fixture.gw_end}
                    </TextInput>

                    { props.fixturePlanningType === fdrPeriode && 
                        <TextInput 
                            onInput={(e: number) => setFormInput((prevFormInput) => ({
                                ...prevFormInput,
                                minNumFixtures: e,
                            }))}
                            defaultValue={formInput.minNumFixtures}
                            min={minNumberOfFixture}
                            htmlFor='min-num-fixtures'
                            max={formInput.endGw - formInput.startGw}>
                            {props.content.Fixture.min_fixtures.split(/(\s+)/)[0]}<br/>
                            {props.content.Fixture.min_fixtures.split(/(\s+)/)[2]}
                        </TextInput>
                    }

                    <input className="submit" type="submit" value={props.content.General.search_button_name} />
                </form> 
            </div>
        }
        
        { filteredFdrData.length > 0 && showTeamFilters &&
            <FilterTeamBox
                removeAllText={props.content.Fixture.removeAllText} 
                addAllText={props.content.Fixture.addAllText} 
                setToggleTeams={SetToggleTeams}
                fdrData={filteredFdrData}
                displayUncheckAll={false}
            />
        }

        { filteredFdrData.length > 0 && kickOffTimes.length > 0 && (
            <ShowFDRData 
                warningMessage={props.content.Fixture.noTeamsChosen}
                kickOffTimes={kickOffTimes}
                fdrData={filteredFdrData}
                allowToggleBorder={true}
                content={props.content}
            />
        )}
    </DefaultPageContainer>
    </>
};

export default FixturePlannerEliteserienPage;