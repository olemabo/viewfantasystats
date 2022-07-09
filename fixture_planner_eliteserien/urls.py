from . import views
from django.urls import path


urlpatterns = [
    path("get-eliteserien-kickoff-times/", views.GetKickOffTimesEliteserien.as_view()),
    path("get-all-eliteserien-fdr-data/", views.GetAllEliteserienFDRData.as_view()),
]