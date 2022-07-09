from django.urls import path
from .views import index

urlpatterns = [
    path('', index),
    path('fixture-planner/', index),
    path('fixture-planner/fdr-planner/', index),
    path('fixture-planner/rotation-planner/', index),
    path('fixture-planner/periode-planner/', index),
    path('fixture-planner-eliteserien/', index),
    path('fixture-planner-eliteserien/rotation-planner/', index),
    path('fixture-planner-eliteserien/fdr-planner/', index),
    path('fixture-planner-eliteserien/periode-planner/', index),
]