import django
import sys
import os

prod = "/home/olebo/viewfantasystats/"
local = os.path.abspath('../..')

sys.path.append(prod)
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'fplwebpage.settings')
django.setup()

from player_statistics.backend.read_api_data_to_txt.read_global_statistics import save_all_global_stats_for_current_gw
from player_statistics.backend.fill_db_from_txt.fill_db_global_statistics import write_global_stats_to_db
from constants import eliteserien_folder_name

response = save_all_global_stats_for_current_gw(eliteserien_folder_name)
write_global_stats_to_db() if response == 1 else print("\nDid not successfully read all global stats data")