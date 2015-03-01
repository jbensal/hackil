var autocomplete; //make it global across files. 
function setUpAutoComplete(){
 var countryRestrict = { 'country':$("#q1").val()};

  autocomplete = new google.maps.places.Autocomplete(

      /** @type {HTMLInputElement} */(document.getElementById('q2')),
      {
        types: ['(cities)'],
        componentRestrictions: countryRestrict
      });
      autocomplete.setComponentRestrictions({ 'country': $("#q1").val() });
} 
var finished = 0;
function sendPostData(location){
    locationObj
      var locationObj = {"lat": location.k, "long":location.D, "category": ["landmarks"], "location" : $("#q2").val()};
      locationObj = JSON.stringify(locationObj)
      console.log(locationObj)
      $.ajax({
          type: "POST",
          url: "/search",
          data: locationObj, 
          dataType: "json",
          contentType: "application/json",
          success: function(msg) {
            finished++
            if(finished==2){
                console.log("hi")
                window.location = "http://www.google.com/"
            }

          },
          error: function(msg){
            console.log(msg);
          }
      });
      var loc = {"lat": location.k, "long":location.D};
        loc = JSON.stringify(loc)

      $.ajax({
          type: "POST",
          url: "/instaSearch",
          data: loc, 
          dataType: "json",
          contentType: "application/json",
          success: function(msg) {
            finished++
            console.log(finished)
            if(finished==2){
                console.log("hi")
                window.location = "http://www.google.com/"
            }
              console.log(msg)
          },
          error: function(msg){
              console.log(msg)
          }
      });

}