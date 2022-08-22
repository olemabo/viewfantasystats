import React, { useState, useEffect, FunctionComponent } from 'react';
import axios from 'axios';

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';

type LanguageProps = {
    content: any;
}

export const PlayerStatisticsPage : FunctionComponent<LanguageProps> = (props) => {
   
    return <> </>
};

export default PlayerStatisticsPage;


// {% extends "_root.html" %}

// {% block content %}
// {% load static %}
// <link rel="stylesheet" href="{% static 'css/player_statistics.css' %}">

// <h2>
//     Player Statistics
// </h2>

// <div class="form-info">
//     <div class="describe-boxes one">
//         View
//     </div>
//     <div class="describe-boxes two">
//         Sorted by
//     </div>
//     <div class="describe-boxes three">
//         Last number of GWs
//     </div>
// </div>
// <form class="form-stuff text-center" action="/statistics/player/" method="post">
//     <select class="input-box player-input-box" id="sort_players_dropdown" name="sort_players">

//         {% if sorting_keyword == "All" %}
//             <option selected value="All">
//                 All Players
//             </option>
//         {% else %}
//             <option value="All">All Players</option>
//         {% endif %}

//         <option disabled style="font-weight:900;">By Position</option>

//         {% if sorting_keyword == "Goalkeepers" %}
//             <option selected value="Goalkeepers">Goalkeepers</option>
//         {% else %}
//             <option value="Goalkeepers">Goalkeepers</option>
//         {% endif %}
//         {% if sorting_keyword == "Defenders" %}
//             <option selected value="Defenders">Defenders</option>
//         {% else %}
//             <option value="Defenders">Defenders</option>
//         {% endif %}
//         {% if sorting_keyword == "Midfielders" %}
//             <option selected value="Midfielders">Midfielders</option>
//         {% else %}
//             <option value="Midfielders">Midfielders</option>
//         {% endif %}
//         {% if sorting_keyword == "Forwards" %}
//             <option selected value="Forwards">Forwards</option>
//         {% else %}
//             <option value="Forwards">Forwards</option>
//         {% endif %}

//         <option disabled style="font-weight:900;">By Team</option>

//         {% for team in teams %}
//             {% if sorting_keyword == team %}
//                 <option selected value="{{team}}">{{ team }}</option>
//             {% else %}
//                 <option value="{{team}}">{{ team }}</option>
//             {% endif %}
//         {% endfor %}
//     </select>

//     <select class="input-box category-input-box" id="sort_on_dropdown" name="sort_on">
//         {% for sort in categories %}
//             {% if sort_on == sort %}
//                 <option selected value="{{sort}}">{{ sort }}</option>
//             {% else %}
//                 <option value="{{sort}}">{{ sort }}</option>
//             {% endif %}
//         {% endfor %}
//     </select>

//     <select class="input-box last-x-input-box" id="last_x_dropdown" name="last_x">
//         {% for x in last_x_gws %}
//             {% if last_x_gw == x %}
//                 <option selected value="{{x}}">{{ x }}</option>
//             {% else %}
//                 <option value="{{x}}">{{ x }}</option>
//             {% endif %}
//         {% endfor %}
//     </select>

//     <input type="submit" class="input-box search-box chosen-category" value="Search" checked name="combination">
// </form>

// <div class="container-player-stats">
//     <table>
//     <thead>
//         <tr>
//             {% for category in categories %}
//                 {% if category == "Name" %}
//                     <th class="name-col">{{category}}</th>
//                 {% else %}
//                     <th>{{category}}</th>
//                 {% endif %}
//             {% endfor %}
//         </tr>
//     </thead>

//     <tbody>
//         {% for player_i in player_info %}
//         <tr>
//             {% for attribute in player_i %}
//                 {% if forloop.counter == 1 %}
//             <td class="name-col"> <div class="format-name-col">{{ attribute }}</div> </td>
//                 {% else %}
//                     <td> {{ attribute }} </td>
//                  {% endif %}
//             {% endfor %}
//         </tr>
//         {% endfor %}
//     </tbody>
// </table>
// </div>



// {% endblock %}