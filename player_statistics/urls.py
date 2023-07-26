from django.urls import path
from . import views, view_player_stats, view_player_ownership, view_live_fixtures

# api-s used in react
urlpatterns = [
    path('search-user-names-api/', views.SearchUserNameAPIView.as_view(), name='search_user_names'),
    path('player-ownership-api/', view_player_ownership.PlayerOwnershipAPIView.as_view(), name='player_ownership'),
    path('player-statistics-api/', view_player_stats.PlayerStatisticsAPIView.as_view(), name='player_statistics'),
    path('rank-statistics-api/', views.RankStatisticsAPIView.as_view(), name='rank_statistics'),
    path('rank-and-points-api/', views.RankAndPointsAPIView.as_view(), name='rank_and_points'),
    path('most-owned-team/', views.MostOwnedPlayersLineUpAPIView.as_view(), name='most_owned_team'),
    path('cup-statistics-api/', views.CupAPIView.as_view(), name='cup_statistics'),
    path('live-fixtures-api/', view_live_fixtures.LiveFixturesAPIView.as_view(), name='live_fixtures'),
]
