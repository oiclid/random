'use strict';

app.factory('Comment', function(FURL, $firebase) {

	var ref = new Firebase(FURL);	

	var Comment = {
		comments: function(careerId) {
			return $firebase(ref.child('comments').child(careerId)).$asArray();
		},

		addComment: function(careerId, comment) {
			var career_comments = this.comments(careerId);
			comment.datetime = Firebase.ServerValue.TIMESTAMP;

			if(career_comments) {
				return career_comments.$add(comment);	
			}			
		}
	};

	return Comment;
});