from django.urls import path
from . import views


urlpatterns = [
    # APIs used to extract data to frontend
    path("get-eliteserien-kickoff-times/", views.KickoffTimes.as_view(), name="eliteserien-kickoff-times"),
    path("get-all-eliteserien-fdr-data/", views.FDRData.as_view(), name="eliteserien-fdr"),
]