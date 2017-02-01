from __future__ import unicode_literals

from django.db import models

class Location(models.Model):
    def __unicode__(self):
        return self.title

    title = models.CharField(max_length=40)
    description = models.TextField()
    games = models.ManyToManyField('Game', related_name='locations', blank=True)
    episodes = models.ManyToManyField('Episode', related_name='locations', blank=True)

class Episode(models.Model):
    def __unicode__(self):
        return self.url
    
    url = models.CharField(max_length=80)

class Game(models.Model):
    def __unicode__(self):
        return self.title

    title = models.CharField(max_length=40)
    description = models.TextField()
