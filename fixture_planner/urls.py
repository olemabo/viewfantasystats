from . import views
from django.urls import path

#
urlpatterns = [
    path("", views.fixture_planner, name='fixture-planner'),
    path("get-fdr-data/", views.get_fdr_data, name='get-fdr-data'),
    path("get-rotation-data/", views.get_rotation_data, name='get-rotation-data'),
    path("further/", views.fill_data_base, name='index2'),
]

