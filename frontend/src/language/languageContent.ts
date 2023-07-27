export const content_json = {
    English: {
        General: {
            fdr: "FDR",
            defence: "Defence",
            offence: 'Offence',
            search_button_name: "Search",
            all_players: "All Players",
            all_teams: "All Teams",
            all_gws: "All GWs",
            total_all_gws: "Total all gws",
            all_positions: "All positions",
            by_position: "By Position",
            goalkeepers: "Goalkeepers",
            goalkeeper: "goalkeeper",
            defenders: "Defenders",
            defender: "defender",
            midfielders: "Midfielders",
            midfielder: "midfielder",
            forwards: "Forwards",
            forward: "forward",
            by_team: "By Team",
            view: "View",
            top_x_managers: "Top 'x' managers",
            eo: "EO",
            top: "top",
            last_x_rounds: "Last 'x' GWs",
            gw: "GW",
            round_short: "GW",
            close: "Close",
            menu: "Menu",
            eliteserien: "Eliteserien",
            premier_league: "Premier League",
            see_team: "View team",
            name: "Name",
            rank: "Ranking",
            ranking: "Rank",
            points: "Points",
            points_away_from_first: "Points from 1st",
            last: "Last",
            year: "Year",
            seasons: "seasons",
            season: "season",
            previous: "Previous",
            teamname: "Team name",
            and: 'and',
            goal: 'Goal',
            assists: 'Assist',
            yellow_cards: 'Yellow cards',
            red_cards: 'Red cards',
            saves: 'Saves',
            bonus: 'Bonus',
            penalties_saved: 'Penalties saved',
            penalties_missed: 'Penalties missed',
            own_goals: 'Own goals',
            add_player: 'Add player',
            add: 'Add',
            new: 'new',
            playerName: 'Player name',
            removePlayer: 'Remove player',
            managers: 'managers',
            player: 'Player',
            here: 'here',
        },
        Fixture: {
            FixturePlanner: {
                title: "FDR Planner",
            }, 
            TeamPlanner: {
                title: "Team Planner",
                description_1: "The team planner can be used to plan substitutions for a given team. By entering the team ID in the 'Team ID' box you can pick up an exciting team, otherwise you can manually add one player at a time to the various positions using the 'Add Player' buttons. You can remove a player by clicking on the red line in the box with the player's name.",
                description_2: "If the buttons are available, you can choose between Defensive, Offensive and FDR on the matches for the various positions.",
                description_3: "If you click on a match field once, the color will change to gray (intended: bench player). On the second click the match field will be removed (intended: player has been replaced by the team or is not part of the team for this round).",
            },
            RotationPlanner: {
                title: "Rotation Planner",
                avg_fdr_score: "Avg FDR score:",
                teams_in_solution: "Team(s) that must be in solution: ",
                not_in_solution: "Team(s) removed from solution: ",
                teams_can_be_in_solution: "Team can be in solution",
                teams_must_be_in_solution: "Team must be in solution",
                teams_cant_be_in_solution: "Team can't be in solution",
            },
            PeriodPlanner: {
                title: "Period Planner",
            }, 
            teamId: "Team ID",
            noTeamsChosen: "All teams remove from 'Hide teams'",
            removeAllText: "Show all teams",
            addAllText: "Hide all teams",
            must_be_smaller: 'must be smaller than',
            fixture: "Fixture Planning",
            gw_start: "From GW",
            gw_end: "To GW",
            teams_to_check: "Teams to check",
            teams_to_check_1: "Teams",
            teams_to_check_2: "to check",
            teams_to_play: "Teams to play",
            teams_to_play_1: "Teams",
            teams_to_play_2: "to play",
            min_fixtures: "Minimum fixtures",
            filter_button_text: "Hide teams",
            team: "Team",
            search: "Search",
        },
        Statistics: {
            PlayerOwnership: {
                title: "Player Ownership",
                owned_by: "Owned by",
                captain: "Captaincy",
                vice_captain: "Vice captain",
                benched: "Benched",
                tot_ownership: "Total ownership",
                player: "Player",
                chip_title: "Chip usage in",
                chip_total_usage_title: "Chips used all gws",
                percent: "Percentage",
                no_chip: "No Chips",
                wildcard: "Wildcard",
                rich_uncle: "Rich Uncle",
                forward_rush: "Forward Rush",
                two_captain: "2 Captains",
                three_captain: "Triple Captain",
                free_hit: "Free Hit",
                bench_boost: "Bench Boost",
                team_info: "Team Info",
                value: "Value",
                avg_team_value: "Avg. Team Value",
                avg_transfers: "Avg. Transfers",
                avg_transfer_cost: "Avg. Transfer Cost",
                search_text: "Search..",
            },
            SearchUserName: {
                title: "User search",
            },
            RankStatistics: {
                title: "Rank Statitstics",
                rank: "Avg. Ranking",
                points: "Avg. Points",
                last_season: "Last 'x' seasons",
            },
            PlayerStatistics: {
                title: "Player Statistics",
                bps: "Bps",
                points: "Points",
                ict: "ICT",
                threat: "Threat",
                influence: "Influence",
                creativity: "Creativity",
            },
            LiveFixtures: {
                title: "Fixture Statistics",
            },
            statistic: "Statistics",
            search: "Search",
        },
        LongTexts: {
            fdrValues: 'FDR values: ',
            fdrDescription: 'Dark blue boxes mark a double round, while black boxes mark that the team does not have a match that round.',
            fixtureAreFrom: 'Match program and difficulty levels are taken from',
            ExcelSheet: 'this Excel sheet',
            to: 'made by',
            bestFixture: 'The best match program is at the top and the worst at the bottom',
            rankTeams: 'ranks teams according to best match schedule between two rounds',
            markPeriode: 'marks the period a team has the best match schedule between two rounds. Best series of matches are marked with black border colors. For example, you want to find out which period between rounds 1 and 20 each team has the best matches.',
            becomesRes: 'will then be 1 and 20 respectively.',
            leastNumber: 'is the minimum number of consecutive games a team must have.',
            ownershiptDescription: 'Data is obtained from the 100, 1000 and 5000 best ESF managers each round immediately after the exchange deadline. Normally, this is posted approx. 50 minutes after the first start of the match. Statistics on chip usage and team info also only apply to top 100, 1000 and 5000 (not all in the entire game).',
            ownershiptDescriptionFPL: 'Data is obtained from the 100, 1000 and 10000 best FPL managers each round immediately after the exchange deadline. Normally, this is posted approx. 90 minutes after the first start of the match. Statistics on chip usage and team info also only apply to top 100, 1000 and 10000 (not all in the entire game).',
            liveFixturesDescription: 'Statistics around, among other things, Bonus Point System (BPS), minutes played and points for players in the various matches.',
            rotationPlannerDescription: 'shows combinations of teams that can be rotated to provide the best possible match schedule. For example, you want to find two goalkeepers who rotate well between rounds 10 and 20.',
            rotationPlannerDescription_1: 'will be 2 because you must have 2 keepers who will rotate.',
            rotationPlannerDescription_2: 'becomes 1 because only one of the two goalkeepers will play per round.', 
        },
        Popover: {
            effectiveOwnership: 'Effective ownership is a calculation that takes into account managers who start a player (not just those who own them), along with those who captain the player. It is therefore the ownership share that starts the player plus the ownership share that has captained the player.',
            chosenBy: 'Percentage who have this player in their squad (does not have to be in the starting eleven).',
            topOwnership: 'Percentage among all managers who own this player (figures taken at the start of the round). So not just among the top ',
            minutesPlayed: 'Number of minutes played. The number of minutes is updated live while the matches are being played.',
            points: 'The number of points the player has received this round. The scores are updated live as the matches are played.',
            EO: 'EO (%) for top 1000 managers from round ',
            moreInfoEO: 'For more info and complete statistics, see ',
        },
    },
    Norwegian: {
        General: {
            fdr: "FDR",
            defence: "Defensivt",
            offence: 'Offensivt',
            search_button_name: "Søk",
            all_players: "Alle spiller",
            all_teams: "Alle lag",
            all_gws: "Alle runder",
            total_all_gws: "Totalt alle runder",
            all_positions: "Alle posisjoner",
            by_position: "Etter posisjon",
            goalkeepers: "Keepere",
            goalkeeper: "keeper",
            defenders: "Forsvarere",
            defender: "forsvarer",
            midfielders: "Midtbanespillere",
            midfielder: "midtbanespiller",
            forwards: "Angrepsspillere",
            forward: "angrepsspiller",
            by_team: "Etter lag",
            view: "Se",
            top: "topp",
            top_x_managers: "Topp 'x' lag",
            last_x_rounds: "Siste 'x' runder",
            gw: "Runde",
            eo: "EO",
            round_short: "R",
            menu: "Meny",
            close: "Lukk",
            eliteserien: "Eliteserien",
            premier_league: "Premier League",
            see_team: "Se lag",
            name: "Navn",
            rank: "Plassering",
            last: "Siste",
            year: "År",
            ranking: "Rank",
            points: "Poeng",
            points_away_from_first: "Poeng fra nr 1",
            seasons: "sesonger",
            season: "sesong",
            previous: "Forrige",
            teamname: "Lagnavn",
            and: 'og',
            goal: 'Mål',
            assists: 'Målgivende passning',
            yellow_cards: 'Gule kort',
            red_cards: 'Røde kort',
            saves: 'Redninger',
            bonus: 'Bonus',
            penalties_saved: 'Strafferedning',
            penalties_missed: 'Straffebom',
            own_goals: 'Selvmål',
            add_player: 'Legg til spiller',
            add: 'Legg til',
            new: 'ny',
            playerName: 'Spillernavn',
            removePlayer: 'Fjern spiller',
            managers: 'managere',
            player: 'Spiller',
            here: 'her',
        },
        Fixture: {
            FixturePlanner: {
                title: "FDR Planner",
            },
            TeamPlanner: {
                title: "Lagplanlegger",
                description_1: "Bruk lagplanleggeren til å planlegge bytter frem i tid. Man kan hente ut eksisterende lag ved legge inn lag-ID i 'Lag-ID' boksen og gjøre et søk. Ellers kan man manuelt legg til en og en spiller til de ulike posisjonene ved hjelp av 'Legg til spiller'-knappene. Spillere kan fjernes ved å klikke på den rød streken i boksen med spillernavn.",
                description_2: "For ESF kan man også velge mellom defensivt, offenstivt og FDR på kampene til de ulike posisjonene. ",
                description_3: "Man kan klikke på kamp-feltene for å de ulike visualiseringer. Et klikk vil gi grå farge (tiltenkt: benk-spiller). To klikk vil gjøre at kamp-feltet fjernes (tiltenkt: spiller er byttet ut av laget eller er ikke en del av laget for denne runden). ",
            }, 
            RotationPlanner: {
                title: "Rotasjonsplanlegger",
                avg_fdr_score: "Gj. snittlig FDR score:",
                teams_in_solution: "Lag som må være i løsningene: ",
                not_in_solution: "Lag som blir fjernet fra løsningene: ",
                teams_can_be_in_solution: "Lag kan være i løsning",
                teams_must_be_in_solution: "Lag må være i løsning",
                teams_cant_be_in_solution: "Lag er ikke i løsning"
            },
            PeriodPlanner: {
                title: "Periodeplanlegger",
            },
            teamId: "Lag-ID",
            noTeamsChosen: "Alle lag er filtrert vekk",
            removeAllText: "Fjern alle lag",
            addAllText: "Vis alle lag",
            must_be_smaller: 'må være mindre enn',
            fixture: "Kampprogram",
            gw_start: "Fra runde",
            gw_end: "Til runde",
            teams_to_check: "Antall lag",
            teams_to_check_1: "Antall lag",
            teams_to_check_2: "",
            teams_to_play: "Lag som skal brukes",
            teams_to_play_1: "Lag som",
            teams_to_play_2: "skal brukes",
            min_fixtures: "Minimum kamper:",
            filter_button_text: "Filtrer lag",
            team: "Lag",
        },
        Statistics: {
            PlayerOwnership: {
                title: "Eierandel",
                owned_by: "Valgt av",
                captain: "Kaptein",
                vice_captain: "Visekaptein",
                benched: "Benket",
                tot_ownership: "Total eierandel",
                player: "Spiller",
                chip_title: "Chips brukt i",
                chip_total_usage_title: "Chips brukt alle runder",
                percent: "Prosentandel",
                no_chip: "Ingen Chips",
                wildcard: "Wildcard",
                rich_uncle: "Rik Onkel",
                forward_rush: "Spiss Rush",
                two_captain: "2 Kapteiner",
                three_captain: "Trippel Kaptein",
                free_hit: "Free Hit",
                bench_boost: "Bench Boost",
                team_info: "Laginfo",
                value: "Verdi",
                avg_team_value: "Gj. snittlig lagverdi",
                avg_transfers: "Gj. snittlig antall bytter",
                avg_transfer_cost: "Gj. snittlig byttekostnad",
                search_text: "Søk..",
            },
            SearchUserName: {
                title: "Søk blant managere",
            },
            RankStatistics: {
                title: "Rankingstatistikk",
                rank: "Gj. snittlig ranking",
                points: "Gj. snittlig poeng",
                last_season: "Siste 'x' sesonger",
            },
            PlayerStatistics: {
                title: "Spillerstatistikk",
                bps: "Bps",
                threat: "Threat",
                ict: "ICT",
                influence: "Influence",
                creativity: "Creativity",
                points: "Points",
            },
            LiveFixtures: {
                title: "Kampstatistikk",
            },
            statistic: "Statistikk",
            search: "Søk",
        },
        LongTexts: {
            fdrValues: 'FDR verdier: ',
            fdrDescription: 'Mørkeblå bokser markerer en dobbeltrunde, mens svarte bokser markerer at laget ikke har kamp den runden.',
            fixtureAreFrom: 'Kampprogram og vanskelighetsgrader er hentet fra',
            ExcelSheet: 'Excel arket',
            to: 'til',
            bestFixture: 'Best kampprogram ligger øverst og dårligst nederst',
            rankTeams: 'rangerer lag etter best kampprogram mellom to runder',
            markPeriode: 'markerer perioden et lag har best kampprogram mellom to runder. Beste rekke med kamper er markert med svart kantfarger. Eksempelvis ønsker man å finne ut hvilken periode mellom runde 1 og 20 hvert lag har best kamper.',
            becomesRes: 'blir da henholdsvis 1 og 20.',
            leastNumber: 'er minste antall etterfølgende kamper et lag må ha.',
            ownershiptDescription: 'Data hentes ut fra de 100, 1000 og 5000 beste ESF-managerne hver runde rett etter byttefrist. Normalt blir dette lagt ut ca. 50 minutter etter først kampstart. Statistikk om chipsbruk og laginfo gjelder også kun for topp 100, 1000 og 5000 (ikke alle i hele spillet).',
            ownershiptDescriptionFPL: 'Data hentes ut fra de 100, 1000 og 10000 beste FPL-managerne hver runde rett etter byttefrist. Normalt blir dette lagt ut ca. 90 minutter etter først kampstart. Statistikk om chipsbruk og laginfo gjelder også kun for topp 100, 1000 og 10000 (ikke alle i hele spillet).',
            liveFixturesDescription: 'Statistikk rundt blant annet opta index, minutter spilt og poeng for spillere i de ulike kampene.',
            rotationPlannerDescription: 'viser kombinasjoner av lag som kan roteres for å gi best mulig kampprogram. Eksempelvis ønsker man å finne to keepere som roterer bra mellom runde 10 og 20.',
            rotationPlannerDescription_1: 'blir 2 fordi man skal ha 2 keepere som skal rotere.',
            rotationPlannerDescription_2: 'blir 1 fordi kun en av de to keeperene skal spille per runde.',

        },
        Popover: {
            effectiveOwnership: 'Effektivt eierskap er en beregning som tar hensyn til managere som starter en spiller (ikke bare de som eier dem), sammen med de som kapteiner spilleren. Det er altså eierandel som starter spilleren pluss eierandelen som har kapteinet spilleren. ',
            chosenBy: 'Prosentandel som har denne spilleren i troppen sin (trenger ikke være i startelleveren).',
            topOwnership: 'Prosentandel blant alle managere som eier denne spilleren (tall hentet ved rundestart). Altså ikke bare blant topp ',
            minutesPlayed: 'Antall minutter spilt. Antall minutter oppdateres live mens kampene spilles.',
            points: 'Antall poeng spilleren har fått denne runden. Poengene oppdateres live mens kampene spilles.',
            EO: 'EO (%) for topp 1000 managere fra runde ',
            moreInfoEO: 'For mer info og fullstendig statistikk, se ',
        },
     }
};