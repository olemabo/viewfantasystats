from . import views
from django.urls import path


urlpatterns = [
    # APIs used to extract data to frontend
    path("get-eliteserien-kickoff-times/", views.GetKickOffTimesEliteserien.as_view()),
    path("get-all-eliteserien-fdr-data/", views.PostEliteserienFDRData.as_view()),
    
    # fill eliteserien db with kick of times and team info - EliteserienTeamInfo & EliteserienKickOffTime
    # path("fill-eliteserien-kick-off-times-and-team-info-db/", views.FillEliteserienKickOffTimesAndTeamInfoDB),
]