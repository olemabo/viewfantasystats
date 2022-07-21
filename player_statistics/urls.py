from django.urls import path
from . import views

urlpatterns = [
    path('', views.show_player_statistics, name='player_statistics'),
    #path('fill_txt_global_stats/', views.fill_txt_global_stats, name='fill_txt_global_stats'),
    # path('fill_db_global_stats/', views.fill_db_global_stats, name='fill_db_global_stats'),
    #path('fill_db_player_stats/', views.fill_player_stat_db, name='fill_db_player_stats'),
    path('nationality/', views.show_nationality_statistics, name='show_nationality_statistics'),
    path('ownership/', views.show_ownership_statistics, name='show_ownership_statistics'),
    path('player/', views.show_player_statistics, name='show_player_statistics'),
    # new paths used
    path('player-ownership-api/', views.PlayerOwnershipAPIView.as_view(), name='player_ownership'),
]
