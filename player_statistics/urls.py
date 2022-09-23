from django.urls import path
from . import views

urlpatterns = [
   
    # path to read and fill db (uses the fpl and eliteserien api's! )
    
    # user info
    path('read-and-fill-db-user-info-eliteserien/', views.read_and_fill_user_info_to_db_eliteserien, name='read_and_write_user_info_to_db_eliteserien'),
    # path('fill-db-user-info-eliteserien/', views.fill_user_info_to_db_eliteserien, name='write_user_info_to_db_eliteserien'),
    
    # # global stats
    path('read-and-fill-db-global-stats-eliteserien/', views.read_and_fill_db_global_stats, name='read_and_fill_txt_global_stats_eliteserien'),
    path('fill-db-global-stats-eliteserien/', views.fill_db_global_stats, name='fill_txt_global_stats_eliteserien'),
    
    path('read-and-fill-db-global-stats-premier-league/', views.read_and_fill_db_global_stats_premier_league, name='read_and_fill_txt_global_stats_premier_league'),
    # path('fill-db-global-stats-premier-league/', views.fill_db_global_stats_premier_league, name='fill_txt_global_stats_premier_league'),
    
    # # player stats
    path('read-and-fill-db-player-statistics-eliteserien/', views.fill_player_statistics_eliteserien, name='read_and_fill_player_statistics_eliteserien'),
    path('read-and-fill-db-player-statistics-premier-league/', views.fill_player_statistics_premier_league, name='read_and_fill_player_statistics_premier_league'),
    
    # api-s used in react
    path('search-user-names-api/', views.SearchUserNameAPIView.as_view(), name='search_user_names'),
    path('player-ownership-api/', views.PlayerOwnershipAPIView.as_view(), name='player_ownership'),
    path('player-statistics-api/', views.PlayerStatisticsAPIView.as_view(), name='player_statistics'),
    path('rank-statistics-api/', views.RankStatisticsAPIView.as_view(), name='rank_statistics'),
    path('rank-and-points-api/', views.RankAndPointsAPIView.as_view(), name='rank_and_points'),
    path('most-owned-team/', views.MostOwnedPlayersLineUpAPIView.as_view(), name='most_owned_team'),
]
