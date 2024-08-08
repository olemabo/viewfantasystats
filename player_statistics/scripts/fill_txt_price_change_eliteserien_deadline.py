import django
import sys
import os

path = os.path.abspath('../..') if "OleMartinBorge" in os.getcwd() else "/home/olebo/viewfantasystats/"

sys.path.append(path)
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'fplwebpage.settings')
django.setup()


from player_statistics.backend.read_api_data_to_txt.read_price_change_statistics import read_price_change_statistics
from constants import esf


if __name__ == '__main__':
    response = read_price_change_statistics(esf, is_gw_deadline=True)
