var app = angular.module("app",[]);

app.controller("getController",
function($scope,$http)
{
    $scope.nombre = 'gustavo';
    $scope.flights = [];
    
    $http.get("/select")
            .success(function(data)
            {
                //console.log(data);
                $scope.flights = data.flight;
            })
            .error(function(error)
            {
                console.log('error');
            });
    
    setInterval(function()
        {
            $http.get("/select")
            .success(function(data)
            {
                //console.log(data);
                $scope.flights = data.flight;
            })
            .error(function(error)
            {
                console.log('error');
            });
        }, 30000);
        
    
    
    
    
});