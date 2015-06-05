console.log(userId)

var Floor = Backbone.Model.extend({
	urlRoot: '/housekeepers/'+ userId +'/floors',
	initialize: function(){
		console.log("floors initialized");
        }
});
	