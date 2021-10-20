function hide_include_teams_in_solution() {
  var x = document.getElementById("which_teams_to_check");
  if (x.style.display === "none") {
    x.style.display = "block";
  } else {
    x.style.display = "none";
  }
}

function change_category(category) {
    var start_gw = $("#start_gw2").val();
    var end_gw = $("#end_gw2").val();
    window.location.replace("/fixture-planner-eliteserien/" + start_gw + "/" + end_gw + "/" + category);
}