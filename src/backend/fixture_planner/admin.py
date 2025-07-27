from .models import PremierLeagueTeamInfo, KickOffTime
from django.contrib import admin

class FixturePlannerAdmin(admin.ModelAdmin):
    list_display = ('team_name', 'team_id')

admin.site.register(PremierLeagueTeamInfo, FixturePlannerAdmin)
admin.site.register(KickOffTime)
