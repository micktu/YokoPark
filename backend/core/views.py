from django.http import JsonResponse
from core.models import Location, Game, Episode

def get_data(request):
    data = {
        'locations': {},
        'games': {},
        'episodes': {},
    }

    locations = Location.objects.all()
    for location in locations:
        data['locations'][location.id] = {
            'title': location.title,
            'description': location.description,
            'games': list(location.games.values_list('id', flat=True)),
            'episodes': list(location.episodes.values_list('id', flat=True)),
        }
    
    games = Game.objects.all()
    for game in games:
        data['games'][game.id] = {
            'title': game.title,
            'description': game.description,
        }

    episodes = Episode.objects.all()
    for episode in episodes:
        data['episodes'][episode.id] = {
            'url': episode.url,
        }

    return JsonResponse(data)
