"use client"

import { useState } from 'react';
import { ShowFDRData } from '../../fixtures/show-fdr-data/show-fdr-data';
import FilterTeamBox from '../../shared/FilterTeamBox/filter-team-box';
import { fdrPeriode } from '../../../models/shared/PageProps';
import TextInput from '../../shared/ui/text-input/TextInput';
import { Button } from '../../shared/ui/button/button';
import { filterFdrData } from '../../fixtures/fixtureUtils';
import { maxGwFpl, minGwFpl, minNumberOfFixture } from '../../../constants/gws';
import { FDRFormInput } from '../../../models/fixturePlanning/FDRFormInput';
import { useTranslations } from 'next-intl';
import { FixturePlanningType } from '@/types/fixturePlanningType';
import { useRouter } from 'next/navigation';
import { SimpleTeamFDRDataModel } from '@/models/fixturePlanning/TeamFDRData';
import { KickOffTimesModel } from '@/models/fixturePlanning/KickOffTimes';
import './fixture-planner.css';

interface FixturePlannerProps {
    fixtureData: SimpleTeamFDRDataModel[];
    fixturePlanningType: FixturePlanningType;
    kickOffTimes: KickOffTimesModel[];
    defaultForm: FDRFormInput;
}

export function FixturePlannerPage({ 
    fixturePlanningType,
    fixtureData,
    kickOffTimes,
    defaultForm
}: FixturePlannerProps) {
    const t = useTranslations('Fixture');
    const g = useTranslations('General');
    const router = useRouter();

    const [ showTeamFilters, setShowTeamFilters ] = useState(false);
    const [ toggleTeams, SetToggleTeams ] = useState<string[]>([]);
    const [ formInput, setFormInput ] = useState<FDRFormInput>(defaultForm);

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        const query = new URLSearchParams({
            startGw: formInput.startGw.toString(),
            endGw: formInput.endGw.toString(),
            minNumFixtures: formInput.minNumFixtures ? formInput.minNumFixtures.toString() : "0",
            fdrType: formInput.fdrType || ''
        });

        router.push(`?${query.toString()}`);
    }

    const filteredFdrData = filterFdrData(fixtureData, toggleTeams);
    const filteredKickoffTimes = kickOffTimes.slice(defaultForm.startGw - 1, defaultForm.endGw);

    return <>
        <div className='input-row-container'>
            <Button 
                buttonText={t("filter_button_text")} 
                iconClass={`fa fa-chevron-${showTeamFilters ? "up" : "down"}`}
                onclick={() => setShowTeamFilters(showTeamFilters ? false : true)} 
                color='white' 
            />
            
            <form onSubmit={(e) => {handleSubmit(e);}}>
                <TextInput 
                    htmlFor='input-form-start-gw'
                    min={minGwFpl}
                    max={maxGwFpl}
                    onInput={(e: number) => setFormInput((prevFormInput) => ({
                        ...prevFormInput,
                        startGw: e,
                    }))} 
                    defaultValue={formInput.startGw}>
                    {t("gw_start")}
                </TextInput>
                <TextInput 
                    htmlFor='input-form-end-gw'
                    min={formInput.startGw}
                    max={maxGwFpl}
                    onInput={(e: number) => setFormInput((prevFormInput) => ({
                        ...prevFormInput,
                        endGw: e,
                    }))} 
                    defaultValue={formInput.endGw}>
                    {t("gw_end")}
                </TextInput>

                { fixturePlanningType === fdrPeriode && 
                    <TextInput 
                        onInput={(e: number) => setFormInput((prevFormInput) => ({
                            ...prevFormInput,
                            minNumFixtures: e,
                        }))}
                        defaultValue={formInput.minNumFixtures}
                        min={minNumberOfFixture}
                        htmlFor='min-num-fixtures'
                        max={formInput.endGw - formInput.startGw}>
                        {t("min_fixtures")?.split(/(\s+)/)[0]}<br/>
                        {t("min_fixtures").split(/(\s+)/)[2]}
                    </TextInput>
                }

                <input className="submit" type="submit" value={g("search_button_name")} />
            </form>
        </div>

        { filteredFdrData.length > 0 && showTeamFilters &&
            <FilterTeamBox
                removeAllText={t("removeAllText")} 
                addAllText={t("addAllText")} 
                setToggleTeams={SetToggleTeams}
                fdrData={filteredFdrData}
                displayUncheckAll
            />
        }

        { filteredFdrData.length > 0 && filteredKickoffTimes.length > 0 && (
            <ShowFDRData 
                warningMessage={t("noTeamsChosen")}
                kickOffTimes={filteredKickoffTimes}
                fdrData={filteredFdrData}
                allowToggleBorder
            />
        )}
    </>
};

export default FixturePlannerPage;