from django.urls import path

from . import views


urlpatterns = [
    path(
        "fixture-teams/",
        views.FixtureTeamsView.as_view(),
        name="fixture-teams",
    ),
    path(
        "kickoff-times/",
        views.KickoffTimesView.as_view(),
        name="kickoff-times",
    ),
    path(
        "fdr/",
        views.FDRDataView.as_view(),
        name="fdr",
    ),
    path(
        "fantasy-team-fdr/",
        views.FantasyTeamFDRView.as_view(),
        name="fantasy-team-fdr",
    ),
    path(
        "fantasy-team-fdr/<int:team_id>/players/",
        views.FantasyTeamFDRTeamView.as_view(),
        name="fantasy-team-fdr-team",
    ),
]