import django
import sys
import os

path = os.path.abspath('../..') if "OleMartinBorge" in os.getcwd() else "/home/olebo/viewfantasystats/"

sys.path.append(path)
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'fplwebpage.settings')
django.setup()

from player_statistics.backend.fill_db_from_txt.fill_db_cup_statistics_eliteserien import write_cup_statistics_to_db_eliteserien
from player_statistics.backend.read_api_data_to_txt.read_cup_info_statistics import read_cup_info_statistics_from_league_number_eliteserien

if __name__ == '__main__':
    number_of_minutes_to_run = 15
    response = read_cup_info_statistics_from_league_number_eliteserien(60 * number_of_minutes_to_run)
    write_cup_statistics_to_db_eliteserien() if response == 1 else print("\nDid not read all data this iteration")