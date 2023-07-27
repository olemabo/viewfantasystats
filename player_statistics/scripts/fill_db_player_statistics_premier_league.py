import django
import sys
import os

path = os.path.abspath('../..') if "ole.borge" in os.getcwd() else "/home/olebo/viewfantasystats/"

sys.path.append(path)
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'fplwebpage.settings')
django.setup()

from player_statistics.backend.fill_db_from_txt.fill_db_player_statistics import fill_database_all_players
from constants import fpl


if __name__ == '__main__':
    fill_database_all_players(fpl)