from django.contrib import admin
from core.models import Location, Episode, Game

class LocationAdmin(admin.ModelAdmin):
    pass

admin.site.register(Location, LocationAdmin)

class GameAdmin(admin.ModelAdmin):
    pass

admin.site.register(Game, GameAdmin)

class EpisodeAdmin(admin.ModelAdmin):
    pass

admin.site.register(Episode, EpisodeAdmin)
