'use strict';

app.factory('Career', function(FURL, $firebase, Auth) {
	var ref = new Firebase(FURL);
	var careers = $firebase(ref.child('careers')).$asArray();
	var user = Auth.user;

	var Career = {
		all: careers,

		getCareer: function(careerId) {
			return $firebase(ref.child('careers').child(careerId));
		},

		createCareer: function(career) {
			career.datetime = Firebase.ServerValue.TIMESTAMP;
			return careers.$add(career).then(function(newCareer) {
				
				// Create User-Careers lookup record for POSTER
				var obj = {
					careerId: newCareer.key(),
					type: true,
					title: career.title
				};

				return $firebase(ref.child('user_careers').child(career.poster)).$push(obj);
			});
		},

		createUserCareers: function(careerId) {
			Career.getCareer(careerId)
				.$asObject()
				.$loaded()
				.then(function(career) {
					
					// Create User-Careers lookup record for RUNNER
					var obj = {
						careerId: careerId,
						type: false,
						title: career.title
					}

					return $firebase(ref.child('user_careers').child(career.runner)).$push(obj);	
				});	
		},

		editCareer: function(career) {
			var t = this.getCareer(career.$id);			
			return t.$update({title: career.title, description: career.description, total: career.total});
		},

		cancelCareer: function(careerId) {
			var t = this.getCareer(careerId);
			return t.$update({status: "cancelled"});
		},

		isCreator: function(career) {			
			return (user && user.provider && user.uid === career.poster);
		},

		isOpen: function(career) {
			return career.status === "open";
		},

		// --------------------------------------------------//

		isAssignee: function(career) {
			return (user && user.provider && user.uid === career.runner);	
		},

		completeCareer: function(careerId) {
			var t = this.getCareer(careerId);
			return t.$update({status: "completed"});
		},

		isCompleted: function(career) {
			return career.status === "completed";
		}
	};

	return Career;

});