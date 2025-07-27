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

def fetch_global_stats_with_retry(esf, max_retries=1, delay=5):
    """Attempts to fetch global stats with a retry mechanism."""
    for attempt in range(max_retries + 1):
        try:
            current_gw = save_all_global_stats_for_current_gw(esf)
            if current_gw is None or not isinstance(current_gw, int):
                raise ValueError("Unexpected return value from save_all_global_stats_for_current_gw")
            return current_gw
        except Exception as e:
            print(f"Attempt {attempt + 1} failed: {e}")
            if attempt < max_retries:
                print(f"Retrying in {delay} seconds...")
                time.sleep(delay)
            else:
                print("All retries failed.")
                return -1
            
current_gw = fetch_global_stats_with_retry(esf)

if current_gw == -1:
    print("Data allready updated for current gw")
else:
    write_global_stats_to_db_eliteserien(current_gw) if current_gw > 0 else print("\nDid not successfully read all global stats data")
