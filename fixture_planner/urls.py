from django.urls import path
from . import views

urlpatterns = [
    # api-s used in react
    path("data-fdr-ui/", views.PremierLeagueTeamInfoView.as_view()),
    path("data-kickoff-time-ui/", views.KickOffTimeView.as_view()),
    path("get-all-fdr-data/", views.PostFDRView.as_view()),
    path("get-kickoff-times/", views.GetKickOffTimes.as_view()),
    path("get-fdr-data-from-team-id/", views.PostFDRFromTeamIDView.as_view()),
]

