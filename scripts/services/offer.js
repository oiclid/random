'use strict';

app.factory('Offer', function("http://career-app.firebaseio.com", $firebase, $q, Auth, Career) {
	var ref = new Firebase("http://career-app.firebaseio.com");
	var user = Auth.user;

	var Offer = {
		offers: function(careerId) {
			return $firebase(ref.child('offers').child(careerId)).$asArray();
		},

		makeOffer: function(careerId, offer) {
			var career_offers = this.offers(careerId);

			if(career_offers) {
				return career_offers.$add(offer);
			}
		},

		// This function is to check if the login user already made offer for this career.
		// This to prevent a user from offering more than 1.
		isOfferred: function(careerId) {

			if(user && user.provider) {
				var d = $q.defer();

				$firebase(ref.child('offers').child(careerId).orderByChild("uid")
					.equalTo(user.uid))
					.$asArray()
					.$loaded().then(function(data) {						
						d.resolve(data.length > 0);
					}, function() {
						d.reject(false);
					});

				return d.promise;
			}
			
		},

		isMaker: function(offer) {
			return (user && user.provider && user.uid === offer.uid);
		},

		getOffer: function(careerId, offerId) {
			return $firebase(ref.child('offers').child(careerId).child(offerId));
		},

		cancelOffer: function(careerId, offerId) {
			return this.getOffer(careerId, offerId).$remove();			
		},

		//-----------------------------------------------//

		acceptOffer: function(careerId, offerId, runnerId) {
			// Step 1: Update Offer with accepted = true
			var o = this.getOffer(careerId, offerId);
			return o.$update({accepted: true})
				.then(function() {				
						
					// Step 2: Update Career with status = "assigned" and runnerId
					var t = Career.getCareer(careerId);			
					return t.$update({status: "assigned", runner: runnerId});	
				})
				.then(function() {					

					// Step 3: Create User-Careers lookup record for use in Dashboard
					return Career.createUserCareers(careerId);
				});
		},

		notifyRunner: function(careerId, runnerId) {
			// Get runner's profile
			Auth.getProfile(runnerId).$loaded().then(function(runner) {
				var n = {
					careerId: careerId,
					email: runner.email,
					name: runner.name
				};

				// Create Notification and Zapier will delete it after use.
				var notification = $firebase(ref.child('notifications')).$asArray();
				return notification.$add(n);	
			});
		}

	};

	return Offer;

})