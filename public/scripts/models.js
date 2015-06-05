console.log(userId)

var Floor = Backbone.Model.extend({
	urlRoot: 'housekeepers/floors',
	initialize: function(){
		console.log("floors initialized");
        }
});
	