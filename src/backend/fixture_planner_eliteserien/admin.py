from django.contrib import admin
from .models import EliteserienTeamInfo, EliteserienKickOffTime

class EliteserienFixtureAdmin(admin.ModelAdmin):
    list_display = ('__str__', 'team_id')

admin.site.register(EliteserienTeamInfo, EliteserienFixtureAdmin)
admin.site.register(EliteserienKickOffTime)
