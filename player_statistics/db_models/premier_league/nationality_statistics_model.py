from django.db import models
from django.urls import reverse
from constants import total_number_of_gameweeks


class PremierLeagueNationalityStatistics(models.Model):
    # one stat for each gameweek + 1 total stat for all gws
    number_of_gws = total_number_of_gameweeks
    number_of_extra_info = 8  # [Freehit, BB, TC, WC, None, Avg Value, Avg event transfer, Avg transfer cost]

    country_code = models.CharField(primary_key=True, help_text='ISO name', max_length=5)
    country_name = models.CharField(max_length=30, help_text="Country name")
    number_of_managers_from_this_country = models.IntegerField(help_text="Number of managers from this country")

    # Metadata
    class Meta:
        ordering = ['country_name', 'number_of_managers_from_this_country', 'country_code']

    # Methods
    def get_absolute_url(self):
        """Returns the url to access a particular instance of MyModelName."""
        return reverse('model-detail-view', args=[str(self.country_name)])

    def __str__(self):
        """String for representing the MyModelName object (in Admin site etc.)."""
        return f'{self.country_name}'