    var center = {lat: 5, lng: -73.355};
    //console.log(getFlights());
    var markers = [];
    var flights = [];
    var pos = [];
    var infowindow;
    console.log(markers.length);
    
    var map;
    
    function initMap() 
    {    
        // Create a map object and specify the DOM element for display.
        map = new google.maps.Map(document.getElementById('map1'), {
          center: center,
          scrollwheel: false,
          zoom: 6,
          streetViewControl: false,
          mapTypeControl: true,
            mapTypeControlOptions: {
                style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
                position: google.maps.ControlPosition.LEFT_CENTER
            },
          mapTypeId: google.maps.MapTypeId.SATELLITE
        });
        
        //https://storage.googleapis.com/maps-devrel/google.json
        setInterval(function()
        {
            map.data.loadGeoJson('/lastposgeojson');
        },30000);
        
    }
    
    
    
    