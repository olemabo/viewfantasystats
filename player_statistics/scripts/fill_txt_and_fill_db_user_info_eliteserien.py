import django
import sys
import os

prod = "/home/olebo/viewfantasystats/"
local = os.path.abspath('../..')

sys.path.append(prod)
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'fplwebpage.settings')
django.setup()


from player_statistics.backend.read_api_data_to_txt.read_user_info_statistics import read_user_info_statistics_eliteserien
from player_statistics.backend.fill_db_from_txt.fill_db_user_info_statistics import write_user_info_to_db_eliteserien
from constants import esf


if __name__ == '__main__':
    number_of_minutes_to_run = 20
    response = read_user_info_statistics_eliteserien(esf, 60 * number_of_minutes_to_run)
    print("\nNot finished scraping all user info to txt files") if response == -1 else print("\nFinished scraping all user info to txt files")
    write_user_info_to_db_eliteserien() #if response == 1 else print("Dont write to db")