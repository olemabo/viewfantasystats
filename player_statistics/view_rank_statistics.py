from django.http import JsonResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from models.statistics.models.RankStatisticsModel import RankStatisticsModel
from player_statistics.db_models.eliteserien.user_statistics_model_eliteserien import EliteserienUserInfoStatistics
from models.statistics.models.RankStatisticsModel import RankStatisticsModel
from models.statistics.apiResponse.RankStatisticsApiResponse import RankStatisticsApiResponse
from constants import ranking_delimiter, fantasy_manager_eliteserien_url

class RankStatisticsAPIView(APIView):

    def get(self, request, format=None):
        try:
            last_x_years = int(request.GET.get("last_x_years", 1))
            list_of_ranks = []
            max_years = 1

            user_info_list = EliteserienUserInfoStatistics.objects.all()
            for user_info in user_info_list:
                rank_history = user_info.ranking_history
                max_years = max(max_years, len(rank_history))
                if len(rank_history) >= last_x_years:
                    avg_rank, avg_points = self.calculate_averages(rank_history, last_x_years)
                    list_of_ranks.append(RankStatisticsModel(
                        user_id=user_info.user_id,
                        name=f"{user_info.user_first_name} {user_info.user_last_name}",
                        team_name=user_info.user_team_name,
                        avg_rank=round(avg_rank / last_x_years, 0),
                        avg_points=round(avg_points / last_x_years, 1),
                        avg_rank_ranking=-1,
                        avg_points_ranking=-1
                    ))

            list_of_ranks = self.rank_and_sort(list_of_ranks)
            response_data = RankStatisticsApiResponse(fantasy_manager_eliteserien_url, list_of_ranks[:1000], max_years)

            return JsonResponse(response_data.toJson(), safe=False)

        except ValueError:
            return Response({'error': 'Invalid input for last_x_years'}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def calculate_averages(self, rank_history, last_x_years):
        total_rank = 0
        total_points = 0
        for rank_info in rank_history[-last_x_years:]:
            year_points_rank = rank_info.split(ranking_delimiter)
            total_rank += int(year_points_rank[2])
            total_points += int(year_points_rank[1])
        return total_rank, total_points
    
    def rank_and_sort(self, list_of_ranks):
        # Rank by average rank
        list_of_ranks.sort(key=lambda x: x.avg_rank)
        for idx, rank in enumerate(list_of_ranks):
            rank.avg_rank_ranking = idx + 1

        # Convert to JSON format
        return [rank.toJson() for rank in list_of_ranks]