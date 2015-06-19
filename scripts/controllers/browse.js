'use strict';

app.controller('BrowseController', function($scope, $routeParams, toaster, Career, Auth, Comment, Offer) {

	$scope.searchCareer = '';		
	$scope.careers = Career.all;

	$scope.user = Auth.user;
	$scope.signedIn = Auth.signedIn;

	$scope.listMode = true;
	
	if($routeParams.careerId) {
		var career = Career.getCareer($routeParams.careerId).$asObject();
		$scope.listMode = false;
		setSelectedCareer(career);	
	}	
		
	function setSelectedCareer(career) {
		$scope.selectedCareer = career;
		
		// We check isCareerCreator only if user signedIn 
		// so we don't have to check every time normal guests open the career
		if($scope.signedIn()) {
			
			// Check if the current login user has already made an offer for selected career
			Offer.isOfferred(career.$id).then(function(data) {
				$scope.alreadyOffered = data;
			});

			// Check if the current login user is the creator of selected career
			$scope.isCareerCreator = Career.isCreator;

			// Check if the selectedCareer is open
			$scope.isOpen = Career.isOpen;

			// Unblock the Offer button on Offer modal
			// $scope.offer = {close: ''};	
			$scope.block = false;

			// Check if the current login user is offer maker (to display Cancel Offer button)
			$scope.isOfferMaker = Offer.isMaker;

			// --------------------------------------------//

			// Check if the current user is assigned fot the selected career
			$scope.isAssignee = Career.isAssignee;

			// Check if the selectedCareer is completed
			$scope.isCompleted = Career.isCompleted;

		}
		
		// Get list of comments for the selected career
		$scope.comments = Comment.comments(career.$id);

		// Get list of offers for the selected career
		$scope.offers = Offer.offers(career.$id);		
	};

	// --------------- TASK ---------------	

	$scope.cancelCareer = function(careerId) {
		Career.cancelCareer(careerId).then(function() {
			toaster.pop('success', "This career is cancelled successfully.");
		});
	};

	// --------------------------------------------//

	$scope.completeCareer = function(careerId) {
		Career.completeCareer(careerId).then(function() {
			toaster.pop('success', "Congratulation! You have completed this career.");
		});
	};

	// --------------- COMMENT ---------------	

	$scope.addComment = function() {
		var comment = {
			content: $scope.content,
			name: $scope.user.profile.name,
			gravatar: $scope.user.profile.gravatar
		};

		Comment.addComment($scope.selectedCareer.$id, comment).then(function() {				
			$scope.content = '';		
		});		
	};

	// --------------- OFFER ---------------

	$scope.makeOffer = function() {
		var offer = {
			total: $scope.total,
			uid: $scope.user.uid,			
			name: $scope.user.profile.name,
			gravatar: $scope.user.profile.gravatar 
		};

		Offer.makeOffer($scope.selectedCareer.$id, offer).then(function() {
			toaster.pop('success', "Your offer has been placed.");
			
			// Mark that the current user has offerred for this career.
			$scope.alreadyOffered = true;
			
			// Reset offer form
			$scope.total = '';

			// Disable the "Offer Now" button on the modal
			$scope.block = true;			
		});		
	};

	$scope.cancelOffer = function(offerId) {
		Offer.cancelOffer($scope.selectedCareer.$id, offerId).then(function() {
			toaster.pop('success', "Your offer has been cancelled.");

			// Mark that the current user has cancelled offer for this career.
			$scope.alreadyOffered = false;

			// Unblock the Offer button on Offer modal
			$scope.block = false;			
		});
	};

	// --------------------------------------------//

	$scope.acceptOffer = function(offerId, runnerId) {
		Offer.acceptOffer($scope.selectedCareer.$id, offerId, runnerId).then(function() {
			toaster.pop('success', "Offer is accepted successfully!");

			// Mark that this Career has been assigned
			// $scope.isAssigned = true;

			// Notify assignee
			Offer.notifyRunner($scope.selectedCareer.$id, runnerId);
		});
	};


	
});