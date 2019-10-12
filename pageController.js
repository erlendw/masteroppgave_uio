var App = angular.module('App', ['ngRoute', 'ngMessages', 'ngSanitize', 'ngCookies','angular-jwt','ngResource','chart.js','angular-momentjs']);

App.config(function ($routeProvider) {

    $routeProvider
    //admin
        .when('/', {templateUrl: 'pages/dashboard.html', controller: 'dashController'});

});

App.controller('dashController', function ($scope, $http) {

    $scope.init = function(){

        var req = {
            method: 'GET',
            url: 'http://40.69.89.94:8080/api/plant'
        };
        $http(req).then(function(out){

            console.log(out.data)

            $scope.a = [];
            $scope.b = [];

            $scope.x = [];
            $scope.y = [];



            for(i = 0; i < out.data.length; i++){

                //
                //if(i % 60 ==0){

                if(out.data[i].chipcode == 8969837.000000){

                    $scope.a.push((((68/out.data[i].soilMoisture)*100)));

                }

                if(out.data[i].chipcode == 1800741.000000){

                    $scope.x.push((((68/out.data[i].soilMoisture)*100)));

                }

                if(out.data[i].chipcode == 1796642.000000){

                    $scope.y.push((((68/out.data[i].soilMoisture)*100)));

                    //$scope.b.push(date.toLocaleString())

                    date = new Date(out.data[i].time)


                    if(i%10 == 0){$scope.b.push(date.toLocaleString())}
                    else {$scope.b.push('')}

                }




                    //$scope.b.push('KL: ' + date.getHours() + ' Dato: ' + date.getDate() + '/' + date.getUTCFullYear())

                //}



            }

            $scope.options = {

                datasetFill  : false,
                scaleShowGridLines: false,
                pointDot: false
            }

            $scope.plants = $scope.a;

            $scope.labels = $scope.b;

            $scope.data = [
                $scope.a,$scope.x,$scope.y
            ];
            $scope.onClick = function (points, evt) {
                console.log(points, evt);
            };

        });




    };
});


App.run(function ($rootScope) {

    $rootScope.$on('$viewContentLoaded',function(){
        jQuery('html, body').animate({ scrollTop: 0 }, 0);
    });

});