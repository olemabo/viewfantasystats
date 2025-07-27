import { leagueTypeSelector } from '../store/selectors/leagueTypeSelector';
import { LeagueTypeActions } from '../store/states/leagueTypeStore';
import { LeagueType } from '../models/shared/PageProps';
import { useAppDispatch } from '../store';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';

const useLeagueTypeDispatch = (desiredLeagueType: LeagueType) => {
    const dispatch = useAppDispatch();
    const currentLeagueType = useSelector(leagueTypeSelector);

    useEffect(() => {
        if (currentLeagueType !== desiredLeagueType) {
            dispatch(LeagueTypeActions.setLeagueType(desiredLeagueType));
        }
    }, [currentLeagueType, desiredLeagueType, dispatch]);
};

export default useLeagueTypeDispatch;