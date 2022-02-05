"""fplwebpage URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path

# Add URL maps to redirect the base URL to our application
from django.views.generic import RedirectView

# Use include() to add paths from the catalog application
from django.urls import include

# Use static() to add url mapping to serve static files during development (only)
from django.conf import settings
from django.conf.urls.static import static


urlpatterns = [
    path('admin/', admin.site.urls),
]

urlpatterns += [
    #path('home/', include('fixture_planner.urls')),
]

urlpatterns += [
    #path('', RedirectView.as_view(url='fixture-planner/', permanent=True)),
    #path('fixture-planner/', include('fixture_planner.urls')),
    #path('fixture-planner-eliteserien/', include('fixture_planner_eliteserien.urls')),
    #path('statistics/', include('player_statistics.urls')),
    path('', include("frontend.urls")),
    #path('', include("react.urls")),
    path('fixture-planner/', include("fixture_planner.urls"))
]


urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)