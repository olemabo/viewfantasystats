from fixture_planner.backend.utility_functions import calc_score
from fixture_planner_eliteserien.backend.utility_functions import create_eliteserien_fdr_dict
from models.fixtures.models.FixtureDifficultyModel import FixtureDifficultyModel

def find_best_fixture_with_min_length_each_team_eliteserien(
    data,
    GW_start,
    GW_end,
    min_length=5
):
    """
    data: List of team fixture data
    gw_start/gw_end: Gameweek range to search
    min_length: Minimum length of the best fixture period
    """

    best_fixtures = []
    first_gws = []

    for team_idx in range(1, len(data) + 1):
        fixtures, first_gw = compute_best_fixtures_one_team_db_data(
            data,
            GW_start,
            GW_end,
            team_idx,
            min_length
        )

        best_fixtures.append(fixtures)
        first_gws.append(first_gw)

    return [
        fixtures
        for _, fixtures in sorted(
            zip(first_gws, best_fixtures),
            key=lambda item: item[0]
        )
    ]


def compute_best_fixtures_one_team_db_data(
    data,
    gw_start,
    gw_end,
    team_idx,
    min_length
):
    """
    data: All team fixture data
    gw_start/gw_end: Gameweek range to search
    team_idx: Index of the team to evaluate (1-based)
    min_length: Minimum number of consecutive GWs in the period
    
    Find the best gameweek region with respect to fixture values
    between gw_start and gw_end with a length >= min_length.
    """

    total_gameweeks = gw_end - gw_start + 1

    if min_length > total_gameweeks:
        print("min_length must be smaller than gw_end - gw_start + 1")
        return -1

    team = data[team_idx - 1]
    fdr_dict = create_eliteserien_fdr_dict(team)

    best_start = gw_start
    best_end = gw_end
    best_length = total_gameweeks

    best_score = (
        calc_score(fdr_dict, gw_start, gw_end) / total_gameweeks
    )

    for start_gw in range(gw_start, gw_end + 1):
        for end_gw in range(start_gw + min_length - 1, gw_end + 1):
            length = end_gw - start_gw + 1

            score = (
                calc_score(fdr_dict, start_gw, end_gw) / length
            )

            if score < best_score or (
                score == best_score and length > best_length
            ):
                best_start = start_gw
                best_end = end_gw
                best_length = length
                best_score = score

    fixture_list = []
    first_gw_to_use = None

    for gw in range(gw_start, gw_end + 1):
        is_good_gw = best_start <= gw <= best_end

        if is_good_gw and first_gw_to_use is None:
            first_gw_to_use = gw

        gw_fixtures = fdr_dict[gw]

        fixture_list.append([
            FixtureDifficultyModel(
                team_name=team.team_name,
                opponent_team_name=fixture[0].upper(),
                difficulty_score=fixture[2],
                home_away=fixture[1],
                use_not_use=int(is_good_gw)
            ).to_dict()
            for fixture in gw_fixtures
        ])

    return fixture_list, first_gw_to_use or 0