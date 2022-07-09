from . import views
from django.urls import path

#
urlpatterns = [
    #path("", views.fixture_planner, name='fixture-planner'),
    path("get-rotation-data/", views.get_rotation_data, name='get-rotation-data'),
    path("get-fdr-data/", views.get_fdr_data, name='get-fdr-data'),
    path("further/", views.fill_fixture_planner_and_kick_off_time_db, name='fill_db'),
    path("data-fdr-ui/", views.AddPlTeamsToDBView.as_view()),
    path("data-kickoff-time-ui/", views.KickOffTimeView.as_view()),
    path("get-all-fdr-data/", views.PostFDRView.as_view()),
    path("get-kickoff-times/", views.GetKickOffTimes.as_view()),
]

