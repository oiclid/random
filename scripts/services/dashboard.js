'use strict';

app.factory('Dashboard', function(FURL, $firebase, $q) {
	var ref = new Firebase(FURL);

	var Dashboard = {
		
		getCareersForUser: function(uid) {
			var defer = $q.defer();

			$firebase(ref.child('user_careers').child(uid))
				.$asArray()
				.$loaded()
				.then(function(careers) {					
					defer.resolve(careers);
				}, function(err) {
					defer.reject();
				});

			return defer.promise;
		}
	};

	return Dashboard;
});