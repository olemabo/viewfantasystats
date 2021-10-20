$(document).ready(function(){
    $('#button').click(function(e) {
        var start_gw = $("#start_gw2").val();
        var end_gw = $("#end_gw2").val();
        var combinations = $("#combinations").val();
        if (combinations == "FDR") {
            window.location.replace(window.location.hostname + "/fixture-planner/" + start_gw + "/" + end_gw + "/" + combinations);
        }
        if (combinations == "FDR-best") {
            var min_num_fixtures = $("#min_num_fixtures").val();
            window.location.replace(window.location.hostname + "/fixture-planner/" + start_gw + "/" + end_gw + "/" + combinations + "/" + min_num_fixtures);
        }
        if (combinations == "Rotation") {
            var teams_to_play =  $("#teams_to_play").val();
            var teams_to_check =  $("#teams_to_check").val();
            window.location.replace(window.location.hostname + "/fixture-planner/" + start_gw + "/" + end_gw + "/" + combinations + "/" + teams_to_play + "/" + teams_to_check);
        }
    });
});


function hide_include_teams_in_solution() {
  var x = document.getElementById("which_teams_to_check");
  if (x.style.display === "none") {
    x.style.display = "block";
  } else {
    x.style.display = "none";
  }
}
