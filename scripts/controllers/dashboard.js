'use strict';

app.controller('DashboardController', function($scope, Dashboard, Auth) {

	$scope.careerRunner = [];
	$scope.careerPoster = [];

	var uid = Auth.user.uid;

	Dashboard.getCareersForUser(uid).then(function(careers) {

		for(var i = 0; i < careers.length; i++) {
			careers[i].type? $scope.careerPoster.push(careers[i]) : $scope.careerRunner.push(careers[i]) 
		}

		$scope.numPoster = $scope.careerPoster.length;
		$scope.numRunner = $scope.careerRunner.length;
	});
	
});