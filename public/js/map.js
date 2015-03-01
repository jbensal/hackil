var map;
initialize();
    function initialize() {
      var styles = [
            {
            "stylers": [
            {
            "hue": "#ff1a00"
            },
            {
            "invert_lightness": true
            },
            {
            "saturation": -100
            },
            {
            "lightness": 33
            },
            {
            "gamma": 0.5
            }
            ]
            },
            {
            "featureType": "water",
            "elementType": "geometry",
            "stylers": [
            {
            "color": "#2D333C"
            }
            ]
            }
            ]
      var styledMap = new google.maps.StyledMapType(styles,{name: "Styled Map"});  
var mapOptions;
      $.ajax({
          type: "GET",
          url: "/instaFriends", 
          dataType: "json",
          contentType: "application/json",
          success: function(msg) {
            console.log(msg)

            var myLatlng = new google.maps.LatLng(msg[0].lat,msg[0].long);
              //console.log(msg[0].lat);

            var mapOptions = {
            zoom: 18,
            center: myLatlng
            }
              map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
              map.mapTypes.set('map-style', styledMap);
              map.setMapTypeId('map-style');
            
                for (var x = 0; x < msg.length; x++) {
                    console.log(msg[x].lat);
            var latlng = new google.maps.LatLng(msg[x].lat, msg[x].long);
            new google.maps.Marker({
                position: latlng,
                map: map,
                icon: 'http://maps.google.com/mapfiles/kml/paddle/blu-circle.png'
            });

        };
          },
          
          error: function(msg){
              console.log(msg)
          }
     });

      $.ajax({
          type: "GET",
          url: "/factualData", 
          dataType: "json",
          contentType: "application/json",
          success: function(msg) {
            // console.log('inside factual data')
            // console.log(msg)

            var myLatlng = new google.maps.LatLng(msg[0].latitude,msg[0].longitude);
              //console.log(msg[0].lat);

            var mapOptions = {
            zoom: 18,
            center: myLatlng
            }
              map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
              map.mapTypes.set('map-style', styledMap);
              map.setMapTypeId('map-style');
            
                for (var x = 0; x < msg.length; x++) {
                    // console.log(msg[x].latitude);
                    // console.log('added factual marker')
            var latlng = new google.maps.LatLng(msg[x].latitude, msg[x].longitude);
            new google.maps.Marker({
                position: latlng,
                map: map,
                // icon: 'http://maps.google.com/mapfiles/kml/paddle/blu-circle.png'
            });

        };
          },
          
          error: function(msg){
              console.log(msg)
          }
     });


    }

    google.maps.event.addDomListener(window, 'load', initialize);
