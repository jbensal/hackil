
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
