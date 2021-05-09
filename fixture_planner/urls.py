from . import views
from django.urls import path

#
urlpatterns = [
    path("", views.fixture_planner, name='fixture-planner'),
    path("further/", views.fill_data_base, name='index2')
]