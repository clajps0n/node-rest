var appPost = angular.module("appPost",[]);

appPost.controller("postController",function($scope,$http)
{
    $scope.posts = [];
    $scope.responses = [];
    $scope.addPost = function()
    {
        $http.post("/accars",
        {
            message : $scope.newPost.message
        })
        .success(function(data,status,headers,config)
        {
            $scope.posts.push($scope.newPost);
            $scope.responses.push(data);
            console.log(data);
            $scope.newPost = {};
        })
        .error(function(error,status,headers,config)
        {
            console.log(error);
        });
    }
});