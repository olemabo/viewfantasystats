class KickOffTimeGameweeks():
    months_norwegian = ["Jan", "Feb", "Mar", "April", "Mai", "Juni", "Juli", "Aug", "Sep", "Okt", "Nov", "Des"]

    def __init__(self, gameweek, day_month):
        self.gameweek = gameweek
        self.day_month = self.convert_to_only_date(day_month)

    def convert_to_only_date(self, date):
        yyyymmdd = str(date).split(" ")[0].split("-")
        return yyyymmdd[2] + ". " + self.convert_month_number_to_string_norwegian(yyyymmdd[1])

    def convert_month_number_to_string_norwegian(self, month):
        return self.months_norwegian[int(month) - 1]