var flights = angular.module("flights",[]);

flights.controller("flightsController",function($scope,$http)
{
    $scope.flights = [];
    
    $http.get('/currentflights')
    .success(function(data)
    {
        $scope.flights = data.flights;
        console.log($scope.flights.length);
    })
    .error(function(error)
    {
        console.log('error');
    });
    
    setInterval(function()
    {
        $http.get('/currentflights')
        .success(function(data)
        {
            $scope.flights = data.flights;
            console.log($scope.flights.length);
        })
        .error(function(error)
        {
            console.log('error');
        });
    },10000);
});