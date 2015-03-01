// YOUR JAVASCRIPT HERE

function success(position) {
  var latitude  = position.coords.latitude;
  var longitude = position.coords.longitude;
  console.log(position.coords.latitude)
  console.log(position.coords.longitude)
};

function error() {
	console.log("error")
};


