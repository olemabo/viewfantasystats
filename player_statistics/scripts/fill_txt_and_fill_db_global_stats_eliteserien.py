import django
import sys
import os
import time

path = os.path.abspath('../..') if "OleMartinBorge" in os.getcwd() else "/home/olebo/viewfantasystats/"

sys.path.append(path)
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'fplwebpage.settings')
django.setup()

from player_statistics.backend.fill_db_from_txt.fill_db_global_statistics_eliteserien import write_global_stats_to_db_eliteserien
from player_statistics.backend.read_api_data_to_txt.read_global_statistics import save_all_global_stats_for_current_gw
from constants import esf

try:
    current_gw = save_all_global_stats_for_current_gw(esf)
except Exception as e:
    print("Første forsøk feilet:", e)
    print("Venter 120 sek før nytt forsøk...\n")
    
    time.sleep(120)
    
    try:
        current_gw = save_all_global_stats_for_current_gw(esf)
    except Exception as e:
        print("Andre forsøk feilet også:", e)
        current_gw = -2  # signaliser hard failure

# eksisterende logikk
if current_gw == -1:
    print("Data allready updated for current gw")
elif current_gw > 0:
    write_global_stats_to_db_eliteserien(current_gw)
else:
    print("\nDid not successfully read all global stats data")