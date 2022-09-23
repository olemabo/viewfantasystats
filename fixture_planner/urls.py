from . import views
from django.urls import path

#
urlpatterns = [
    # path to read and fill db (uses the fpl and eliteserien api's! )
    
    path("read-and-fill-db-fixture-and-kickoff-times-premier-league/", views.fill_fixture_planner_and_kick_off_time_db, name='fill_db'),
    
    # api-s used in react
    path("get-fdr-data/", views.get_fdr_data, name='get-fdr-data'),
    path("data-fdr-ui/", views.PremierLeagueTeamInfoView.as_view()),
    path("data-kickoff-time-ui/", views.KickOffTimeView.as_view()),
    path("get-all-fdr-data/", views.PostFDRView.as_view()),
    path("get-kickoff-times/", views.GetKickOffTimes.as_view()),
]

