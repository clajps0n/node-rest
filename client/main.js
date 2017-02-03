var graphics = angular.module("graphics",["chart.js"]);

graphics.controller("getController",
function($scope,$http)
{
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
                $scope.flights = data.flight;
            })
            .error(function(error)
            {
                console.log('error');
            });
        }, 30000);
        
    
    
    
    
})
.controller("LineCtrl", function ($scope) {

  $scope.labels = ["00", "01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", 
                    "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23"];
  $scope.series = ['Series A'];
  $scope.data = [
    [65, 59, 80, 81, 56, 55, 40],
    [28, 48, 40, 19, 86, 27, 90],
    [33, 44, 55, 19, 22, 77, 66],
    [23, 59, 65, 81, 66, 33, 40],
    [28, 77, 99, 45, 86, 27, 8],
    [86, 56, 34, 19, 22, 86, 12, 86, 56, 34, 19, 22, 86, 12]
  ];
  $scope.onClick = function (points, evt) 
  {
    console.log(points, evt);
  };
  $scope.datasetOverride = [{ yAxisID: 'y-axis-1' }];
  $scope.options = 
  {
    scales: 
    {
      yAxes: 
      [
        {
          id: 'y-axis-1',
          type: 'linear',
          display: true,
          position: 'left'
        }
      ]
    }
  };
});