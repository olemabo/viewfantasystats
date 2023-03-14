from django.urls import path
from . import views


urlpatterns = [
    # APIs used to extract data to frontend
    path("get-eliteserien-kickoff-times/", views.KickoffTimes.as_view(), name="eliteserien-kickoff-times"),
    path("get-all-eliteserien-fdr-data/", views.FDRData.as_view(), name="eliteserien-fdr"),
    
    # fill eliteserien db with kick of times and team info - EliteserienTeamInfo & EliteserienKickOffTime
    path("fill-eliteserien-kick-off-times-and-team-info-db/", views.fill_eliteserien_kickoff_times_and_team_info_db),
]