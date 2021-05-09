from . import views
from django.urls import path

#
urlpatterns = [
    path("", views.fixture_planner, name='fixture-planner'),
    path("further/", views.fill_data_base, name='index2'),
    path("<int:start_gw>", views.fixture_planner, name='fixture-planner-gw'),
    path("<int:start_gw>/<int:end_gw>", views.fixture_planner, name='fixture-planner-gw1-gw2'),
    path("<int:start_gw>/<int:end_gw>/<str:combinations>", views.fixture_planner, name='fixture-planner-gw1-gw2-combi'),
    path("<int:start_gw>/<int:end_gw>/<str:combinations>/<int:min_num_fixtures>", views.fixture_planner,
         name='fixture-planner-gw1-gw2-combi-min_num_fixtures'),
    path("<int:start_gw>/<int:end_gw>/<str:combinations>/<int:teams_to_play>/<int:teams_to_check>", views.fixture_planner,
         name='fixture-planner-gw1-gw2-combi-teamstocheck-teamstoplay'),
]

