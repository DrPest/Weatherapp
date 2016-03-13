function convToC(tempF) {
  return Math.round((tempF - 32) / (9 / 5) * 10) / 10;
}

function convToF(tempC) {
  return Math.round(((tempC * 9 / 5) + 32) * 10) / 10;
}

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      //current weather URL
      var apiURL = "http://api.openweathermap.org/data/2.5/weather?lat=" + position.coords.latitude + "&lon=" + position.coords.longitude + "&units=metric&appid=01824f9ea7d3bc9d7df7c55e7e85bbe1";

      //5 day forecast URL
      var apiURL5 = "http://api.openweathermap.org/data/2.5/forecast?lat=" + position.coords.latitude + "&lon=" + position.coords.longitude + "&units=metric&appid=01824f9ea7d3bc9d7df7c55e7e85bbe1";

      //Get current weather & insert, should be easy enough to understand
      $.getJSON(apiURL, function(data) {
        $("#loc").text(data.name);
        $(".temp").text(Math.round(+data.main.temp * 10) / 10 + "°C");
        $("#pic").attr("src", "http://openweathermap.org/img/w/" + data.weather[0].icon + ".png");
      });

      //Get 5 day forecast and get it into the DOM. Expect further comments.
      $.getJSON(apiURL5, function(data) {
        var panelNum = 1;
        for (var i = 0; i < data.list.length; i++) {
          //Construct the selector for the right panel. Each day should have it's own panel.      
          var panel = "#pan" + panelNum;

          //Every 8 iterations a new day begins. 
          if ((i + 1) % 8 == 0) {
            panelNum++;
          }

          //Concatonate the html to display our data, needs more styling.
          var concat = "<div class=\"well\"><h4><small>" + data.list[i].dt_txt.slice(11,-3) + ": </small><span class=\"temp\">" + Math.round(data.list[i].main.temp*10)/10 + "°C</span> <img src=\"http://openweathermap.org/img/w/" + data.list[i].weather[0].icon + ".png\"></img></h5></div>";
          
          //Append the html to the panel we have determined earlier.
          $(concat).appendTo(panel);

          //Cheatsheat for the JSON:
          //data.list[i].dt_txt Timestamp
          //data.list[i].main.temp = 3 hour temperatures
          //data.list[i].weather[0].icon = 3 hour icons
        }
      });
    });
  }
}

$(document).ready(function() {
  $("#temptoggle").on("click", function() {
    var tempstr = $(".temp").text();
    var temp = tempstr.slice(0, -2);
    if (tempstr.endsWith("C")) {
      temp = convToF(parseFloat(temp));
      $(".temp").text(temp + " F");
      $("#temptoggle").text("to Celsius");
    } else {
      temp = convToC(parseFloat(temp));
      $(".temp").text(temp + "°C");
      $("#temptoggle").text("to Fahrenheit");
    }
  });
  getLocation();
});