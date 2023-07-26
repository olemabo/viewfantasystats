from django.urls import path
from .views import index

urlpatterns = [
    path('', index),
    path('premier-league/', index),
    path('premier-league/fixture-planner/', index),
    path('premier-league/player-ownership/', index),
    path('premier-league/player-statistics/', index),
    path('premier-league/live-fixtures/', index),

    path('premier-league/fdr-planner/', index),
    path('premier-league/rotation-planner/', index),
    path('premier-league/periode-planner/', index),

    path('eliteserien/', index),
    path('eliteserien/fdr-planner/', index),
    path('eliteserien/fdr-planner-team-id/', index),
    path('eliteserien/rotation-planner/', index),
    path('eliteserien/periode-planner/', index),
    path('eliteserien/player-ownership/', index),
    path('eliteserien/search-user-names/', index),
    path('eliteserien/rank-statistics/', index),
    path('eliteserien/live-fixtures/', index),

    path('fixture-planner/', index),
    path('fixture-planner/fdr-planner/', index),
    path('fixture-planner/rotation-planner/', index),
    path('fixture-planner/periode-planner/', index),
    path('fixture-planner-eliteserien/', index),
    path('fixture-planner-eliteserien/rotation-planner/', index),
    path('fixture-planner-eliteserien/fdr-planner/', index),
    path('fixture-planner-eliteserien/periode-planner/', index),
    
    path('statistics/player-ownership/', index),
    path('statistics-premier-league/player-ownership/', index),
    path('statistics/search-user-names/', index),
    path('statistics/rank-statistics/', index),
]