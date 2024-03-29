import { leagueTypeSelector } from '../store/selectors/leagueTypeSelector';
import { LeagueTypeActions } from '../store/states/leagueTypeStore';
import { LeagueType, esf } from '../models/shared/PageProps';
import { useAppDispatch } from '../store/index';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';

const useLeagueTypeDispatch = (setThisLeagueType: LeagueType) => {
    const dispatch = useAppDispatch();

    useEffect(() => {
        const leagueType = useSelector(leagueTypeSelector);
        if (leagueType !== setThisLeagueType) {
            dispatch(LeagueTypeActions.setLeagueType(setThisLeagueType));
        }
    }, [dispatch]);
};

export const setLeagueType = (leagueType: LeagueType) => {
    const dispatch = useAppDispatch();
    dispatch(LeagueTypeActions.setLeagueType(leagueType));
}

export default useLeagueTypeDispatch;