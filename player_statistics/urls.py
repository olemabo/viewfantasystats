from django.urls import path

from . import views

urlpatterns = [
    path('', views.show_player_statistics, name='player_statistics'),
    path('fill_db/', views.fill_player_stat_db, name='fill_db')
]