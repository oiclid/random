'use strict';

app.controller('CareerController', function($scope, $location, toaster, Career, Auth) {

	$scope.createCareer = function() {	
		$scope.career.status = 'open';
		$scope.career.gravatar = Auth.user.profile.gravatar;
		$scope.career.name = Auth.user.profile.name;
		$scope.career.poster = Auth.user.uid;

		Career.createCareer($scope.career).then(function(ref) {
			toaster.pop('success', 'Career created successfully.');
			$scope.career = {title: '', description: '', total: '', status: 'open', gravatar: '', name: '', poster: ''};
			$location.path('/browse/' + ref.key());
		});
	};

	$scope.editCareer = function(career) {
		Career.editCareer(career).then(function() {			
			toaster.pop('success', "Career is updated.");
		});
	};
	
});