from player_statistics.db_models.ownership_statistics_model import GlobalOwnershipStats100, \
    GlobalOwnershipStats1000, GlobalOwnershipStats10000


def get_ownership_db_data(top_x, field_name, player_position_ids, player_team_ids):
    """
    Extract data from either GlobalOwnershipStats100, GlobalOwnershipStats1000 or GlobalOwnershipStats10000 database.
    Filter on field name, player position and player team ids.
    :param top_x: which database to extract data from. Means data from top x on global rank (100, 1000, 10000)
    :param field_name: database field name (gw_1, gw_2 ..., player_name)
    :param player_position_ids: list of player position ids ([1, 3], meaning goalkeeper and midfielder)
    :param player_team_ids: list of team ids ([1], meaning Arsenal)
    :return: DB object with data from database based on filters.
    """
    if top_x == 100:
        return GlobalOwnershipStats100.objects.values(field_name).\
                filter(player_position_id__in=player_position_ids).filter(player_team_id__in=player_team_ids)
    if top_x == 1000:
        return GlobalOwnershipStats1000.objects.values(field_name).\
                filter(player_position_id__in=player_position_ids).filter(player_team_id__in=player_team_ids)
    if top_x == 10000:
        return GlobalOwnershipStats10000.objects.values(field_name). \
                filter(player_position_id__in=player_position_ids).filter(player_team_id__in=player_team_ids)