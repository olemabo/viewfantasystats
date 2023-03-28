from django.urls import path
from . import views_db
from . import views

# api-s used in react
urlpatterns = [
    path('search-user-names-api/', views.SearchUserNameAPIView.as_view(), name='search_user_names'),
    path('player-ownership-api/', views.PlayerOwnershipAPIView.as_view(), name='player_ownership'),
    path('player-statistics-api/', views.PlayerStatisticsAPIView.as_view(), name='player_statistics'),
    path('rank-statistics-api/', views.RankStatisticsAPIView.as_view(), name='rank_statistics'),
    path('rank-and-points-api/', views.RankAndPointsAPIView.as_view(), name='rank_and_points'),
    path('most-owned-team/', views.MostOwnedPlayersLineUpAPIView.as_view(), name='most_owned_team'),
    path('cup-statistics-api/', views.CupAPIView.as_view(), name='cup_statistics'),
]

urlpatterns += [
    # cup info
    path('read-and-fill-db-cup-info-eliteserien/', views_db.read_and_fill_cup_info_to_db_eliteserien, name='read_and_write_cup_info_to_db_eliteserien'),

    # global stats
    path('read-and-fill-db-global-stats-eliteserien/', views_db.read_and_fill_db_global_stats, name='read_and_fill_txt_global_stats_eliteserien'),
    path('fill-db-global-stats-eliteserien/', views_db.fill_db_global_stats, name='fill_txt_global_stats_eliteserien'),
    
    path('read-and-fill-db-global-stats-premier-league/', views_db.read_and_fill_db_global_stats_premier_league, name='read_and_fill_txt_global_stats_premier_league'),
]
