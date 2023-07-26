"""fplwebpage URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.1/topics/http/urls/
"""

from django.contrib import admin
from django.urls import path

# Use include() to add paths from the catalog application
from django.urls import include

# Use static() to add url mapping to serve static files during development (only)
from django.conf import settings
from django.conf.urls.static import static


urlpatterns = [
    path('admin/', admin.site.urls),
]

urlpatterns += [
    path('fixture-planner-eliteserien/', include('fixture_planner_eliteserien.urls')),
    path('fixture-planner/', include("fixture_planner.urls")),
    path('statistics/', include('player_statistics.urls')),
    path('', include("frontend.urls")),
]

urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)